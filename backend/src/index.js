import fastify from 'fastify';
import cors from '@fastify/cors';
import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
dotenv.config();
const prisma = new PrismaClient();
const app = fastify({ logger: true });
// Registry of active sockets
const socketRegistry = new Map(); // socket.id -> userId
const deviceRegistry = new Map(); // socket.id -> deviceId
const start = async () => {
    try {
        await app.register(cors, {
            origin: true, // Allow all origins for development
        });
        app.get('/health', async () => {
            return { status: 'ok' };
        });
        await app.listen({ port: Number(process.env.PORT) || 3001, host: '0.0.0.0' });
        const io = new Server(app.server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });
        io.on('connection', (socket) => {
            console.log(`Connection established: ${socket.id}`);
            // 1. Device Handshake (Now supports IMEI/Hardware Fingerprinting)
            socket.on('device:handshake', async (data) => {
                try {
                    const device = await prisma.device.findUnique({
                        where: { provisioningKey: data.provisioningKey },
                        include: { owner: true }
                    });
                    if (!device) {
                        socket.emit('error', { message: 'Invalid provisioning key' });
                        return;
                    }
                    // Unattended Access Auto-Approval
                    // Once a device connects securely with a valid provisioningKey, it is permanently trusted (AnyDesk style unattended access)
                    await prisma.device.update({
                        where: { id: device.id },
                        data: {
                            status: 'ONLINE',
                            isApproved: true, // Permanent Unattended Access Granted
                            lastSeen: new Date(),
                            hardwareHash: device.hardwareHash || data.hardwareHash || null // Bind Hardware DNA (IMEI)
                        }
                    });
                    deviceRegistry.set(socket.id, device.id);
                    socketRegistry.set(socket.id, device.ownerId);
                    socket.join(`user:${device.ownerId}`);
                    socket.join(`device:${device.id}`);
                    socket.emit('handshake:success', {
                        deviceName: device.name,
                        ownerName: device.owner.name,
                        isApproved: true
                    });
                    // Notify web console that device is online
                    io.to(`user:${device.ownerId}`).emit('device:status', {
                        deviceId: device.id,
                        status: 'ONLINE',
                        isApproved: true
                    });
                    // Proximity manual approval popups have been disabled for unattended access.
                }
                catch (error) {
                    console.error('Handshake error:', error);
                    socket.emit('error', { message: 'Internal server error during handshake' });
                }
            });
            // 2. Web Client Handshake
            socket.on('web:handshake', (data) => {
                socketRegistry.set(socket.id, data.userId);
                socket.join(`user:${data.userId}`);
                console.log(`Web client connected for user: ${data.userId}`);
                // When web client connects, broadcast its signal for ZK Handshake exchange
                io.to(`user:${data.userId}`).emit('pair:available', {
                    webId: socket.id,
                    publicKey: data.publicKey
                });
            });
            // 3. ZERO-KNOWLEDGE RELAY
            socket.on('relay:tunnel', (data) => {
                const userId = socketRegistry.get(socket.id);
                if (!userId)
                    return;
                io.to(data.targetId).emit('relay:receive', {
                    from: socket.id,
                    payload: data.payload
                });
            });
            // 4. Manual Pairing / Approval via Password
            socket.on('device:approve', async (data) => {
                const userId = socketRegistry.get(socket.id);
                if (!userId)
                    return;
                // Here we would verify the passwordHash matches the one set on the device
                // and update the DB
                await prisma.device.update({
                    where: { id: data.deviceId },
                    data: { isApproved: true }
                });
                io.to(`device:${data.deviceId}`).emit('approval:confirmed');
                io.to(`user:${userId}`).emit('device:status', {
                    deviceId: data.deviceId,
                    status: 'ONLINE',
                    isApproved: true
                });
            });
            // 5. Command Execution
            socket.on('command:exec', async (data) => {
                const userId = socketRegistry.get(socket.id);
                if (!userId)
                    return;
                const dbDevice = await prisma.device.findUnique({ where: { id: data.targetDeviceId } });
                if (!dbDevice?.isApproved && data.cmd !== 'sys:info') {
                    socket.emit('error', { message: 'Device Quarantine: Requires Physical Password Approval' });
                    return;
                }
                io.to(`device:${data.targetDeviceId}`).emit('command:run', {
                    cmd: data.cmd,
                    params: data.params,
                    ref: socket.id
                });
            });
            socket.on('disconnect', async () => {
                const deviceId = deviceRegistry.get(socket.id);
                if (deviceId) {
                    await prisma.device.update({
                        where: { id: deviceId },
                        data: { status: 'OFFLINE', lastSeen: new Date() }
                    });
                    const userId = socketRegistry.get(socket.id);
                    if (userId) {
                        io.to(`user:${userId}`).emit('device:status', {
                            deviceId,
                            status: 'OFFLINE'
                        });
                    }
                    deviceRegistry.delete(socket.id);
                }
                socketRegistry.delete(socket.id);
                console.log(`Disconnected: ${socket.id}`);
            });
        });
        console.log(`Backend Relay Server Online on port ${process.env.PORT || 3001}`);
    }
    catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};
start();
//# sourceMappingURL=index.js.map