import { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSession } from 'next-auth/react';
import { CryptoVault } from '@/lib/crypto';

// The URL of our Backend Relay Server
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

export function useSocket() {
  const { data: session } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [deviceStatuses, setDeviceStatuses] = useState<Record<string, string>>({});
  const [sessionKeys, setSessionKeys] = useState<Record<string, CryptoKey>>({});
  const socketRef = useRef<Socket | null>(null);
  const localKeyPairRef = useRef<CryptoKeyPair | null>(null);

  useEffect(() => {
    if (!session?.user?.email) return;

    const initializeSocket = async () => {
        // Prepare local crypto keys for Zero-Knowledge Handshake
        localKeyPairRef.current = await CryptoVault.generateKeyPair();
        const publicKeyStr = await CryptoVault.exportPublicKey(localKeyPairRef.current.publicKey);

        const socketInstance = io(SOCKET_URL, {
            transports: ['websocket'],
            reconnectionAttempts: 5,
        });

        socketRef.current = socketInstance;
        setSocket(socketInstance);

        socketInstance.on('connect', () => {
            setIsConnected(true);
            socketInstance.emit('web:handshake', { 
                userId: session?.user?.email,
                publicKey: publicKeyStr // Broadcast our public key for pairing
            });
            console.log('Connected to Relay Server (ZK-Handshake Ready)');
        });

        // Handle incoming Key Exchange from a node
        socketInstance.on('handshake:exchange', async (data: { deviceId: string, publicKey: string }) => {
            if (!localKeyPairRef.current) return;
            
            console.log(`Establishing E2EE Tunnel with Node: ${data.deviceId}`);
            const remotePubKey = await CryptoVault.importPublicKey(data.publicKey);
            const sharedKey = await CryptoVault.deriveSessionKey(
                localKeyPairRef.current.privateKey,
                remotePubKey
            );

            setSessionKeys(prev => ({ ...prev, [data.deviceId]: sharedKey }));
            console.log(`✅ E2EE Tunnel Established for ${data.deviceId}`);
        });

        socketInstance.on('disconnect', () => {
            setIsConnected(false);
            console.log('Disconnected from Relay Server');
        });

        socketInstance.on('device:status', (data: { deviceId: string, status: string }) => {
            setDeviceStatuses(prev => ({
                ...prev,
                [data.deviceId]: data.status
            }));
        });
    };

    initializeSocket();

    return () => {
      socketRef.current?.disconnect();
    };
  }, [session]);

  const executeSecureCommand = useCallback(async (targetDeviceId: string, cmd: string, params: any = {}) => {
    const sessionKey = sessionKeys[targetDeviceId];
    if (!socketRef.current || !isConnected || !sessionKey) {
        console.error("Secure tunnel not established for this device.");
        return;
    }

    const payload = JSON.stringify({ cmd, params, ts: Date.now() });
    const encrypted = await CryptoVault.encrypt(payload, sessionKey);

    socketRef.current.emit('relay:tunnel', {
        targetId: `device:${targetDeviceId}`,
        payload: encrypted
    });
  }, [isConnected, sessionKeys]);

  const sendCommand = useCallback((targetDeviceId: string, cmd: string, params: any = {}) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('command:exec', { targetDeviceId, cmd, params });
    }
  }, [isConnected]);

  return {
    socket,
    isConnected,
    deviceStatuses,
    sessionKeys,
    executeSecureCommand,
    sendCommand
  };
}
