"use client";

import React, { useEffect, useState } from 'react';
import EnvironmentCard from '@/components/EnvironmentCard';
import TrafficSwitcher from '@/components/TrafficSwitcher';
import { Play, RotateCcw, AlertTriangle, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
    const [state, setState] = useState<any>(null);
    const [isDeploying, setIsDeploying] = useState(false);
    const [isSwitching, setIsSwitching] = useState(false);

    const fetchData = async () => {
        const res = await fetch('/api/environments');
        const data = await res.json();
        setState(data);
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleDeploy = async () => {
        setIsDeploying(true);
        const res = await fetch('/api/deploy', { method: 'POST' });
        const data = await res.json();
        // Redirect or show notification?
        // Let's just wait for the status to change via polling
        setIsDeploying(false);
    };

    const handleSwitch = async () => {
        setIsSwitching(true);
        await fetch('/api/switch', { method: 'POST' });
        setIsSwitching(false);
    };

    const handleRollback = async () => {
        if (!confirm("Are you sure you want to rollback to Blue? This will instantly redirect all traffic.")) return;
        await fetch('/api/rollback', { method: 'POST' });
    };

    if (!state) return <div className="p-12 animate-pulse text-gray-500 font-mono">Initializing control plane...</div>;

    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-4xl font-bold tracking-tight mb-2">Service Control Plane</h1>
                <p className="text-gray-400">Manage production traffic and deployment lifecycle for <code className="text-blue-500 font-bold">shiftops-core</code></p>
            </div>

            {/* Environments Grid */}
            <div className="grid grid-cols-2 gap-8">
                <EnvironmentCard type="BLUE" {...state.blue} />
                <EnvironmentCard type="GREEN" {...state.green} />
            </div>

            {/* Traffic Transition Area */}
            <div className="max-w-4xl">
                <TrafficSwitcher 
                    bluePercent={state.blue.trafficPercent}
                    greenPercent={state.green.trafficPercent}
                    onSwitch={handleSwitch}
                    disabled={state.green.status !== 'READY'}
                    isSwitching={isSwitching}
                />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-6">
                <div className="bg-surface border border-border p-6 rounded-xl hover:border-blue-500/30 transition-all group">
                    <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Play className="text-blue-500" />
                    </div>
                    <h3 className="font-bold text-white mb-2">Deploy to Green</h3>
                    <p className="text-xs text-gray-500 mb-4 leading-relaxed">Trigger a new deployment pipeline targeting the Green environment.</p>
                    <button 
                        onClick={handleDeploy}
                        disabled={state.green.status === 'DEPLOYING' || isDeploying}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 rounded-md font-bold text-sm transition-colors"
                    >
                        {state.green.status === 'DEPLOYING' ? "DEPLOYING..." : "START DEPLOYMENT"}
                    </button>
                </div>

                <div className="bg-surface border border-border p-6 rounded-xl hover:border-amber-500/30 transition-all group">
                    <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <RotateCcw className="text-amber-500" />
                    </div>
                    <h3 className="font-bold text-white mb-2">Instant Rollback</h3>
                    <p className="text-xs text-gray-500 mb-4 leading-relaxed">Revert service selector to [BLUE] immediately in case of outage.</p>
                    <button 
                        onClick={handleRollback}
                        className="w-full py-2 bg-amber-600/10 text-amber-500 border border-amber-600/30 hover:bg-amber-600 hover:text-white rounded-md font-bold text-sm transition-all"
                    >
                        ROLLBACK NOW
                    </button>
                </div>

                <div className="bg-surface border border-border p-6 rounded-xl hover:border-gray-500/30 transition-all group">
                    <div className="w-12 h-12 rounded-lg bg-gray-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <AlertTriangle className="text-gray-400" />
                    </div>
                    <h3 className="font-bold text-white mb-2">System Diagnostics</h3>
                    <p className="text-xs text-gray-500 mb-4 leading-relaxed">View cluster health, node resources, and pod logs.</p>
                    <Link href="/logs/latest" className="w-full py-2 bg-background border border-border hover:bg-white/5 rounded-md font-bold text-sm transition-all flex items-center justify-center gap-2">
                        VIEW CLUSTER LOGS <ExternalLink size={14} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
