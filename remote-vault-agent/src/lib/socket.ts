import { io, Socket } from 'socket.io-client';
import { getHardwareId, getSystemInfo } from './hardware';

const SOCKET_URL = 'https://remote-vault-core.onrender.com';

class SocketService {
  private socket: Socket | null = null;
  private isConnected: boolean = false;

  async connect(provisioningKey: string, onEvent: (event: string, data: any) => void) {
    if (this.socket?.connected) return;

    const hardwareHash = await getHardwareId();
    const systemInfo = await getSystemInfo();

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'], // Add polling fallback
      reconnection: true,
      reconnectionAttempts: 10,
    });

    this.socket.on('connect_error', (err) => {
      console.error('[CORE] Connection failed:', err.message);
      onEvent('error', `Connection Failure: ${err.message}`);
    });

    this.socket.on('connect', () => {
      this.isConnected = true;
      onEvent('status', 'ONLINE');
      
      this.socket?.emit('device:handshake', {
        provisioningKey,
        hardwareHash,
        type: systemInfo.type,
        name: systemInfo.deviceName
      });
    });

    this.socket.on('handshake:success', (data) => {
      onEvent('handshake:success', data);
      this.startHeartbeat();
    });

    this.socket.on('command:run', async (data) => {
      onEvent('command', data);
      // Handle commands here or pass to UI
      const result = await this.handleCommand(data.cmd, data.params);
      this.socket?.emit('command:result', {
        ref: data.ref,
        output: result
      });
    });

    this.socket.on('error', (data) => {
      onEvent('error', data.message);
    });

    this.socket.on('disconnect', () => {
      this.isConnected = false;
      onEvent('status', 'OFFLINE');
    });
  }

  private async startHeartbeat() {
    setInterval(async () => {
      if (this.socket?.connected) {
        const stats = await getSystemInfo();
        this.socket.emit('heartbeat', {
            stats: stats
        });
      }
    }, 10000);
  }

  private async handleCommand(cmd: string, params: any): Promise<string> {
    switch (cmd) {
      case 'sys:info':
        const info = await getSystemInfo();
        return JSON.stringify(info);
      case 'sys:ping':
        return 'PONG';
      default:
        return `Unknown command: ${cmd}`;
    }
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }
}

export const socketService = new SocketService();
