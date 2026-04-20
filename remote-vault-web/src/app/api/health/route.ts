import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // 1. Check Database using a simple query
    await prisma.$queryRaw`SELECT 1`;
    
    // 2. Check Backend Server
    const backendUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';
    const backendRes = await fetch(`${backendUrl}/health`, { 
      signal: AbortSignal.timeout(3000),
      cache: 'no-store'
    });
    
    if (!backendRes.ok) {
      throw new Error('Backend responded with error');
    }

    return NextResponse.json({ status: 'ok' }, { status: 200 });
  } catch (error: any) {
    console.error('System Health Check Failed:', error);
    return NextResponse.json({ 
      status: 'error', 
      message: 'System offline or unreachable' 
    }, { status: 503 });
  }
}
