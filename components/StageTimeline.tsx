import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CheckCircle2, Circle, Loader2, XCircle } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Stage {
    id: string;
    name: string;
    status: 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILED';
    duration?: number;
    description: string;
}

interface StageTimelineProps {
    stages: Stage[];
}

export default function StageTimeline({ stages }: StageTimelineProps) {
    return (
        <div className="space-y-4">
            {stages.map((stage, idx) => (
                <div key={stage.id} className="group relative">
                    {idx !== stages.length - 1 && (
                        <div className={cn(
                            "absolute left-[19px] top-10 bottom-0 w-0.5 transition-colors duration-500",
                            stage.status === 'SUCCESS' ? "bg-green-500" : "bg-border"
                        )} />
                    )}
                    
                    <div className="flex items-start gap-6">
                        <div className={cn(
                            "relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 bg-background",
                            stage.status === 'SUCCESS' ? "border-green-500 text-green-500" :
                            stage.status === 'RUNNING' ? "border-amber-500 text-amber-500" :
                            stage.status === 'FAILED' ? "border-red-500 text-red-500" :
                            "border-border text-gray-500"
                        )}>
                            {stage.status === 'SUCCESS' && <CheckCircle2 size={18} />}
                            {stage.status === 'RUNNING' && <Loader2 size={18} className="animate-spin" />}
                            {stage.status === 'FAILED' && <XCircle size={18} />}
                            {stage.status === 'PENDING' && <Circle size={18} />}
                        </div>

                        <div className={cn(
                            "flex-1 p-4 rounded-xl border transition-all duration-500",
                            stage.status === 'RUNNING' ? "bg-surface border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.1)]" :
                            stage.status === 'SUCCESS' ? "border-border hover:border-green-500/30" :
                            "border-border opacity-50"
                        )}>
                            <div className="flex justify-between items-center mb-1">
                                <h4 className="font-bold text-white tracking-tight leading-none">{stage.name}</h4>
                                {stage.duration && (
                                    <span className="text-[10px] font-mono text-gray-500">{(stage.duration / 1000).toFixed(1)}s</span>
                                )}
                            </div>
                            <p className="text-sm text-gray-400 font-mono">{stage.description}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
