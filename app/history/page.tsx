"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Filter, Download } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function History() {
    const [deployments, setDeployments] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch('/api/deploy'); // Reuse the list endpoint
            const data = await res.json();
            setDeployments(data);
        };
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight mb-2">Audit History</h1>
                    <p className="text-gray-400">Track all deployment events and traffic switches across environments.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-surface border border-border rounded-lg text-sm font-bold text-gray-400 flex items-center gap-2 hover:text-white transition-colors">
                        <Filter size={14} /> FILTER
                    </button>
                    <button className="px-4 py-2 bg-surface border border-border rounded-lg text-sm font-bold text-gray-400 flex items-center gap-2 hover:text-white transition-colors">
                        <Download size={14} /> EXPORT CSV
                    </button>
                </div>
            </div>

            <div className="bg-surface border border-border rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-border bg-background/50">
                            <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Deploy ID</th>
                            <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Version</th>
                            <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Status</th>
                            <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Triggered By</th>
                            <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Date</th>
                            <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {deployments.length === 0 && (
                            <tr>
                                <td colSpan={6} className="p-12 text-center text-gray-500 italic">No deployments recorded yet.</td>
                            </tr>
                        )}
                        {deployments.map((run) => (
                            <tr key={run.id} className="hover:bg-white/5 transition-colors group">
                                <td className="p-4 font-mono text-xs text-gray-400">{run.id}</td>
                                <td className="p-4">
                                    <span className="font-bold text-white">{run.version}</span>
                                </td>
                                <td className="p-4">
                                    <span className={cn(
                                        "px-2 py-0.5 rounded text-[10px] font-bold border",
                                        run.status === 'SUCCESS' ? "bg-green-500/10 text-green-500 border-green-500/20" :
                                        run.status === 'IN_PROGRESS' ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                                        run.status === 'FAILED' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                                        "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                    )}>
                                        {run.status}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-gray-300">{run.triggeredBy}</td>
                                <td className="p-4 text-sm text-gray-500">{new Date(run.startTime).toLocaleString()}</td>
                                <td className="p-4 text-right">
                                    <Link href={`/deployments/${run.id}`} className="text-blue-500 hover:text-blue-400 inline-flex items-center gap-1 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                        VIEW DETAILS <ChevronRight size={14} />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
