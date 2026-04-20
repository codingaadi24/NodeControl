"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, Smartphone, Laptop, Globe, Lock, ArrowRight, Download, Server, Terminal, Menu, X, Check, Zap, Cpu, Activity, HardDrive, Share2, Layers, Key, ShieldAlert, LogOut
} from "lucide-react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Home() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const heroStyle: React.CSSProperties = {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    backgroundColor: "#05070a",
    overflow: "hidden",
    textAlign: "center"
  };


  return (
    <div style={{ backgroundColor: "#05070a", color: "#e5e7eb" }} className="min-h-screen selection:bg-blue-500/30">

      {/* 2. Hero Section */}
      <section style={heroStyle} className="px-6">
        <div className="absolute inset-0 z-0">
          <Image src="/bg-vault-premium.png" alt="Vault" fill style={{ objectFit: "cover", opacity: 0.35 }} priority />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#05070a]/60 to-[#05070a]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }} className="flex flex-col items-center">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono uppercase tracking-[0.3em] mb-12">
              <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,1)]" />
              Protocol v1.0.4 Online
            </div>
            
            <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.95] mb-10 text-center drop-shadow-2xl uppercase">
              Global <span className="text-blue-500">Access.</span><br />
              Local <span className="text-white">Privacy.</span>
            </h1>

            <p className="text-gray-400 text-xl md:text-2xl max-w-3xl mx-auto font-light leading-relaxed mb-16 px-4">
              A military-grade encrypted bridge from your web browser directly to your home hardware.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full">
              <button onClick={() => session ? window.location.href = "/dashboard" : signIn("google", { callbackUrl: "/dashboard" })} className="w-full sm:w-auto px-12 py-5 bg-blue-600 text-white font-black text-xl rounded-2xl hover:bg-blue-500 transition-all transform hover:-translate-y-1 shadow-2xl active:scale-95 flex items-center justify-center gap-3 tracking-tighter">
                {session ? "Enter Terminal" : "Launch Terminal"} <ArrowRight strokeWidth={3} />
              </button>
              <button className="w-full sm:w-auto px-12 py-5 bg-white/5 border border-white/10 text-white font-bold text-xl rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-3 backdrop-blur-xl group tracking-tighter">
                <Download className="group-hover:translate-y-1 transition-transform" /> Get Agent
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. Features Section */}
      <section id="features" className="relative py-64 max-w-7xl mx-auto px-6">
        <div className="text-center mb-32 space-y-6">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter">Encrypted Infrastructure.</h2>
          <p className="text-gray-500 text-2xl font-light italic">Own your nodes. Secure your legacy.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { Icon: Zap, t: "Instant P2P", d: "High-speed tunneling with dedicated relay optimization. Experience negligible latency across continents." },
            { Icon: Lock, t: "E2E AES-256", d: "Military grade data segmentation. Your encryption keys never leave your local device environment." },
            { Icon: Smartphone, t: "Mobile Bridge", d: "Access mobile storage via USB-Passthrough proxy. Manage phone files from any desktop." },
            { Icon: Cpu, t: "Go System Agent", d: "Minimalist memory footprint for persistent nodes. Runs silently in the background of any OS." },
            { Icon: Terminal, t: "Pro Console", d: "Full system audit logs and management terminal for granular control over every shared byte." },
            { Icon: Globe, t: "Global Network", d: "Distributed entry points for worldwide access. Bypass geo-locking and firewall restrictions." },
          ].map((f, i) => (
            <div key={i} className="p-10 rounded-[2rem] bg-white/[0.03] border border-white/5 hover:border-blue-500/50 hover:bg-white/[0.05] transition-all group overflow-hidden relative">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-14 h-14 rounded-2xl bg-blue-600/10 flex items-center justify-center mb-8 text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <f.Icon size={30} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-tighter">{f.t}</h3>
              <p className="text-gray-500 leading-relaxed text-lg">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Protocol Hub */}
      <section id="protocol" className="py-64 bg-gradient-to-b from-[#05070a] via-[#080a0f] to-[#05070a] border-y border-white/5 overflow-hidden relative">
        <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-blue-500/20 via-transparent to-blue-500/20" />
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
            <div className="space-y-12 text-center lg:text-left">
               <h2 className="text-5xl md:text-7xl font-black text-white leading-[0.95] tracking-tighter italic uppercase underline decoration-blue-500 decoration-8 underline-offset-8">Zero Knowledge.</h2>
               <p className="text-gray-400 text-xl font-light">By the time your data hits our relay, it's already a cryptographically sealed black box. We act as the router, never the repository.</p>
               <div className="space-y-10">
                  {[
                    { q: "01", t: "Authorize", d: "Handshake via OAuth 2.0 standards with ephemeral token generation." },
                    { q: "02", t: "Bind", d: "Agent creates a persistent, reverse-tunneled stream to your browser." },
                    { q: "03", t: "Stream", d: "Encrypted segments bypass Relay storage entirely for raw speed." },
                  ].map((s, i) => (
                    <div key={i} className="flex flex-col lg:flex-row items-center lg:items-start gap-6 group">
                       <span className="text-4xl font-black text-blue-900 group-hover:text-blue-500 transition-colors italic font-mono">{s.q}</span>
                       <div>
                          <h4 className="font-bold text-2xl text-white mb-2 uppercase">{s.t}</h4>
                          <p className="text-gray-500 text-lg">{s.d}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
            <div className="relative aspect-square md:aspect-video rounded-[3rem] border border-white/10 bg-black/40 flex items-center justify-center p-6 sm:p-10 overflow-hidden group shadow-2xl">
                <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity blur-3xl" />
                <div className="flex items-center gap-4 sm:gap-10 relative z-10">
                   <div className="flex flex-col items-center gap-2 sm:gap-4">
                      <Laptop size={48} className="text-gray-500 group-hover:text-white transition-colors" />
                      <span className="text-[10px] font-mono text-gray-700 uppercase">Local Node</span>
                   </div>
                   <div className="w-10 sm:w-16 md:w-40 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
                   <div className="p-4 sm:p-8 rounded-[2.5rem] bg-blue-600/10 border border-blue-500/20 relative shadow-2xl">
                      <Server size={48} className="text-blue-500 animate-pulse" />
                      <div className="absolute -inset-4 bg-blue-500/20 blur-2xl rounded-full" />
                   </div>
                   <div className="w-10 sm:w-16 md:w-40 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
                   <div className="flex flex-col items-center gap-2 sm:gap-4">
                      <Globe size={48} className="text-gray-500 group-hover:text-white transition-colors" />
                      <span className="text-[10px] font-mono text-gray-700 uppercase">Remote Hub</span>
                   </div>
                </div>
                <motion.div animate={{ x: [-300, 300], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="absolute h-[2px] w-12 sm:w-24 bg-gradient-to-r from-transparent via-blue-400 to-transparent top-1/2 -translate-y-1/2" />
            </div>
        </div>
      </section>

      {/* 5. Infrastructure Mesh Network */}
      <section id="infrastructure" className="py-64 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
             <div className="order-2 lg:order-1 relative aspect-square bg-white/[0.01] rounded-full border border-white/5 flex items-center justify-center p-6 sm:p-12">
                <div className="absolute inset-0 bg-blue-500/5 rounded-full blur-3xl" />
                <div className="grid grid-cols-3 gap-4 sm:gap-8 relative z-10">
                   {[Activity, Globe, Shield, HardDrive, Share2, Layers].map((SI, i) => (
                     <div key={i} className="w-16 h-16 sm:w-24 sm:h-24 rounded-3xl bg-black border border-white/10 flex items-center justify-center text-gray-600 hover:text-blue-500 hover:border-blue-500/30 transition-all transform hover:scale-110 shadow-xl">
                        <SI className="w-6 h-6 sm:w-10 sm:h-10" />
                     </div>
                   ))}
                </div>
             </div>
             <div className="order-1 lg:order-2 space-y-12">
                <div className="space-y-6 text-center lg:text-left">
                  <h2 className="text-5xl md:text-8xl font-black text-white leading-none tracking-tighter uppercase">Mesh<br/>Dynamic.</h2>
                  <p className="text-gray-400 text-xl font-light italic">Distributed entry points for the modern nomad.</p>
                </div>
                <div className="space-y-4">
                    {[
                      "99.99% Node Availability via Multi-Link Relay",
                      "Ultra-Low Latency WebSocket (WSS) Infrastructure",
                      "Automatic Firewall Traversal with Reverse-Proxying",
                      "Edge Optimization for 4K Content Streaming"
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-4 p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                        <div className="w-6 h-6 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                          <Check size={14} className="text-blue-500" />
                        </div>
                        <span className="text-gray-300 font-mono text-sm tracking-widest uppercase">{item}</span>
                      </div>
                    ))}
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 6. Security Deep Dive */}
      <section id="security" className="py-64 bg-gradient-to-b from-[#05070a] via-black to-[#05070a] border-y border-white/5 relative uppercase">
        <div className="max-w-5xl mx-auto px-6 text-center">
           <div className="inline-block px-6 py-3 md:px-10 md:py-4 rounded-3xl bg-red-600/10 border border-red-500/30 text-red-500 font-black text-sm md:text-xl mb-12 uppercase tracking-tighter shadow-xl shadow-red-500/10">
             Hardened Standard
           </div>
           <h2 className="text-5xl sm:text-7xl md:text-9xl font-black text-white tracking-tighter mb-16 uppercase">UNBREAKABLE.</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div className="p-12 rounded-[3.5rem] bg-white/[0.02] border border-white/5 space-y-8">
                 <Key className="text-blue-500" size={50} />
                 <h3 className="text-4xl font-bold text-white uppercase tracking-tighter">Private Keys</h3>
                 <p className="text-gray-500 text-lg leading-relaxed">RemoteVault uses a local-first keychain approach. Your private access keys are derived using PBKDF2 on your home machine. Even if our servers are compromised, your data remains an encrypted ghost.</p>
              </div>
              <div className="p-12 rounded-[3.5rem] bg-white/[0.02] border border-white/5 space-y-8">
                 <Lock className="text-blue-500" size={50} />
                 <h3 className="text-4xl font-bold text-white uppercase tracking-tighter">AES-256-GCM</h3>
                 <p className="text-gray-500 text-lg leading-relaxed">Every binary chunk is wrapped in GCM authenticated encryption. This ensures not only secrecy but also absolute data integrity—preventing any tampering during the relay transit phase.</p>
              </div>
           </div>
        </div>
      </section>

      <footer className="py-32 px-6 border-t border-white/5 bg-[#030508] text-center relative overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-600 via-transparent to-blue-600 opacity-20" />
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
             <div className="flex flex-col items-center md:items-start gap-6">
                <div className="flex items-center gap-3">
                   <Shield size={32} className="text-blue-600" />
                   <span className="text-xl font-black text-white tracking-widest uppercase">RemoteVault</span>
                </div>
                <p className="text-gray-600 text-xs font-mono uppercase tracking-widest leading-relaxed text-center md:text-left">
                  Decentralized device bridging protocol. Digital sovereignty for the modern age.
                </p>
             </div>
             <div className="flex flex-col items-center gap-4">
                <span className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.5em] mb-4">Core Mesh</span>
                <div className="flex flex-wrap justify-center gap-6 text-[10px] font-mono font-bold text-gray-700 tracking-[0.1em] uppercase">
                  <a href="#" className="hover:text-white transition-colors">Documentation</a>
                  <a href="#" className="hover:text-white transition-colors">Security Audit</a>
                  <a href="#" className="hover:text-white transition-colors">Relay Specs</a>
                </div>
             </div>
             <div className="flex flex-col items-center md:items-end gap-6 text-[10px] font-mono font-bold text-gray-700 tracking-widest">
                <span>© 2026 REMOTEVAULT</span>
                <span className="text-blue-900">ENCRYPTION: AES-256-GCM ACTIVE</span>
             </div>
          </div>
          <p className="text-[10px] font-mono text-gray-900 tracking-[1em] uppercase border-t border-white/[0.02] pt-12">
            V1.0.4.5 — NODE CONNECTION STABLE — SECURE_TUNNEL_READY
          </p>
        </div>
      </footer>

    </div>
  );
}
