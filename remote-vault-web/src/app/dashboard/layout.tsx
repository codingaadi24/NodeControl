"use client";

import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#020408] text-slate-200 font-sans flex flex-col selection:bg-blue-500/30">
      <main className="flex-1 w-full pt-24 md:pt-32 relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 pb-20">
          {/* Professional Background Gradient */}
          <div className="fixed top-0 right-0 w-full h-[500px] bg-gradient-to-b from-blue-600/[0.03] to-transparent pointer-events-none -z-10" />
          {children}
      </main>
    </div>
  );
}
