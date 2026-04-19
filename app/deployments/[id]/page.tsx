"use client";

import React, { useEffect, useState } from 'react';
import StageTimeline from '@/components/StageTimeline';
import LogViewer from '@/components/LogViewer';
import { ChevronLeft, Calendar, User, Hash } from 'lucide-react';
import Link from 'next/link';

export default function DeploymentDetail({ params }: { params: { id: string } }) {
    const [run, setRun] = useState<any>(null);

    const fetchData = async () => {
        const res = await fetch(`/api/deployments/${params.id}`);
        if (res.ok) {
            const data = await res.json();
            setRun(data);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 2000);
        return () => clearInterval(interval);
    }, [params.id]);

    if (!run) return <div className="p-12 text-gray-500 font-mono">Loading deployment metadata...</div>;

    return (
        <div className="space-y-8 max-w-6xl">
            <Link href="/history" className="text-sm text-gray-500 hover:text-blue-500 flex items-center gap-2 transition-colors">
                <ChevronLeft size={16} /> Back to History
            </Link>

            <div className="flex justify-between items-end">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold tracking-tight">Deploying {run.version}</h1>
                        <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-bold border border-blue-500/20">
                            {run.status}
                        </span>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                        <span className="flex items-center gap-2"><Hash size={14} /> {run.id}</span>
                        <span className="flex items-center gap-2"><User size={14} /> {run.triggeredBy}</span>
                        <span className="flex items-center gap-2"><Calendar size={14} /> {new Date(run.startTime).toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-8">
                <div className="col-span-1">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6">Pipeline Stages</h3>
                    <StageTimeline stages={run.stages} />
                </div>
                <div className="col-span-2">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6">Execution Logs</h3>
                    <LogViewer deploymentId={params.id} />
                </div>
            </div>
        </div>
    );
}
