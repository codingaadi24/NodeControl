"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield,
  MoreVertical,
  Laptop, 
  Smartphone, 
  Terminal, 
  Activity, 
  ShieldCheck, 
  Search, 
  Cpu, 
  Zap, 
  Plus, 
  ArrowUpRight, 
  Monitor, 
  RefreshCw,
  Globe,
  Signal,
  Command,
  ChevronRight,
  Database,
  BarChart3,
  Server,
  Lock
} from "lucide-react";
import Link from "next/link";
import { useSocket } from "@/hooks/useSocket";

interface Device {
  id: string;
  name: string;
  type: string;
  status: string;
  lastSeen: string;
  isApproved: boolean;
  capabilities: any;
}

export default function DashboardPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  const { deviceStatuses, isConnected, socket } = useSocket();

  useEffect(() => {
    fetchDevices();
  }, []);


  const fetchDevices = async () => {
    try {
      const res = await fetch('/api/devices');
      const data = await res.json();
      if (Array.isArray(data)) setDevices(data);
    } catch (error) {
      console.error("Failed to fetch systems", error);
    } finally {
      setLoading(false);
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'MOBILE': return Smartphone;
      default: return Server;
    }
  };

  const getDeviceStatus = (device: Device) => deviceStatuses[device.id] || device.status;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-6">
        <RefreshCw className="text-blue-600 animate-spin" size={32} />
        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-500">Initializing Mesh Hub</span>
      </div>
    );
  }

  return (
    <div className="space-y-12 max-w-[1400px] mx-auto transition-all">
      
      {/* 1. PROFESSIONAL OVERVIEW HEADER */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-white/5">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50" />
             <span className="text-[10px] font-extrabold text-blue-500 uppercase tracking-[0.3em]">Infrastructure Monitor</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Security <span className="text-slate-500">Console</span>
          </h1>
          <p className="text-slate-400 font-medium max-w-xl text-sm leading-relaxed">
            Manage and monitor your global hardware inventory. Currently supervising {devices.length} verified access nodes.
          </p>
        </div>

        <div className="flex items-center gap-4">
            <Link 
              href="/dashboard/add-device"
              className="flex items-center gap-3 px-6 py-3.5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 active:scale-95"
            >
              <Plus size={18} /> Add New Node
            </Link>
        </div>
      </section>

      {/* 2. CORE METRICS HUD */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Active Sessions', val: '02', icon: Activity, color: 'text-emerald-500' },
            { label: 'Tunnel Integrity', val: '100%', icon: ShieldCheck, color: 'text-blue-500' },
            { label: 'Mesh Latency', val: '4ms', icon: Signal, color: 'text-amber-500' },
            { label: 'Packet Throughput', val: '652MB/s', icon: BarChart3, color: 'text-purple-500' },
          ].map((stat, i) => (
            <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-[1.5rem] flex flex-col gap-4 group hover:bg-white/[0.04] transition-all">
               <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl bg-white/5 ${stat.color} border border-white/5`}>
                     <stat.icon size={20} />
                  </div>
                  <ChevronRight size={14} className="text-slate-700 opacity-0 group-hover:opacity-100 transition-all" />
               </div>
               <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-2">{stat.label}</p>
                  <p className="text-2xl font-bold text-white tracking-tight">{stat.val}</p>
               </div>
            </div>
          ))}
      </section>

      {/* 3. HARDWARE NODE GRID */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {devices.map((device, idx) => {
            const Icon = getDeviceIcon(device.type);
            const status = getDeviceStatus(device);
            const isOnline = status === 'ONLINE';

            return (
              <motion.div 
                key={device.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group relative p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-blue-500/30 hover:bg-white/[0.03] transition-all overflow-hidden flex flex-col h-full"
              >
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex justify-between items-start mb-12">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${isOnline ? 'bg-blue-600 text-white border-blue-400/20 shadow-xl' : 'bg-white/5 text-slate-600 border-white/10'}`}>
                    <Icon size={24} />
                  </div>
                  <div className="flex flex-col items-end gap-2">
                     <span className={`px-3.5 py-1.5 border text-[9px] font-bold tracking-wider rounded-lg uppercase ${
                       isOnline ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-white/5 border-white/10 text-slate-500'
                     }`}>
                       {isOnline ? 'Authorized' : 'Reserved'}
                     </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">{device.type} SYSTEM</p>
                  <h3 className="text-2xl font-bold text-white tracking-tight leading-none group-hover:text-blue-400 transition-colors">
                    {device.name}
                  </h3>
                  <div className="flex items-center gap-6 pt-4 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                      <div className="flex items-center gap-1.5">
                         <Signal size={12} className="text-blue-500" />
                         {isOnline ? '5.4ms PING' : 'OFFLINE'}
                      </div>
                      <div className="flex items-center gap-1.5">
                         <Lock size={12} className={isOnline ? 'text-emerald-500' : 'text-slate-800'} />
                         E2EE ACTIVE
                      </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                   <button className="text-xs font-bold text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                      Access Node <ArrowUpRight size={14} />
                   </button>
                   <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-700 hover:text-slate-300">
                      <MoreVertical size={18} />
                   </button>
                </div>
              </motion.div>
            );
          })}

          <Link href="/dashboard/add-device">
             <div className="p-8 h-full rounded-[2rem] bg-white/[0.01] border border-dashed border-white/10 flex flex-col items-center justify-center text-center space-y-4 hover:border-blue-500/40 hover:bg-white/[0.02] transition-all group min-h-[280px]">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-slate-600 group-hover:text-blue-500 transition-all">
                   <Plus size={24} />
                </div>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Register New Unit</p>
             </div>
          </Link>
        </AnimatePresence>
      </section>

      {/* 4. SECURITY & AUDIT PREVIEW */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="p-10 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-8 flex flex-col">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <Database className="text-blue-500" size={20} />
                   <h4 className="text-lg font-bold text-white tracking-tight">Security Audit Logs</h4>
                </div>
                <Link href="/dashboard/logs" className="text-xs font-bold text-blue-500 hover:underline">View All</Link>
             </div>
             
             <div className="space-y-4 flex-1">
                {[1, 2, 3].map(i => (
                  <div key={i} className="px-6 py-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between group cursor-default">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-slate-500 group-hover:bg-blue-600/10 group-hover:text-blue-500 transition-all">
                           <Activity size={18} />
                        </div>
                        <div>
                           <p className="text-xs font-bold text-white">System Access Authorization</p>
                           <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-widest">Operator established secure link</p>
                        </div>
                     </div>
                     <span className="text-[10px] text-slate-700 font-mono">12:44:0{i} PM</span>
                  </div>
                ))}
             </div>
          </div>

          <div className="p-10 rounded-[2rem] bg-gradient-to-br from-blue-600 to-blue-800 space-y-8 text-white relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 right-0 p-10 opacity-10">
                <Shield size={200} />
             </div>
             <div className="relative z-10">
                <h4 className="text-xs font-extrabold uppercase tracking-[.4em] mb-4 text-blue-100/60">Professional Feature</h4>
                <h2 className="text-4xl font-extrabold mb-8 leading-tight tracking-tight">Hardened Enterprise Security Standards.</h2>
                <p className="text-blue-100 text-sm leading-relaxed mb-10 opacity-80">
                  Every connection is audited, logged, and encrypted using AES-256-GCM. 
                  Zero-Knowledge architecture ensures your data is only ever visible to you.
                </p>
                <div className="flex gap-4">
                   <button className="px-8 py-3.5 bg-white text-blue-600 font-bold text-xs rounded-xl shadow-xl hover:scale-105 transition-all active:scale-95">
                      Download Whitepaper
                   </button>
                   <button className="px-8 py-3.5 border border-white/20 text-white font-bold text-xs rounded-xl hover:bg-white/10 transition-all">
                      Relay Specs
                   </button>
                </div>
             </div>
          </div>
      </section>

    </div>
  );
}