import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu} from 'lucide-react';
import Sidebar from './Sidebar';
import ChatBot from './ChatBot';

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  return (
    <>
      <div 
        className="min-h-screen bg-[#F8FAFC] dark:bg-[#0b0f19] transition-colors duration-300 relative"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 20% 50%, rgba(99, 102, 241, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(139, 92, 246, 0.06) 0%, transparent 40%)
          `
        }}
      >
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        
        <div className="lg:ml-72 flex flex-col min-h-screen">
          <div className="lg:hidden h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 text-slate-600 dark:text-slate-400"
              >
                <Menu size={24} />
              </button>
              <span className="font-black text-slate-900 dark:text-white">Peer Learning</span>
            </div>
          </div>
          <main className="min-h-screen bg-slate-50 dark:bg-[#0F172A] text-slate-800 dark:text-slate-200 p-4 md:p-8 font-sans overflow-x-hidden transition-colors duration-300 pb-20 flex-1">
            <Outlet />
          </main>
        </div>
      </div>
      <ChatBot />
    </>
  );
}