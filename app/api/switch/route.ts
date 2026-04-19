import { NextResponse } from 'next/server';
import { engine } from '@/lib/mockEngine';

export async function POST() {
    await engine.switchTraffic();
    return NextResponse.json({ success: true });
}
