import { NextResponse } from 'next/server';
import { engine } from '@/lib/mockEngine';

export async function POST() {
    const id = await engine.triggerDeploy();
    return NextResponse.json({ deployId: id });
}

export async function GET() {
    const state = engine.getState();
    return NextResponse.json(state.deployments);
}
