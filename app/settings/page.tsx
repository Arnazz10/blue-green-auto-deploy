"use client";

import React from 'react';
import { Settings as SettingsIcon, Link as LinkIcon, Database, Globe, Sliders } from 'lucide-react';

export default function Settings() {
    return (
        <div className="space-y-8 max-w-4xl">
            <div>
                <h1 className="text-4xl font-bold tracking-tight mb-2">Platform Settings</h1>
                <p className="text-gray-400">Configure cluster contexts, external webhooks, and deployment strategies.</p>
            </div>

            <div className="space-y-6">
                <section className="bg-surface border border-border rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Database className="text-blue-500" size={20} />
                        <h2 className="text-lg font-bold">Kubernetes Context</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Cluster Endpoint</label>
                            <input type="text" readOnly value="https://k8s.shiftops.internal:6443" className="w-full bg-background border border-border p-2 rounded text-sm text-gray-400 font-mono" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Current Namespace</label>
                            <input type="text" readOnly value="production-blue-green" className="w-full bg-background border border-border p-2 rounded text-sm text-gray-400 font-mono" />
                        </div>
                    </div>
                </section>

                <section className="bg-surface border border-border rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <LinkIcon className="text-green-500" size={20} />
                        <h2 className="text-lg font-bold">Jenkins Integration</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Webhook URL</label>
                            <div className="flex gap-2">
                                <input type="text" readOnly value="https://jenkins.shiftops.internal/generic-webhook-trigger/invoke" className="flex-1 bg-background border border-border p-2 rounded text-sm text-gray-400 font-mono" />
                                <button className="px-4 py-2 bg-blue-600 rounded text-xs font-bold">COPY</button>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-surface border border-border rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Sliders className="text-amber-500" size={20} />
                        <h2 className="text-lg font-bold">Traffic Strategy</h2>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <StrategyCard title="Instant" description="100% traffic switch immediately." active />
                        <StrategyCard title="Canary" description="10% -> 50% -> 100% split." />
                        <StrategyCard title="Manual" description="Confirm every 10% increment." />
                    </div>
                </section>
            </div>
        </div>
    );
}

function StrategyCard({ title, description, active }: { title: string; description: string; active?: boolean }) {
    return (
        <div className={cn(
            "p-4 rounded-lg border transition-all cursor-pointer",
            active ? "border-blue-500 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.1)]" : "border-border hover:border-gray-500"
        )}>
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-white text-sm">{title}</h3>
                {active && <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />}
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
        </div>
    );
}

function cn(...inputs: any[]) {
    return twMerge(clsx(inputs));
}

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
