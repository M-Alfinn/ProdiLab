import React, { useState, useEffect } from 'react';
import { Menu, Bell, User, LogOut, LayoutDashboard, GraduationCap, ChevronDown, X, Layers, Newspaper, Image as ImageIcon } from 'lucide-react';
import { User as UserType, Notification } from '../types';
import { notificationService } from '../services/db';

interface NavbarProps {
  currentUser: UserType | null;
  view: string;
  setView: (view: any) => void;
  handleLogout: () => void;
  notifications: Notification[];
  onNotificationRead?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentUser, view, setView, handleLogout, notifications, onNotificationRead }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State baru untuk mobile menu
  
  const unreadCount = notifications.filter(n => !n.read).length;

  // Auto-close dropdowns when currentUser changes or View changes
  useEffect(() => {
    setIsProfileOpen(false);
    setIsNotifOpen(false);
    setIsMobileMenuOpen(false); // Tutup menu mobile saat pindah halaman
  }, [currentUser, view]);

  const handleNotifClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isNotifOpen && unreadCount > 0 && currentUser) {
        notificationService.markAllAsRead(currentUser.id);
        if (onNotificationRead) onNotificationRead();
    }
    setIsNotifOpen(!isNotifOpen);
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer gap-2.5" onClick={() => setView(currentUser ? 'dashboard' : 'landing')}>
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200/50">
              <GraduationCap size={24} />
            </div>
            <div>
              <span className="font-bold text-xl text-gray-900 tracking-tight block leading-none">ProdiLab</span>
              <span className="text-[10px] text-emerald-600 font-bold tracking-wide uppercase">Wadah Digital Inovasi</span>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center">
            {currentUser ? (
              <>
                 <button onClick={() => setView('gallery')} className={`text-sm font-medium transition ${view === 'gallery' ? 'text-emerald-600' : 'text-gray-600 hover:text-emerald-600'}`}>Galeri</button>
                 <button onClick={() => setView('news')} className={`text-sm font-medium transition ${view === 'news' ? 'text-emerald-600' : 'text-gray-600 hover:text-emerald-600'}`}>Berita</button>
                 <button onClick={() => setView('dashboard')} className={`text-sm font-medium transition ${view === 'dashboard' ? 'text-emerald-600' : 'text-gray-600 hover:text-emerald-600'}`}>Dashboard</button>
              </>
            ) : null}
            
            {currentUser ? (
              <div className="flex items-center gap-4 pl-6 border-l border-gray-200">
                {/* Notification */}
                <div className="relative">
                   <button 
                    onClick={handleNotifClick} 
                    className="relative p-2 text-gray-500 hover:text-emerald-600 transition rounded-full hover:bg-emerald-50"
                   >
                     <Bell size={20} />
                     {unreadCount > 0 && (
                       <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                     )}
                   </button>
                   
                   {isNotifOpen && (
                     <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-fade-in z-50">
                       <div className="px-4 py-3 border-b border-gray-50 font-semibold text-gray-800 flex justify-between items-center">
                         <span>Notifikasi</span>
                         <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">{unreadCount} Baru</span>
                       </div>
                       <div className="max-h-64 overflow-y-auto custom-scrollbar">
                          {notifications.length === 0 ? (
                            <p className="px-4 py-8 text-center text-gray-400 text-sm">Tidak ada notifikasi</p>
                          ) : (
                            notifications.map(n => (
                              <div key={n.id} className={`px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 text-sm ${!n.read ? 'bg-emerald-50/30' : ''}`}>
                                 <p className="text-gray-800 leading-snug">{n.message}</p>
                                 <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                              </div>
                            ))
                          )}
                       </div>
                     </div>
                   )}
                </div>

                {/* Profile */}
                <div className="relative">
                   <button 
                      onClick={(e) => { e.stopPropagation(); setIsProfileOpen(!isProfileOpen); setIsNotifOpen(false); }}
                      className="flex items-center gap-2 focus:outline-none group"
                   >
                      <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold border border-emerald-200 group-hover:border-emerald-400 transition">
                         {currentUser.name.charAt(0)}
                      </div>
                      <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600"/>
                   </button>

                   {isProfileOpen && (
                     <div className="absolute right-0 mt-3 w-60 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-fade-in z-50">
                       <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
                          <p className="text-sm font-bold text-gray-900 truncate">{currentUser.name}</p>
                          <p className="text-xs text-gray-500 font-medium">{currentUser.role === 'DOSEN' ? 'Dosen / Admin' : 'Mahasiswa'}</p>
                       </div>
                       <div className="p-2">
                         <button onClick={() => { setView('profile'); setIsProfileOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg flex items-center gap-3 transition">
                           <User size={18}/> Profil Saya
                         </button>
                         <button onClick={() => { setView('dashboard'); setIsProfileOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg flex items-center gap-3 transition">
                           <LayoutDashboard size={18}/> Dashboard
                         </button>
                         <div className="border-t border-gray-100 my-1"></div>
                         <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-3 transition">
                           <LogOut size={18}/> Keluar
                         </button>
                       </div>
                     </div>
                   )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button onClick={() => setView('login')} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-emerald-600 transition">Masuk</button>
                <button onClick={() => setView('register')} className="px-5 py-2 text-sm font-medium bg-emerald-600 text-white rounded-full hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition transform hover:-translate-y-0.5">Daftar Sekarang</button>
              </div>
            )}
          </div>

           {/* Mobile Menu Button */}
           <div className="md:hidden flex items-center gap-2">
             {currentUser && (
               <button 
                  onClick={handleNotifClick} 
                  className="relative p-2 text-gray-500 hover:text-emerald-600 transition rounded-full hover:bg-emerald-50 mr-1"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                  )}
                </button>
             )}
             <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                className="text-gray-500 p-2 hover:bg-gray-100 rounded-lg transition"
             >
                {isMobileMenuOpen ? <X size={24}/> : <Menu size={24}/>}
             </button>
           </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-fade-in shadow-lg absolute w-full left-0">
          <div className="px-4 pt-4 pb-6 space-y-3">
             {currentUser ? (
               <>
                  <div className="bg-emerald-50 p-4 rounded-xl flex items-center gap-3 mb-4">
                     <div className="w-10 h-10 rounded-full bg-emerald-200 flex items-center justify-center text-emerald-800 font-bold">
                        {currentUser.name.charAt(0)}
                     </div>
                     <div className="overflow-hidden">
                        <p className="text-sm font-bold text-gray-900 truncate">{currentUser.name}</p>
                        <p className="text-xs text-emerald-700 font-medium">{currentUser.role === 'DOSEN' ? 'Dosen / Admin' : 'Mahasiswa'}</p>
                     </div>
                  </div>

                  <button 
                    onClick={() => { setView('dashboard'); setIsMobileMenuOpen(false); }} 
                    className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium transition ${view === 'dashboard' ? 'bg-emerald-600 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    <LayoutDashboard size={18}/> Dashboard
                  </button>
                  <button 
                    onClick={() => { setView('gallery'); setIsMobileMenuOpen(false); }} 
                    className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium transition ${view === 'gallery' ? 'bg-emerald-600 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    <ImageIcon size={18}/> Galeri Inovasi
                  </button>
                  <button 
                    onClick={() => { setView('news'); setIsMobileMenuOpen(false); }} 
                    className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium transition ${view === 'news' ? 'bg-emerald-600 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    <Newspaper size={18}/> Berita
                  </button>
                  <button 
                    onClick={() => { setView('profile'); setIsMobileMenuOpen(false); }} 
                    className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium transition ${view === 'profile' ? 'bg-emerald-600 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    <User size={18}/> Profil Saya
                  </button>

                  <div className="border-t border-gray-100 my-2 pt-2">
                    <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-3 transition">
                      <LogOut size={18}/> Keluar Akun
                    </button>
                  </div>
               </>
             ) : (
               <div className="flex flex-col gap-3">
                 <button onClick={() => { setView('login'); setIsMobileMenuOpen(false); }} className="w-full py-3 text-center rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50">
                    Masuk Akun
                 </button>
                 <button onClick={() => { setView('register'); setIsMobileMenuOpen(false); }} className="w-full py-3 text-center rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-200">
                    Daftar Sekarang
                 </button>
               </div>
             )}
          </div>
        </div>
      )}
    </nav>
  );
};