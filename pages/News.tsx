import React, { useState } from 'react';
import { Globe, File, Calendar, User as UserIcon, X, ChevronRight, FileText } from 'lucide-react';
import { News, User } from '../types';
import { DUMMY_NEWS_IMAGE } from '../constants';
import { authService } from '../services/db';

interface NewsProps {
  news: News[];
}

export const NewsPage: React.FC<NewsProps> = ({ news }) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);

  const handleViewProfile = (authorId: string) => {
      const user = authService.getUserById(authorId);
      if (user) {
          setSelectedUser(user);
      } else {
          alert("Profil pengguna tidak ditemukan");
      }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Berita & Pengumuman</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
         {news.map(item => (
           <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-lg transition duration-300 group">
              <div className="h-56 overflow-hidden relative">
                 <img src={item.imageUrl || DUMMY_NEWS_IMAGE} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                 <div className="absolute bottom-4 left-4 text-white flex items-center gap-3 text-xs font-medium">
                    <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(item.createdAt).toLocaleDateString()}</span>
                    <button onClick={() => handleViewProfile(item.authorId)} className="flex items-center gap-1 hover:text-emerald-300 transition">
                        <UserIcon size={14} /> Penulis
                    </button>
                 </div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-2xl font-bold mb-3 text-gray-900 leading-tight group-hover:text-emerald-700 transition">{item.title}</h3>
                {/* Truncate to 3 lines */}
                <p className="text-gray-600 text-sm mb-6 leading-relaxed line-clamp-3">{item.content}</p>
                
                <div className="flex flex-wrap gap-3 mt-auto pt-6 border-t border-gray-50 items-center justify-between">
                  <button 
                    onClick={() => setSelectedNews(item)}
                    className="text-sm font-semibold text-emerald-600 flex items-center gap-1 hover:gap-2 transition-all"
                  >
                     Baca Selengkapnya <ChevronRight size={16}/>
                  </button>
                </div>
              </div>
           </div>
         ))}
      </div>
      {news.length === 0 && <p className="text-center text-gray-500 py-20">Belum ada berita terbaru.</p>}

      {/* News Detail Modal */}
      {selectedNews && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-2xl max-w-4xl w-full p-0 shadow-2xl animate-scale-up overflow-hidden flex flex-col max-h-[90vh]">
              <div className="h-64 relative flex-shrink-0">
                  <img src={selectedNews.imageUrl || DUMMY_NEWS_IMAGE} alt={selectedNews.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30"></div>
                  <button onClick={() => setSelectedNews(null)} className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full text-white transition">
                      <X size={20}/>
                  </button>
                  <div className="absolute bottom-6 left-8 text-white">
                      <h2 className="text-3xl font-bold leading-tight mb-2 drop-shadow-md">{selectedNews.title}</h2>
                      <div className="flex items-center gap-4 text-sm font-medium opacity-90">
                         <span className="flex items-center gap-1"><Calendar size={16}/> {new Date(selectedNews.createdAt).toLocaleDateString()}</span>
                      </div>
                  </div>
              </div>
              
              <div className="p-8 overflow-y-auto custom-scrollbar">
                  <div className="prose max-w-none text-gray-700 leading-loose whitespace-pre-line text-justify">
                      {selectedNews.content}
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-gray-100 flex gap-4">
                      {selectedNews.webUrl && (
                        <a href={selectedNews.webUrl} target="_blank" className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 font-semibold">
                           <Globe size={18}/> Kunjungi Website
                        </a>
                      )}
                       {selectedNews.documentUrl && (
                        <a href="#" className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition shadow-lg shadow-orange-200 font-semibold">
                           <File size={18}/> Unduh Dokumen
                        </a>
                      )}
                  </div>
              </div>
           </div>
        </div>
      )}

      {/* Profile Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-scale-up">
               <div className="flex justify-between items-center mb-6 pb-4 border-b">
                  <h3 className="text-lg font-bold text-gray-900">Profil Penulis</h3>
                  <button onClick={() => setSelectedUser(null)}><X className="text-gray-500"/></button>
               </div>
               <div className="flex flex-col items-center mb-6">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-3xl font-bold text-emerald-700 mb-3">
                     {selectedUser.name.charAt(0)}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedUser.name}</h2>
                  <p className="text-gray-500 text-sm">{selectedUser.email}</p>
                  <span className="mt-2 bg-emerald-50 text-emerald-700 text-xs px-2 py-1 rounded-md font-medium border border-emerald-100">{selectedUser.role}</span>
               </div>
               <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  {selectedUser.role === 'DOSEN' && selectedUser.nip && (
                     <div className="flex justify-between text-sm">
                        <span className="text-gray-500">NIP</span>
                        <span className="font-semibold text-gray-900">{selectedUser.nip}</span>
                     </div>
                  )}
                  {selectedUser.role === 'MAHASISWA' && selectedUser.nim && (
                     <div className="flex justify-between text-sm">
                        <span className="text-gray-500">NIM</span>
                        <span className="font-semibold text-gray-900">{selectedUser.nim}</span>
                     </div>
                  )}
               </div>
           </div>
        </div>
      )}
    </div>
  );
};