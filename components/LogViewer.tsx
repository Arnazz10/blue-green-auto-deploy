"use client";

import React, { useEffect, useRef, useState } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Terminal, Search, Trash2, Download, Play, Pause } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface LogEntry {
    timestamp: string;
    message: string;
}

interface LogViewerProps {
    deploymentId: string;
}

export default function LogViewer({ deploymentId }: LogViewerProps) {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [isPaused, setIsPaused] = useState(false);
    const [search, setSearch] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isPaused) return;

        const eventSource = new EventSource(`/api/logs/${deploymentId}`);

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setLogs(prev => [...prev, data]);
        };

        return () => {
            eventSource.close();
        };
    }, [deploymentId, isPaused]);

    useEffect(() => {
        if (!isPaused && scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs, isPaused]);

    const filteredLogs = logs.filter(log => 
        log.message.toLowerCase().includes(search.toLowerCase())
    );

    const parseLogMessage = (msg: string) => {
        if (msg.includes('[BLUE]')) return <span className="text-blue-400 font-bold">{msg}</span>;
        if (msg.includes('[GREEN]')) return <span className="text-green-400 font-bold">{msg}</span>;
        if (msg.includes('SUCCESS') || msg.includes('PASS')) return <span className="text-green-500 font-bold">{msg}</span>;
        if (msg.includes('FAILED')) return <span className="text-red-500 font-bold">{msg}</span>;
        if (msg.includes('SWITCH')) return <span className="text-amber-500 font-bold italic underline">{msg}</span>;
        return <span>{msg}</span>;
    };

    return (
        <div className="flex flex-col h-[600px] border border-border rounded-xl bg-[#0a0c10] overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-center justify-between p-4 bg-surface border-b border-border">
                <div className="flex items-center gap-3">
                    <Terminal size={18} className="text-gray-400" />
                    <h3 className="font-bold text-white text-sm">Real-time Stream: {deploymentId}</h3>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input 
                            type="text" 
                            placeholder="Filter logs..."
                            className="bg-background border border-border rounded-md pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500/50 w-64"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={() => setIsPaused(!isPaused)}
                        className={cn(
                            "p-2 rounded-md transition-all border",
                            isPaused ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-background border-border text-gray-400 hover:text-white"
                        )}
                    >
                        {isPaused ? <Play size={14} /> : <Pause size={14} />}
                    </button>
                    <button 
                        onClick={() => setLogs([])}
                        className="p-2 rounded-md bg-background border border-border text-gray-400 hover:text-white transition-all"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>

            {/* Log Stream */}
            <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 font-mono text-[13px] leading-relaxed select-text"
            >
                {filteredLogs.length === 0 && (
                    <div className="h-full flex items-center justify-center text-gray-600 italic">
                        Waiting for log stream...
                    </div>
                )}
                {filteredLogs.map((log, i) => (
                    <div key={i} className="flex gap-4 group hover:bg-white/5 py-0.5 px-2 -mx-2 rounded transition-colors">
                        <span className="text-gray-600 shrink-0 select-none">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                        <div className="text-gray-300 break-all">
                            {parseLogMessage(log.message)}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="p-3 bg-surface border-t border-border flex justify-between items-center text-[11px] text-gray-500">
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        CONNECTED
                    </span>
                    <span>{filteredLogs.length} LINES</span>
                </div>
                <div className="flex items-center gap-3">
                    {isPaused && <span className="text-amber-500 font-bold uppercase tracking-widest">Paused</span>}
                    <button className="hover:text-white flex items-center gap-1 transition-colors">
                        <Download size={12} /> EXPORT
                    </button>
                </div>
            </div>
        </div>
    );
}
