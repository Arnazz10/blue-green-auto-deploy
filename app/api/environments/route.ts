import { NextResponse } from 'next/server';
import { engine } from '@/lib/mockEngine';

export async function GET() {
    const state = engine.getState();
    return NextResponse.json({
        blue: state.blue,
        green: state.green
    });
}
