import React, { useState } from 'react';
import { Search, Heart, ExternalLink, Atom, GraduationCap, User as UserIcon, X, ChevronDown, Calendar, Layers, FileText } from 'lucide-react';
import { Project, ProjectCategory, ProjectStatus, User } from '../types';
import { projectService, authService } from '../services/db';

interface GalleryProps {
  projects: Project[];
  currentUser: any;
  refreshData: () => void;
  addToast: (msg: string, type: any) => void;
}

export const Gallery: React.FC<GalleryProps> = ({ projects, currentUser, refreshData, addToast }) => {
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState<string>('All');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  const filteredProjects = projects.filter(p => 
    p.status === ProjectStatus.APPROVED &&
    (catFilter === 'All' || p.category === catFilter) &&
    (p.title.toLowerCase().includes(search.toLowerCase()) || p.authorName.toLowerCase().includes(search.toLowerCase()))
  );

  const handleLike = (pid: string) => {
    if (!currentUser) {
      addToast("Silakan login untuk menyukai karya", "info");
      return;
    }
    const updated = projectService.toggleLike(pid, currentUser.id);
    if (updated) {
      refreshData();
      const isLiked = updated.likes.includes(currentUser.id);
      if(isLiked) addToast("Berhasil menyukai karya", "success");
    }
  };

  const handleViewProfile = (authorId: string) => {
    const user = authService.getUserById(authorId);
    if (user) {
        setSelectedUser(user);
    } else {
        addToast("Data pengguna tidak ditemukan", "error");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-3">
           <GraduationCap className="text-emerald-600" size={36}/> Galeri Inovasi
        </h2>
        <p className="mt-2 text-gray-600">Jelajahi karya ilmiah terbaik dari civitas akademika.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-10 justify-center items-center">
        <div className="relative w-full max-w-md group">
          <Search className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-emerald-500 transition" size={20} />
          <input 
            type="text" 
            placeholder="Cari judul riset atau nama peneliti..." 
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm transition bg-white text-gray-900 placeholder-gray-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        {/* Styled Dropdown dengan Custom Chevron */}
        <div className="relative min-w-[200px]">
          <select 
            className="w-full appearance-none pl-5 pr-12 py-3 border border-gray-200 rounded-xl bg-white text-gray-700 font-medium outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm cursor-pointer hover:border-emerald-300 transition duration-200"
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
          >
            <option value="All" className="py-2">Semua Kategori</option>
            {Object.values(ProjectCategory).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-500">
             <ChevronDown size={18} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map(project => (
          <div key={project.id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition duration-300 border border-gray-100 flex flex-col group">
            <div className="p-6 flex-1">
              <div className="flex justify-between items-start mb-4">
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md">{project.category}</span>
                <span className="text-xs text-gray-400 font-medium bg-gray-50 px-2 py-1 rounded">{project.year}</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition leading-tight line-clamp-2">{project.title}</h3>
              <p className="text-gray-600 text-sm line-clamp-3 mb-6 leading-relaxed">{project.description}</p>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                    {project.authorName.charAt(0)}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-700 block">{project.authorName}</span>
                    <span className="text-[10px] text-gray-400">Peneliti Utama</span>
                  </div>
                </div>
                <button 
                  onClick={() => handleViewProfile(project.authorId)}
                  className="text-[10px] bg-gray-100 hover:bg-emerald-100 text-gray-600 hover:text-emerald-700 px-2 py-1 rounded flex items-center gap-1 transition"
                >
                  <UserIcon size={12} /> Lihat Profil
                </button>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t border-gray-100">
               <button 
                onClick={() => handleLike(project.id)}
                className={`flex items-center gap-1.5 transition text-sm font-medium ${project.likes.includes(currentUser?.id || '') ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
               >
                 <Heart size={18} fill={project.likes.includes(currentUser?.id || '') ? "currentColor" : "none"} />
                 <span>{project.likes.length}</span>
               </button>
               <button 
                  onClick={() => setSelectedProject(project)}
                  className="flex items-center gap-1 text-emerald-600 hover:text-emerald-800 text-xs font-bold uppercase tracking-wide"
               >
                 Lihat Detail <ExternalLink size={14}/>
               </button>
            </div>
          </div>
        ))}
      </div>
      
      {filteredProjects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Atom size={48} className="mb-4 text-gray-200" />
          <p>Tidak ada karya riset ditemukan.</p>
        </div>
      )}

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-2xl max-w-3xl w-full p-8 shadow-2xl animate-scale-up max-h-[90vh] overflow-y-auto">
               <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
                  <div>
                     <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md mb-2 inline-block">
                        {selectedProject.category}
                     </span>
                     <h3 className="text-2xl font-bold text-gray-900 leading-tight">{selectedProject.title}</h3>
                     <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                        <Calendar size={14}/> Tahun {selectedProject.year} &bull; 
                        <UserIcon size={14}/> {selectedProject.authorName}
                     </p>
                  </div>
                  <button onClick={() => setSelectedProject(null)} className="p-1 hover:bg-gray-100 rounded-full transition"><X className="text-gray-500"/></button>
               </div>
               
               <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-gray-700 leading-relaxed text-justify">
                     <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2"><FileText size={18}/> Deskripsi Karya</h4>
                     {selectedProject.description}
                  </div>

                  <div className="flex justify-end pt-4">
                     <a 
                       href={selectedProject.linkOrFile} 
                       target="_blank" 
                       rel="noreferrer"
                       className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-200 flex items-center gap-2 font-semibold"
                     >
                       <ExternalLink size={18} /> Kunjungi Tautan / Repository
                     </a>
                  </div>
               </div>
           </div>
        </div>
      )}

      {/* Student Profile Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-scale-up">
               <div className="flex justify-between items-center mb-6 pb-4 border-b">
                  <h3 className="text-lg font-bold text-gray-900">Profil Peneliti</h3>
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
                  {selectedUser.nim && (
                    <div className="flex justify-between text-sm">
                       <span className="text-gray-500">NIM</span>
                       <span className="font-semibold text-gray-900">{selectedUser.nim}</span>
                    </div>
                  )}
                  {selectedUser.angkatan && (
                    <div className="flex justify-between text-sm">
                       <span className="text-gray-500">Angkatan</span>
                       <span className="font-semibold text-gray-900">{selectedUser.angkatan}</span>
                    </div>
                  )}
                  {selectedUser.kelas && (
                    <div className="flex justify-between text-sm">
                       <span className="text-gray-500">Kelas</span>
                       <span className="font-semibold text-gray-900">{selectedUser.kelas}</span>
                    </div>
                  )}
                   {selectedUser.nip && (
                    <div className="flex justify-between text-sm">
                       <span className="text-gray-500">NIP</span>
                       <span className="font-semibold text-gray-900">{selectedUser.nip}</span>
                    </div>
                  )}
               </div>
           </div>
        </div>
      )}
    </div>
  );
};