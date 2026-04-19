import { NextRequest } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        async start(controller) {
            const sendLog = (message: string) => {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ timestamp: new Date().toISOString(), message })}\n\n`));
            };

            const logs = [
                "[BLUE] Incoming request at /health",
                "[GREEN] Initializing deployment runner...",
                "[BLUE] Traffic: 100% active",
                "[GREEN] Fetching repo ShiftOps/app",
                "[GREEN] Running build step: npm install",
                "[GREEN] Build success: arnazz10/app:v2.1.0-green-a3f9c1",
                "[GREEN] Pushing to registry.hub.docker.com...",
                "[GREEN] Successfully pushed image",
                "[GREEN] Scaling up green pods: 5 replicas",
                "[GREEN] Smoke test: PASS /health",
                "[GREEN] Smoke test: PASS /ready",
                "[GREEN] Smoke test: PASS /version",
                "[SYSTEM] Deployment ready for traffic switch"
            ];

            let i = 0;
            const interval = setInterval(() => {
                if (i < logs.length) {
                    sendLog(logs[i]);
                    i++;
                } else {
                    // Send some heartbeat/repeating logs
                    sendLog(`[${Math.random() > 0.5 ? 'BLUE' : 'GREEN'}] Heartbeat check: OK`);
                }
            }, 800);

            request.signal.addEventListener('abort', () => {
                clearInterval(interval);
                controller.close();
            });
        },
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    });
}
