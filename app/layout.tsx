import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Link from 'next/link';
import { LayoutDashboard, History, Settings, Terminal, Activity } from 'lucide-react';

const inter = Inter({ subsets: ["latin"] });

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const metadata: Metadata = {
  title: "ShiftOps | Blue-Green Control Plane",
  description: "Automated Blue-Green deployment and traffic management dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn(inter.className, "bg-background text-white antialiased")}>
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="w-64 border-r border-border bg-surface flex flex-col fixed inset-y-0">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                  <Activity size={20} className="text-white" />
                </div>
                <h1 className="text-xl font-bold tracking-tighter">ShiftOps</h1>
              </div>

              <nav className="space-y-1">
                <NavLink href="/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" />
                <NavLink href="/history" icon={<History size={18} />} label="Deployment History" />
                <NavLink href="/settings" icon={<Settings size={18} />} label="Settings" />
              </nav>
            </div>

            <div className="mt-auto p-6 border-t border-border">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 font-bold text-xs">AM</div>
                <div className="overflow-hidden">
                  <p className="text-sm font-bold truncate">Arnab Mal</p>
                  <p className="text-[10px] text-gray-500 font-mono">arnazz10</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 ml-64 p-12">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all group">
      <span className="group-hover:text-blue-500 transition-colors">{icon}</span>
      {label}
    </Link>
  );
}
