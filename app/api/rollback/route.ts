import { NextResponse } from 'next/server';
import { engine } from '@/lib/mockEngine';

export async function POST() {
    await engine.rollback();
    return NextResponse.json({ success: true });
}
