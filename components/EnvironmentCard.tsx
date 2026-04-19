import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ShieldCheck, ShieldAlert, Zap, Clock, Activity, Box } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface EnvCardProps {
    type: 'BLUE' | 'GREEN';
    version: string;
    imageDigest: string;
    podCount: number;
    status: 'LIVE' | 'STANDBY' | 'DEPLOYING' | 'FAILED' | 'READY';
    uptime: string;
    lastDeployed: string;
    trafficPercent: number;
}

export default function EnvironmentCard({
    type,
    version,
    imageDigest,
    podCount,
    status,
    uptime,
    lastDeployed,
    trafficPercent
}: EnvCardProps) {
    const isBlue = type === 'BLUE';
    const isLive = status === 'LIVE';
    
    return (
        <div className={cn(
            "relative p-6 rounded-xl border transition-all duration-500 overflow-hidden",
            "bg-surface",
            isLive ? (isBlue ? "border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.2)]" : "border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.2)]") : "border-border",
            status === 'DEPLOYING' && "animate-pulse border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
        )}>
            {/* Status Badge */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className={cn(
                        "text-sm font-bold tracking-widest mb-1",
                        isBlue ? "text-blue-500" : "text-green-500"
                    )}>{type} ENVIRONMENT</h3>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold font-mono text-white tracking-tight">{version}</span>
                    </div>
                </div>
                <div className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5",
                    status === 'LIVE' ? "bg-green-500/10 text-green-500 border border-green-500/20" :
                    status === 'STANDBY' ? "bg-gray-500/10 text-gray-500 border border-gray-500/20" :
                    status === 'DEPLOYING' ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                    "bg-red-500/10 text-red-500 border border-red-500/20"
                )}>
                    {status === 'LIVE' && <ShieldCheck size={14} />}
                    {status === 'STANDBY' && <ShieldAlert size={14} />}
                    {status === 'DEPLOYING' && <Zap size={14} className="animate-bounce" />}
                    {status}
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 uppercase font-bold flex items-center gap-1.5">
                        <Box size={10} /> Replicas
                    </label>
                    <p className="text-white font-mono text-lg">{podCount} Pods</p>
                </div>
                <div className="space-y-1 text-right">
                    <label className="text-[10px] text-gray-400 uppercase font-bold flex items-center justify-end gap-1.5">
                        <Clock size={10} /> Uptime
                    </label>
                    <p className="text-white font-mono text-lg">{uptime}</p>
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 uppercase font-bold flex items-center gap-1.5">
                        <Activity size={10} /> Traffic
                    </label>
                    <p className="text-white font-mono text-lg">{trafficPercent}%</p>
                </div>
                <div className="space-y-1 text-right">
                    <label className="text-[10px] text-gray-400 uppercase font-bold flex items-center justify-end gap-1.5">
                        <ShieldCheck size={10} /> Promoted
                    </label>
                    <p className="text-white font-mono text-sm">{lastDeployed}</p>
                </div>
            </div>

            {/* Digest Footer */}
            <div className="pt-4 border-t border-border">
                <p className="text-[10px] text-gray-500 font-mono truncate">ID: {imageDigest}</p>
            </div>

            {/* Traffic Visual Indicator */}
            {isLive && (
                <div className={cn(
                    "absolute bottom-0 left-0 h-1 transition-all duration-1000",
                    isBlue ? "bg-blue-500" : "bg-green-500"
                )} style={{ width: `${trafficPercent}%` }} />
            )}
        </div>
    );
}
