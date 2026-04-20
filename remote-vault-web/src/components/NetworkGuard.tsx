"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ServerCrash, Home } from "lucide-react";

export function NetworkGuard({ children }: { children: React.ReactNode }) {
  const [isSystemOnline, setIsSystemOnline] = useState<boolean | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Check system health on mount and periodically
    const checkHealth = async () => {
      try {
        const res = await fetch("/api/health", { cache: "no-store", method: "GET" });
        setIsSystemOnline(res.ok);
      } catch (err) {
        setIsSystemOnline(false);
      }
    };

    checkHealth();
    
    // Auto-check every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  // Whenever the system status changes or navigation occurs, enforce rules.
  useEffect(() => {
    if (isSystemOnline === false && pathname !== "/") {
      router.push("/");
    }
  }, [isSystemOnline, pathname, router]);

  // If system is offline, we optionally show a global toast/banner, 
  // but if they are on "/", we don't necessarily block them from seeing home page info.
  // We just block them from navigating elsewhere.
  // We can show a small warning banner on the home page if offline.

  return (
    <>
      {isSystemOnline === false && pathname === "/" && (
        <div className="fixed top-0 left-0 right-0 z-[999] bg-red-600 px-4 py-2 text-white flex items-center justify-center gap-3 shadow-lg shadow-red-500/20 text-xs font-bold uppercase tracking-widest">
           <ServerCrash size={16} />
           <span>System offline: Database or Backend Proxy Unreachable. Platform features limited to Homepage.</span>
        </div>
      )}
      
      {/* If offline and trying to access other pages, render block until redirect happens */}
      {isSystemOnline === false && pathname !== "/" && (
          <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#05070a] p-6 text-center space-y-6">
             <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
                <ServerCrash className="text-red-500 h-10 w-10" />
             </div>
             <div>
                <h1 className="text-white text-3xl font-black uppercase tracking-tighter mb-2">Systems Offline</h1>
                <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
                   Critical infrastructure is currently disconnected. NextAuth, Databases, and Relay proxies are unavailable.
                </p>
             </div>
             <button 
               onClick={() => router.push("/")}
               className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white text-xs font-bold uppercase tracking-widest transition-colors mt-4"
             >
               <Home size={16} /> Return to Base
             </button>
          </div>
      )}

      {children}
    </>
  );
}
