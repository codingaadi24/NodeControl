"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Laptop, 
  Smartphone, 
  Server, 
  ArrowRight, 
  CheckCircle2, 
  Copy, 
  ShieldCheck, 
  Cpu,
  RefreshCw,
  Zap,
  Globe,
  ChevronRight,
  Shield,
  Smartphone as SmartphoneIcon,
  Search,
  Activity,
  Command,
  LayoutGrid,
  ShieldAlert,
  Terminal,
  Signal,
  QrCode
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSocket } from "@/hooks/useSocket";

const PROVISIONING_TYPES = [
  { id: 'DESKTOP', title: 'Workstation / PC', icon: Laptop, desc: 'Enterprise desktop agents for Windows, MacOS, or Linux.' },
  { id: 'MOBILE', title: 'Mobile Client', icon: SmartphoneIcon, desc: 'Handheld Android/iOS bridge for mesh terminal access.' },
  { id: 'SERVER', title: 'Infrastructure Node', icon: Server, desc: 'Headless SSH instances for cloud or bare-metal units.' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [identifier, setIdentifier] = useState("");
  const [provisioningKey, setProvisioningKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [meshDiscoveryActive, setMeshDiscoveryActive] = useState(false);
  const { isConnected } = useSocket();

  useEffect(() => {
    if (step === 2 && selectedType === 'MOBILE') setMeshDiscoveryActive(true);
    else setMeshDiscoveryActive(false);
  }, [step, selectedType]);

  const handleGenerateKey = async () => {
    if (!identifier) return;
    setLoading(true);
    try {
      const response = await fetch('/api/devices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: identifier, type: selectedType })
      });
      const data = await response.json();
      if (data.key) {
        setProvisioningKey(data.key);
        setStep(3);
      }
    } catch (error) {
       console.error("Critical provisioning failure", error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => navigator.clipboard.writeText(text);

  return (
    <div className="max-w-6xl mx-auto space-y-16 py-10 transition-all">
      
      {/* 1. PROFESSIONAL STEPPER HEADER */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-white/5">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
             <span className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em]">Deployment Protocol</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Node <span className="text-slate-500">Provisioning Center</span>
          </h1>
          <p className="text-slate-400 font-medium max-w-xl text-sm leading-relaxed">
            Initialize a new hardware unit within your private security mesh. Follow the steps below to establish a cryptographically unique identifier.
          </p>
        </div>

        <div className="flex items-center gap-4">
             {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-3 group">
                   <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${step === s ? 'bg-blue-600 border-blue-500 text-white shadow-xl shadow-blue-600/20' : step > s ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' : 'bg-white/5 border-white/10 text-slate-700'}`}>
                      {step > s ? <CheckCircle2 size={14} /> : s}
                   </div>
                   <div className={`h-1 w-8 rounded-full hidden sm:block ${step > s ? 'bg-emerald-500' : 'bg-white/5'}`} />
                </div>
             ))}
        </div>
      </section>

      {/* 2. DYNAMIC WORKFLOW */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.section 
            key="step1"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {PROVISIONING_TYPES.map((type, idx) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => { setSelectedType(type.id); setStep(2); }}
                  className="group relative p-10 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-blue-500/30 hover:bg-white/[0.04] transition-all text-left flex flex-col h-full"
                >
                  <div className="w-16 h-16 rounded-2xl bg-blue-600/10 flex items-center justify-center mb-10 border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xl shadow-blue-600/10">
                    <Icon size={28} className={selectedType === type.id ? 'text-white' : 'text-blue-500 transition-colors group-hover:text-white'} />
                  </div>
                  <h4 className="text-xl font-bold text-white tracking-tight mb-4">{type.title}</h4>
                  <p className="text-slate-500 text-xs font-medium leading-relaxed mb-10 flex-1">
                    {type.desc}
                  </p>
                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                     <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest group-hover:text-white transition-colors">Select Unit</span>
                     <ChevronRight size={16} className="text-slate-800 group-hover:text-blue-500 group-hover:translate-x-2 transition-all" />
                  </div>
                </button>
              );
            })}
          </motion.section>
        )}

        {step === 2 && (
          <motion.section 
            key="step2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
             <div className="p-12 rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl space-y-12">
                <div className="space-y-4">
                   <label className="text-[10px] font-extrabold text-blue-500 uppercase tracking-[0.2em] ml-1">Hardware Identifier (Alias)</label>
                   <input 
                     type="text" 
                     autoFocus
                     placeholder="e.g. WORKSTATION-ALPHA" 
                     className="w-full bg-white/[0.02] border border-white/10 px-8 py-6 rounded-2xl text-white font-bold placeholder:text-slate-800 focus:outline-none focus:border-blue-500/50 transition-all text-3xl tracking-tight"
                     value={identifier}
                     onChange={(e) => setIdentifier(e.target.value)}
                   />
                </div>

                <div className="p-8 rounded-2xl bg-white/[0.01] border border-white/5 flex items-start gap-6">
                   <ShieldAlert className="text-blue-500 mt-1 shrink-0" size={24} />
                   <p className="text-slate-500 text-xs font-medium leading-relaxed">
                     This identifier will be used as the primary lookup for this node. Ensure it follows your infrastructure naming schema.
                   </p>
                </div>

                <button 
                 disabled={!identifier || loading}
                 onClick={handleGenerateKey}
                 className="w-full py-5 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-xl shadow-blue-600/20 active:scale-95 uppercase tracking-widest text-xs"
                >
                 {loading ? <RefreshCw className="animate-spin mx-auto" /> : "Generate Provisioning Secret"}
                </button>
             </div>

             <div className="p-12 rounded-[2.5rem] bg-white/[0.01] border border-dashed border-white/10 flex flex-col items-center justify-center text-center space-y-10 group overflow-hidden relative">
                <div className={`absolute inset-0 bg-blue-600/[0.02] transition-opacity ${meshDiscoveryActive ? 'opacity-100' : 'opacity-0'}`} />
                <div className="relative z-10 space-y-8 max-w-[280px]">
                   <Globe className={`mx-auto ${meshDiscoveryActive ? 'text-blue-500 animate-pulse' : 'text-slate-900 transition-colors group-hover:text-slate-800'}`} size={80} />
                   <h4 className="text-white font-bold tracking-tight text-2xl leading-tight">Mesh Network Scanning</h4>
                   <p className="text-slate-500 text-xs font-medium leading-relaxed">
                     Scanning your local subnet for unprovisioned RemoteVault instances...
                   </p>
                   <div className="flex gap-2 justify-center">
                     {[1, 2, 3].map(d => (
                        <div key={d} className={`w-1.5 h-1.5 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50 ${meshDiscoveryActive ? 'animate-bounce' : 'opacity-20'}`} style={{ animationDelay: `${d * 0.15}s` }} />
                     ))}
                   </div>
                </div>
             </div>
          </motion.section>
        )}

        {step === 3 && (
          <motion.section 
            key="step3"
            initial={{ opacity: 0, scale: 0.98 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="flex flex-col items-center"
          >
            <div className="w-full max-w-4xl p-16 rounded-[3rem] bg-white/[0.02] border border-blue-500/20 backdrop-blur-3xl relative overflow-hidden flex flex-col items-center text-center">
               <div className="absolute top-0 right-0 p-16 opacity-5 pointer-events-none">
                  <ShieldCheck size={280} />
               </div>

               <div className="relative z-10 space-y-12 w-full">
                  <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-[1.5rem] flex items-center justify-center mx-auto shadow-2xl">
                    <CheckCircle2 className="text-emerald-500" size={36} />
                  </div>
                  
                  <div className="space-y-4">
                     <h3 className="text-5xl font-black text-white tracking-tighter">Provisioning Successful.</h3>
                     <p className="text-slate-500 text-sm font-medium">Node <span className="text-white font-bold">"{identifier}"</span> was registered. Use the command below to finalize installation.</p>
                  </div>
                  
                  <div className="p-10 rounded-[2rem] bg-black/40 border border-white/5 space-y-10 shadow-2xl">
                      {selectedType === 'MOBILE' ? (
                        <div className="space-y-4 text-center pb-4">
                           <div className="mx-auto w-48 h-48 bg-white p-4 rounded-xl flex items-center justify-center">
                              {/* True QR Code library will replace this icon */}
                              <QrCode size={160} className="text-slate-900" />
                           </div>
                           <p className="text-xs text-slate-400 font-bold tracking-wide mt-4">
                             Scan with RemoteVault Mobile App to pair.
                           </p>

                           {/* Permissions Disclaimer */}
                           <div className="mt-8 p-6 bg-amber-500/10 border border-amber-500/20 rounded-xl text-left flex items-start gap-4 max-w-lg mx-auto">
                             <ShieldAlert className="text-amber-500 mt-1 shrink-0" size={24} />
                             <div>
                               <h5 className="text-amber-500 font-bold text-xs tracking-wider uppercase mb-2">Required OS Permissions</h5>
                               <ul className="text-slate-400 text-[10px] leading-relaxed space-y-1 list-disc list-inside">
                                 <li><strong>Screen Recording (MediaProjection)</strong> for viewing.</li>
                                 <li><strong>Accessibility Service</strong> for remote cursor/touch control.</li>
                                 <li><strong>Full File Access</strong> to route files through the mesh.</li>
                                 <li><strong>Battery Optimization Exclusion</strong> to maintain unattended connection.</li>
                               </ul>
                             </div>
                           </div>
                        </div>
                      ) : (
                        <div className="space-y-4 text-left">
                            <div className="flex items-center justify-between px-2">
                               <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Installation Script (One-Click)</label>
                               <span className="text-[9px] font-bold text-blue-500 uppercase">OS Detection: {selectedType === 'SERVER' ? 'Linux' : 'Windows'}</span>
                            </div>
                            <div className="bg-black/80 border border-white/10 p-8 rounded-xl flex items-center justify-between gap-10 group hover:border-blue-500/20 transition-all">
                              <span className="text-blue-500 font-mono text-sm font-bold truncate">
                                {selectedType === 'SERVER' ? `curl -sL https://get.remotevault.sh | bash -s -- -id ${identifier} -key ${provisioningKey}` : `irm https://get.remotevault.sh | iex -id ${identifier} -key ${provisioningKey}`}
                              </span>
                              <button 
                                onClick={() => copyToClipboard(selectedType === 'SERVER' ? `curl -sL https://get.remotevault.sh | bash -s -- -id ${identifier} -key ${provisioningKey}` : `irm https://get.remotevault.sh | iex -id ${identifier} -key ${provisioningKey}`)}
                                className="p-4 bg-white/5 hover:bg-blue-600 hover:text-white transition-all rounded-lg active:scale-95 text-slate-500"
                              >
                                <Copy size={20} />
                              </button>
                            </div>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row gap-4">
                         <button 
                            onClick={() => router.push('/dashboard')}
                            className="flex-1 py-5 bg-blue-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20"
                          >
                            Go to Console Dashboard
                         </button>
                         <button 
                            onClick={() => setStep(1)}
                            className="flex-1 py-5 border border-white/10 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all"
                          >
                            Provision New Node
                         </button>
                      </div>
                  </div>
               </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
