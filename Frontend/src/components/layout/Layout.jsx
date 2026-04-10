import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Bell, Search, Settings, Menu, X } from 'lucide-react';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen text-slate-800 antialiased selection:bg-teal-100 selection:text-teal-900 overflow-hidden relative">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - passed open state and close function */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 flex flex-col min-w-0 max-h-screen overflow-y-auto">
        {/* Top Header */}
        <header className="h-20 bg-white/50 backdrop-blur-md border-b border-slate-200/50 flex items-center justify-between px-4 md:px-8 sticky top-0 z-20">
          <div className="flex items-center gap-3 md:gap-4 flex-1">
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 lg:hidden shadow-sm active:scale-95 transition-all"
            >
              <Menu size={20} />
            </button>

            <div className="hidden sm:flex items-center gap-4 bg-slate-100/50 px-4 py-2 rounded-2xl border border-slate-200/50 w-full max-w-md focus-within:ring-2 focus-within:ring-teal-500/20 transition-all group">
              <Search className="w-5 h-5 text-slate-400 group-focus-within:text-teal-500" />
              <input
                type="text"
                placeholder="Search anything..."
                className="bg-transparent border-none outline-none w-full text-slate-700 placeholder-slate-400 font-medium"
              />
            </div>
            {/* Mobile Search Button (Icon only) */}
            <button className="sm:hidden p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 shadow-sm">
               <Search size={20} />
            </button>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button className="p-3 bg-white border border-slate-200/50 rounded-2xl text-slate-500 hover:text-teal-600 hover:border-teal-500/30 hover:bg-teal-50/50 transition-all duration-300 relative group active:scale-95 shadow-sm">
              <Bell className="w-5 h-5 group-hover:rotate-12" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white ring-2 ring-rose-100 group-hover:scale-125 transition-transform" />
            </button>
            <button className="hidden md:flex p-3 bg-white border border-slate-200/50 rounded-2xl text-slate-500 hover:text-slate-900 transition-all duration-300 hover:bg-slate-50 shadow-sm active:scale-95">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
