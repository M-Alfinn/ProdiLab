import React, { useState } from 'react';
import { Plus, Trash2, Check, X, ExternalLink, Edit, FileText, User as UserIcon, BookOpen, Clock, Layers, Link as LinkIcon, Edit2, Calendar } from 'lucide-react';
import { User, Project, News, UserRole, ProjectStatus, ProjectCategory } from '../types';
import { projectService, newsService, authService } from '../services/db';
import { DUMMY_NEWS_IMAGE } from '../constants';

interface DashboardProps {
  currentUser: User;
  projects: Project[];
  news: News[];
  refreshData: () => void;
  addToast: (msg: string, type: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ currentUser, projects, news, refreshData, addToast }) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [viewingProject, setViewingProject] = useState<Project | null>(null);
  
  // --- Helper Components for Dashboard ---
  const InfoCard = ({ title, value, icon, color }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition duration-300">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
      </div>
      <div className={`p-4 rounded-xl ${color}`}>
        {icon}
      </div>
    </div>
  );

  const viewStudentProfile = (studentId: string) => {
    const student = authService.getUserById(studentId);
    if (student) {
        setSelectedStudent(student);
        setActiveModal('viewStudent');
    } else {
        addToast("Data mahasiswa tidak ditemukan", "error");
    }
  };

  const openProjectModal = (project?: Project) => {
      setEditingProject(project || null);
      setActiveModal('projectModal');
  };

  const openNewsModal = (newsItem?: News) => {
      setEditingNews(newsItem || null);
      setActiveModal('newsModal');
  };

  // --- Student View ---
  if (currentUser.role === UserRole.MAHASISWA) {
    const myProjects = projects.filter(p => p.authorId === currentUser.id);

    const handleDelete = (id: string) => {
      if(confirm("Hapus karya ini?")) {
        projectService.delete(id);
        refreshData();
        addToast("Karya dihapus", "info");
      }
    };

    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Dashboard Mahasiswa</h1>
        {/* Profile removed from here as per request, handled in separate page */}

        <div className="flex justify-between items-center mb-6">
           <div>
              <h2 className="text-xl font-bold text-gray-900">Karya Ilmiah Saya</h2>
              <p className="text-sm text-gray-500">Kelola publikasi dan inovasi Anda.</p>
           </div>
           <button 
             onClick={() => openProjectModal()} 
             className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700 shadow-md transition"
           >
             <Plus size={18}/> Tambah Karya
           </button>
        </div>
        
        <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Judul Karya</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Kategori</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status Validasi</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {myProjects.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-gray-900">{p.title}</div>
                    <div className="text-xs text-gray-500 mt-1">{p.year}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-medium rounded-md bg-blue-50 text-blue-700 border border-blue-100">{p.category}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      p.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 
                      p.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {p.status === 'PENDING' ? 'Menunggu Review' : p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => openProjectModal(p)} className="text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-full transition mr-1">
                        <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition">
                      <Trash2 size={18}/>
                    </button>
                  </td>
                </tr>
              ))}
              {myProjects.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">Belum ada karya yang diunggah.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Project Modal Logic */}
        {activeModal === 'projectModal' && (
           <ProjectModal 
                onClose={() => setActiveModal(null)} 
                currentUser={currentUser} 
                refreshData={refreshData} 
                addToast={addToast} 
                projectToEdit={editingProject}
            />
        )}
      </div>
    );
  }

  // --- Admin View ---
  if (currentUser.role === UserRole.DOSEN) {
    const pendingProjects = projects.filter(p => p.status === ProjectStatus.PENDING);
    const totalProjects = projects.length;
    
    const handleVerify = (id: string, status: ProjectStatus) => {
      projectService.verify(id, status);
      refreshData();
      addToast(`Karya berhasil di-${status.toLowerCase()}`, status === ProjectStatus.APPROVED ? 'success' : 'info');
    };

    const handleDeleteNews = (id: string) => {
        if(confirm("Hapus berita ini?")) {
            newsService.delete(id);
            refreshData();
            addToast("Berita dihapus", "info");
        }
    };

    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
         <h1 className="text-2xl font-bold mb-6 text-gray-800">Dashboard Admin & Dosen</h1>
         {/* Profile Card removed */}

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
           <InfoCard 
             title="Total Karya Masuk" 
             value={totalProjects} 
             icon={<BookOpen size={24} className="text-blue-600"/>} 
             color="bg-blue-50"
           />
           <InfoCard 
             title="Menunggu Verifikasi" 
             value={pendingProjects.length} 
             icon={<Clock size={24} className="text-amber-600"/>} 
             color="bg-amber-50"
           />
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
            {/* Verification Section */}
            <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Check size={20} className="text-emerald-600"/> Verifikasi Karya
              </h3>
              <div className="space-y-4">
                {pendingProjects.map(p => (
                  <div key={p.id} className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md transition duration-200 flex flex-col sm:flex-row justify-between gap-4">
                     <div>
                        <h4 className="font-bold text-gray-900">{p.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm text-gray-500">Oleh: <span className="text-emerald-700 font-medium">{p.authorName}</span></p>
                            <button onClick={() => viewStudentProfile(p.authorId)} className="text-[10px] bg-gray-100 hover:bg-emerald-100 text-gray-600 hover:text-emerald-700 px-2 py-0.5 rounded flex items-center gap-1 transition">
                                <UserIcon size={10} /> Profil
                            </button>
                        </div>
                        <div className="flex gap-2 mt-2">
                           <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">{p.category}</span>
                           <button onClick={() => setViewingProject(p)} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                             <ExternalLink size={12} /> Lihat Detail
                           </button>
                        </div>
                     </div>
                     <div className="flex gap-2 items-center">
                        <button onClick={() => handleVerify(p.id, ProjectStatus.APPROVED)} className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition font-medium">Terima</button>
                        <button onClick={() => handleVerify(p.id, ProjectStatus.REJECTED)} className="px-4 py-2 bg-white border border-red-200 text-red-600 text-sm rounded-lg hover:bg-red-50 transition font-medium">Tolak</button>
                     </div>
                  </div>
                ))}
                {pendingProjects.length === 0 && (
                  <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-500">
                    Tidak ada karya yang perlu diverifikasi.
                  </div>
                )}
              </div>
            </div>
         </div>
          
         {/* News Section Re-styled as List */}
         <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
               <h3 className="font-bold text-lg flex items-center gap-2 text-gray-900">
                  <Layers size={20} className="text-purple-600"/> Manajemen Berita
               </h3>
               <button onClick={() => openNewsModal()} className="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition flex items-center gap-1 shadow-sm">
                 <Plus size={16}/> Buat Berita
               </button>
            </div>
            
            <div className="overflow-x-auto">
               <table className="min-w-full divide-y divide-gray-200">
                 <thead className="bg-white">
                    <tr>
                       <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-20">Cover</th>
                       <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Judul & Konten</th>
                       <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tanggal</th>
                       <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                 </thead>
                 <tbody className="bg-white divide-y divide-gray-200">
                    {news.map(n => (
                       <tr key={n.id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 whitespace-nowrap">
                             <img src={n.imageUrl || DUMMY_NEWS_IMAGE} className="w-12 h-12 rounded-lg object-cover bg-gray-100" alt="cover"/>
                          </td>
                          <td className="px-6 py-4">
                             <div className="text-sm font-bold text-gray-900">{n.title}</div>
                             <div className="text-xs text-gray-500 truncate max-w-xs">{n.content}</div>
                             {n.webUrl && (
                                <a href={n.webUrl} target="_blank" className="text-[10px] text-blue-600 flex items-center gap-1 mt-1 hover:underline">
                                   <LinkIcon size={10}/> {n.webUrl}
                                </a>
                             )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                             {new Date(n.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right flex items-center justify-end gap-2">
                             <button onClick={() => openNewsModal(n)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition">
                                <Edit2 size={16} />
                             </button>
                             <button onClick={() => handleDeleteNews(n.id)} className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition">
                                <Trash2 size={16} />
                             </button>
                          </td>
                       </tr>
                    ))}
                    {news.length === 0 && (
                       <tr><td colSpan={4} className="text-center py-8 text-gray-500 text-sm">Belum ada berita yang diterbitkan.</td></tr>
                    )}
                 </tbody>
               </table>
            </div>
         </div>

         {/* Modals */}
         {activeModal === 'newsModal' && (
           <NewsModal 
                onClose={() => setActiveModal(null)} 
                currentUser={currentUser} 
                refreshData={refreshData} 
                addToast={addToast} 
                newsToEdit={editingNews}
            />
         )}

         {/* Viewing Project Detail (Verification) */}
         {viewingProject && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
               <div className="bg-white rounded-2xl max-w-3xl w-full p-8 shadow-2xl animate-scale-up max-h-[90vh] overflow-y-auto">
                   <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
                      <div>
                         <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md mb-2 inline-block">
                            {viewingProject.category}
                         </span>
                         <h3 className="text-2xl font-bold text-gray-900 leading-tight">{viewingProject.title}</h3>
                         <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                            <Calendar size={14}/> Tahun {viewingProject.year} &bull; 
                            <UserIcon size={14}/> {viewingProject.authorName}
                         </p>
                      </div>
                      <button onClick={() => setViewingProject(null)} className="p-1 hover:bg-gray-100 rounded-full transition"><X className="text-gray-500"/></button>
                   </div>
                   
                   <div className="space-y-6">
                      <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-gray-700 leading-relaxed text-justify">
                         <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2"><FileText size={18}/> Deskripsi Karya</h4>
                         {viewingProject.description}
                      </div>

                      <div className="flex justify-end pt-4">
                         <a 
                           href={viewingProject.linkOrFile} 
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

         {activeModal === 'viewStudent' && selectedStudent && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
               <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-scale-up">
                   <div className="flex justify-between items-center mb-6 pb-4 border-b">
                      <h3 className="text-lg font-bold text-gray-900">Profil Mahasiswa</h3>
                      <button onClick={() => {setActiveModal(null); setSelectedStudent(null);}}><X className="text-gray-500"/></button>
                   </div>
                   <div className="flex flex-col items-center mb-6">
                      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-3xl font-bold text-emerald-700 mb-3">
                         {selectedStudent.name.charAt(0)}
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">{selectedStudent.name}</h2>
                      <p className="text-gray-500 text-sm">{selectedStudent.email}</p>
                   </div>
                   <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <div className="flex justify-between text-sm">
                         <span className="text-gray-500">NIM</span>
                         <span className="font-semibold text-gray-900">{selectedStudent.nim}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                         <span className="text-gray-500">Angkatan</span>
                         <span className="font-semibold text-gray-900">{selectedStudent.angkatan}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                         <span className="text-gray-500">Kelas</span>
                         <span className="font-semibold text-gray-900">{selectedStudent.kelas}</span>
                      </div>
                   </div>
               </div>
            </div>
         )}
      </div>
    );
  }
  return null;
};

// --- Sub-components specific to Dashboard (Modals) ---

const ProjectModal = ({ onClose, currentUser, refreshData, addToast, projectToEdit }: any) => {
  const [pData, setPData] = useState({
    title: projectToEdit?.title || '', 
    description: projectToEdit?.description || '', 
    category: projectToEdit?.category || ProjectCategory.RISET, 
    year: projectToEdit?.year || '2024', 
    linkOrFile: projectToEdit?.linkOrFile || '', 
    documentName: projectToEdit?.documentName || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
     e.preventDefault();
     if (projectToEdit) {
         projectService.update(projectToEdit.id, {
             ...pData,
             status: ProjectStatus.PENDING // Reset status to pending on update
         });
         addToast("Karya diperbarui dan menunggu verifikasi ulang", "success");
     } else {
         projectService.create({
           authorId: currentUser.id,
           authorName: currentUser.name,
           ...pData
         });
         addToast("Karya berhasil ditambahkan!", 'success');
     }
     onClose();
     refreshData();
  };

  return (
     <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        {/* Changed width to max-w-3xl for wider form */}
        <div className="bg-white rounded-2xl max-w-3xl w-full p-8 max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-up">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">{projectToEdit ? 'Edit Karya' : 'Publikasi Karya Baru'}</h3>
            <button onClick={onClose}><X className="text-gray-500 hover:text-gray-700"/></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Judul Karya Ilmiah</label>
              <input value={pData.title} onChange={(e) => setPData({...pData, title: e.target.value})} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-gray-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Abstrak / Deskripsi</label>
              <textarea value={pData.description} onChange={(e) => setPData({...pData, description: e.target.value})} required rows={5} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-gray-900" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <select value={pData.category} onChange={(e: any) => setPData({...pData, category: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-gray-900">
                  {Object.values(ProjectCategory).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tahun</label>
                <input value={pData.year} onChange={(e) => setPData({...pData, year: e.target.value})} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-gray-900" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Link Repository (Github/Drive)</label>
              <input value={pData.linkOrFile} onChange={(e) => setPData({...pData, linkOrFile: e.target.value})} required placeholder="https://..." className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-gray-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload Dokumen (PDF)</label>
              <input type="file" accept=".pdf" onChange={(e) => setPData({...pData, documentName: e.target.value})} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 bg-white"/>
            </div>
            <div className="pt-4 flex justify-end gap-3">
              <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition">Batal</button>
              <button type="submit" className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition shadow-md">Simpan</button>
            </div>
          </form>
        </div>
     </div>
  );
};

const NewsModal = ({ onClose, currentUser, refreshData, addToast, newsToEdit }: any) => {
  const [nData, setNData] = useState({ 
      title: newsToEdit?.title || '', 
      content: newsToEdit?.content || '', 
      imageUrl: newsToEdit?.imageUrl || '', 
      webUrl: newsToEdit?.webUrl || '', 
      documentUrl: newsToEdit?.documentUrl || '' 
  });

  const handleSubmit = (e: React.FormEvent) => {
     e.preventDefault();
     if(newsToEdit) {
         newsService.update(newsToEdit.id, nData);
         addToast("Berita diperbarui!", "success");
     } else {
         newsService.create({ authorId: currentUser.id, ...nData });
         addToast("Berita diterbitkan!", 'success');
     }
     onClose();
     refreshData();
  };

  return (
     <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        {/* Changed width to max-w-3xl for wider form */}
        <div className="bg-white rounded-2xl max-w-3xl w-full p-8 shadow-2xl animate-scale-up">
          <h3 className="text-xl font-bold mb-6 text-gray-900">{newsToEdit ? 'Edit Berita' : 'Buat Berita Baru'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Judul Berita</label>
                <input placeholder="Judul Berita" value={nData.title} onChange={(e) => setNData({...nData, title: e.target.value})} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-gray-900" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Konten</label>
                <textarea placeholder="Konten Berita" value={nData.content} onChange={(e) => setNData({...nData, content: e.target.value})} required rows={6} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-gray-900" />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL Gambar Header</label>
                <input placeholder="https://..." value={nData.imageUrl} onChange={(e) => setNData({...nData, imageUrl: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-gray-900" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link Website / URL Berita</label>
                <input placeholder="https://..." value={nData.webUrl} onChange={(e) => setNData({...nData, webUrl: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-gray-900" />
            </div>
            
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-700">Batal</button>
              <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">{newsToEdit ? 'Simpan Perubahan' : 'Terbitkan'}</button>
            </div>
          </form>
        </div>
     </div>
  );
};