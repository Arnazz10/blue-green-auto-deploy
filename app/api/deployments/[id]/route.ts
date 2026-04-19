import { NextResponse } from 'next/server';
import { engine } from '@/lib/mockEngine';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const deployment = engine.getDeployment(params.id);
    if (!deployment) {
        return new NextResponse('Not Found', { status: 404 });
    }
    return NextResponse.json(deployment);
}
