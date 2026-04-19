import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { RefreshCcw, ArrowRightLeft } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TrafficSwitcherProps {
    bluePercent: number;
    greenPercent: number;
    onSwitch: () => void;
    disabled?: boolean;
    isSwitching?: boolean;
}

export default function TrafficSwitcher({
    bluePercent,
    greenPercent,
    onSwitch,
    disabled,
    isSwitching
}: TrafficSwitcherProps) {
    return (
        <div className="bg-surface border border-border rounded-xl p-8">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                        <ArrowRightLeft className="text-blue-500" size={20} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Traffic Control</h3>
                        <p className="text-sm text-gray-400">Manage service routing and split</p>
                    </div>
                </div>
                
                <button
                    onClick={onSwitch}
                    disabled={disabled || isSwitching}
                    className={cn(
                        "px-8 py-3 rounded-lg font-bold transition-all flex items-center gap-2 border-2",
                        (disabled || isSwitching) 
                            ? "border-border text-gray-500 cursor-not-allowed" 
                            : "border-green-500 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white"
                    )}
                >
                    {isSwitching ? <RefreshCcw className="animate-spin" size={18} /> : <RefreshCcw size={18} />}
                    {isSwitching ? "SWITCHING TRAFFIC..." : "SWITCH TO GREEN"}
                </button>
            </div>

            <div className="relative h-12 bg-background rounded-full overflow-hidden border border-border flex p-1">
                <div 
                    className="h-full bg-blue-500 rounded-full transition-all duration-[2000ms] ease-in-out relative group"
                    style={{ width: `${bluePercent}%` }}
                >
                    <span className="absolute inset-x-0 bottom-full mb-2 text-center text-xs font-bold text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">BLUE: {bluePercent}%</span>
                </div>
                <div 
                    className="h-full bg-green-500 rounded-full transition-all duration-[2000ms] ease-in-out relative group"
                    style={{ width: `${greenPercent}%` }}
                >
                    <span className="absolute inset-x-0 bottom-full mb-2 text-center text-xs font-bold text-green-500 opacity-0 group-hover:opacity-100 transition-opacity">GREEN: {greenPercent}%</span>
                </div>
            </div>

            <div className="flex justify-between mt-4">
                <div className="text-center">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Live</p>
                    <p className="text-sm font-mono font-bold text-blue-500">{bluePercent}%</p>
                </div>
                <div className="text-center">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Standby</p>
                    <p className="text-sm font-mono font-bold text-green-500">{greenPercent}%</p>
                </div>
            </div>
        </div>
    );
}
