"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, Globe, Server, Download, Layers, ShieldAlert, Terminal, Menu, X, HardDrive, LogOut, LayoutDashboard, Cpu, History, SignalHigh, ArrowRight, Settings
} from "lucide-react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export function SiteNavigation() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [comingSoonModal, setComingSoonModal] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const handleSignIn = async (provider: string) => {
    setIsLoading(provider);
    await signIn(provider);
  };

  const isDashboard = pathname.startsWith('/dashboard');

  const navStyle: React.CSSProperties = {
     position: "fixed",
     top: 0,
     left: 0,
     right: 0,
     zIndex: 100,
     padding: isScrolled ? "1rem 1.5rem" : "2rem 1.5rem",
     transition: "all 0.3s ease",
     backgroundColor: isScrolled || isDashboard ? "rgba(5, 7, 10, 0.9)" : "transparent",
     borderBottom: isScrolled || isDashboard ? "1px solid rgba(255, 255, 255, 0.1)" : "none",
     backdropFilter: isScrolled || isDashboard ? "blur(20px)" : "none"
  };

  const menuGroups = session ? [
    {
      title: "Navigation",
      items: [
        { name: "Home Base", href: "/", icon: Globe },
        { name: "About Us", href: "/#about", icon: Layers },
      ]
    },
    {
      title: "Command Center",
      items: [
        { name: "All Devices", href: "/dashboard", icon: Cpu },
        { name: "Add Device", href: "/dashboard/add-device", icon: Server },
        { name: "Live Terminal", href: "/dashboard/terminal", icon: Terminal, comingSoon: true },
        { name: "Settings", href: "/dashboard/settings", icon: Settings, comingSoon: true },
      ]
    }
  ] : [
    {
      title: "Navigation",
      items: [
        { name: "Home Base", href: "/", icon: Globe },
        { name: "Download Agent", href: "/downloads", icon: Download, comingSoon: true },
        { name: "Protocol Architecture", href: "/#protocol", icon: Layers },
        { name: "About Us", href: "/#about", icon: ShieldAlert },
      ]
    }
  ];

  return (
    <>
      <nav style={navStyle}>
        <div className="max-w-[1600px] mx-auto flex items-center justify-between px-2 md:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black text-white tracking-tighter uppercase hidden sm:block">RemoteVault</span>
          </Link>
          
          <div className="flex items-center gap-6">

            <button className="flex items-center gap-3 pl-4 pr-3 py-1.5 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:border-white/20 transition-all group active:scale-95 shadow-sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <span className="text-xs font-bold text-white hidden sm:block">Menu</span>
                <div className="w-8 h-8 flex items-center justify-center bg-blue-600 rounded-full shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform">
                  {mobileMenuOpen ? <X size={16} className="text-white" /> : <Menu size={16} className="text-white" />}
                </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Universal Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-[200] flex justify-end">
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setMobileMenuOpen(false)}
               className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-[380px] h-full bg-[#05070a]/95 backdrop-blur-3xl border-l border-white/10 shadow-2xl flex flex-col p-8 md:p-10 overflow-y-auto"
            >
               <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <Shield className="text-blue-500" size={24} />
                    <span className="font-black text-white uppercase tracking-tighter text-xl">RemoteVault</span>
                  </div>
                  <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                  >
                    <X size={24} />
                  </button>
               </div>

               <div className="flex-1 space-y-8">
                 {menuGroups.map((group, gIdx) => (
                    <div key={gIdx} className="space-y-3">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-2">{group.title}</span>
                        <div className="space-y-1">
                          {group.items.map((item: any, idx) => {
                            const isActive = pathname === item.href && pathname !== "/";
                            if (item.comingSoon) {
                                return (
                                  <button 
                                    key={idx} 
                                    onClick={() => setComingSoonModal(item.name)}
                                    className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-semibold transition-all group text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                                  >
                                    <div className="flex items-center gap-4">
                                       <item.icon className="w-5 h-5 text-gray-500 group-hover:text-blue-400 transition-colors" />
                                       <span className="uppercase tracking-widest">{item.name}</span>
                                    </div>
                                    <span className="text-[9px] font-bold text-blue-500/50 uppercase tracking-widest border border-blue-500/20 px-2 py-0.5 rounded-md">soon</span>
                                  </button>
                                );
                            }

                            return (
                                <Link 
                                  key={idx} 
                                  href={item.href} 
                                  onClick={() => setMobileMenuOpen(false)}
                                  className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all group ${
                                    isActive ? "bg-blue-600/10 text-blue-500 border border-blue-500/20" : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                                  }`}
                                >
                                  <item.icon className={`w-5 h-5 ${isActive ? "text-blue-500" : "text-gray-500 group-hover:text-white"} transition-colors`} />
                                  <span className="uppercase tracking-widest">{item.name}</span>
                                </Link>
                            );
                          })}
                        </div>
                    </div>
                 ))}
               </div>

               <div className="mt-8 pt-6 border-t border-white/5">
                {session ? (
                  <div className="space-y-4">
                    <div className="w-full relative flex items-center gap-4 py-4 px-6 rounded-xl bg-white/[0.04] border border-white/10 group overflow-hidden">
                      {session.user?.image ? (
                        <img src={session.user.image} alt="Profile" className="w-8 h-8 rounded-full border border-white/20 shrink-0 object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-blue-500">{session.user?.name?.charAt(0) || "U"}</span>
                        </div>
                      )}
                      <div className="flex flex-col truncate text-left w-full">
                        <span className="font-bold text-sm text-white tracking-wide truncate">{session.user?.name || "Operator"}</span>
                        <span className="text-gray-400 text-[10px] font-mono truncate uppercase tracking-widest">{session.user?.email}</span>
                      </div>
                    </div>
                    <button onClick={() => { signOut({ callbackUrl: "/" }); setMobileMenuOpen(false); }} className="w-full py-3.5 bg-red-500/10 border border-red-500/20 text-red-500 font-bold text-xs rounded-xl hover:bg-red-500 hover:text-white transition-all uppercase tracking-widest flex items-center justify-center gap-3 group shadow-xl">
                      <LogOut className="w-4 h-4 group-hover:text-white text-red-400 transition-colors" />
                      Terminate Link
                    </button>
                  </div>
                ) : (
                  <button onClick={() => { setShowLoginModal(true); setMobileMenuOpen(false); }} className="w-full py-3.5 bg-white/5 border border-white/10 text-white font-bold text-xs rounded-xl hover:bg-blue-600 hover:border-blue-500 transition-all uppercase tracking-widest flex items-center justify-center gap-3 group">
                    <Terminal className="w-4 h-4 group-hover:text-white text-gray-400 transition-colors" />
                    Establish Link
                  </button>
                )}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <AnimatePresence>
        {showLoginModal && !session && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
          >
            <div className="absolute inset-0 z-0 cursor-pointer" onClick={() => setShowLoginModal(false)} />
            
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md p-10 md:p-12 rounded-[2rem] bg-white/[0.02] border border-white/5 backdrop-blur-2xl shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
              <button 
                  onClick={() => setShowLoginModal(false)} 
                  className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-white bg-white/5 rounded-lg transition-all"
               >
                  <X size={16} />
               </button>
               
              <div className="flex flex-col items-center mb-10 mt-2">
                <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 mb-6 border border-blue-400/20">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-black text-white text-center uppercase tracking-tighter mb-2">
                  Establish Link
                </h1>
                <p className="text-gray-400 text-center font-mono text-xs uppercase tracking-widest">
                  Identity verification required
                </p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => handleSignIn("google")}
                  disabled={isLoading !== null}
                  className="w-full relative flex items-center justify-center gap-4 py-4 px-6 rounded-xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all group overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading === "google" ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      <span className="font-bold text-sm text-white tracking-wide">Continue with Google</span>
                      <ArrowRight className="absolute right-6 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-gray-400" size={18} />
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleSignIn("github")}
                  disabled={isLoading !== null}
                  className="w-full relative flex items-center justify-center gap-4 py-4 px-6 rounded-xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all group overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading === "github" ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0 text-white">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      <span className="font-bold text-sm text-white tracking-wide">Continue with GitHub</span>
                      <ArrowRight className="absolute right-6 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-gray-400" size={18} />
                    </>
                  )}
                </button>
              </div>
              <div className="mt-10 p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 flex items-start gap-4">
                <ShieldAlert className="text-blue-500 shrink-0 mt-0.5" size={18} />
                <div>
                  <span className="block font-bold text-blue-400 text-sm mb-1 uppercase tracking-wider">Zero Knowledge Policy</span>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    RemoteVault does not store passwords. Authentication is managed solely through your selected provider.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Coming Soon Modal */}
      <AnimatePresence>
        {comingSoonModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[400] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
          >
            <div className="absolute inset-0 z-0 cursor-pointer" onClick={() => setComingSoonModal(null)} />
            
            <motion.div 
               initial={{ scale: 0.9, y: 20 }}
               animate={{ scale: 1, y: 0 }}
               exit={{ scale: 0.9, y: 20 }}
               className="w-full max-w-sm p-10 rounded-[2rem] bg-white/[0.02] border border-blue-500/20 backdrop-blur-3xl shadow-[0_0_50px_rgba(59,130,246,0.1)] relative z-10 overflow-hidden text-center"
            >
               <div className="w-16 h-16 rounded-2xl bg-blue-600/10 flex items-center justify-center mx-auto mb-6 border border-blue-400/20 text-blue-500">
                  <Terminal className="w-8 h-8" />
               </div>
               <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">{comingSoonModal}</h3>
               <p className="text-slate-500 text-xs leading-relaxed mb-8">
                 This feature is currently in active development. Please check back in the next major patch.
               </p>
               <button 
                 onClick={() => setComingSoonModal(null)}
                 className="w-full py-4 bg-blue-600 text-white font-bold uppercase tracking-widest text-xs rounded-xl shadow-xl shadow-blue-600/20 active:scale-95 transition-all"
               >
                 Acknowledge
               </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
