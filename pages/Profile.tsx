import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { User as UserIcon, Mail, Hash, BookOpen, Calendar, Layers, Edit2, X, Save } from 'lucide-react';
import { authService } from '../services/db';

interface ProfileProps {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  addToast?: (msg: string, type: any) => void;
}

export const Profile: React.FC<ProfileProps> = ({ currentUser, setCurrentUser, addToast }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<User>(currentUser);

  const handleEdit = () => {
    setFormData(currentUser);
    setIsEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const updatedUser = authService.updateProfile(currentUser.id, formData);
        setCurrentUser(updatedUser);
        setIsEditing(false);
        if(addToast) addToast("Profil berhasil diperbarui", "success");
    } catch (error) {
        if(addToast) addToast("Gagal memperbarui profil", "error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 relative">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 h-32 relative">
           <div className="absolute -bottom-16 left-8">
             <div className="w-32 h-32 rounded-full bg-white p-2 shadow-lg">
                <div className="w-full h-full rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-5xl font-bold">
                  {currentUser.name.charAt(0)}
                </div>
             </div>
           </div>
        </div>
        
        {/* Tombol Edit Profil */}
        <div className="absolute top-36 right-8">
            <button 
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 rounded-lg transition border border-gray-200 shadow-sm font-medium text-sm"
            >
                <Edit2 size={16}/> Edit Profil
            </button>
        </div>

        <div className="pt-20 pb-8 px-8">
           <div className="flex justify-between items-start">
             <div>
                <h1 className="text-3xl font-bold text-gray-900">{currentUser.name}</h1>
                <p className="text-emerald-600 font-medium flex items-center gap-2 mt-1">
                   {currentUser.role === UserRole.MAHASISWA ? 'Mahasiswa Peneliti' : 'Dosen Pembimbing'}
                </p>
             </div>
             <span className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider border border-emerald-100">
               {currentUser.role}
             </span>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
              <div className="space-y-6">
                 <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Informasi Kontak</h3>
                 <div className="flex items-center gap-4 text-gray-600">
                    <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400"><Mail size={20}/></div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-bold">Email Institusi</p>
                      <p className="text-sm font-medium text-gray-900">{currentUser.email}</p>
                    </div>
                 </div>
              </div>

              <div className="space-y-6">
                 <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Informasi Akademik</h3>
                 {currentUser.role === UserRole.MAHASISWA ? (
                    <>
                      <div className="flex items-center gap-4 text-gray-600">
                        <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400"><Hash size={20}/></div>
                        <div>
                          <p className="text-xs text-gray-400 uppercase font-bold">Nomor Induk Mahasiswa (NIM)</p>
                          <p className="text-sm font-medium text-gray-900">{currentUser.nim}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-gray-600">
                        <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400"><Calendar size={20}/></div>
                        <div>
                          <p className="text-xs text-gray-400 uppercase font-bold">Angkatan</p>
                          <p className="text-sm font-medium text-gray-900">{currentUser.angkatan}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-gray-600">
                        <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400"><Layers size={20}/></div>
                        <div>
                          <p className="text-xs text-gray-400 uppercase font-bold">Kelas</p>
                          <p className="text-sm font-medium text-gray-900">{currentUser.kelas}</p>
                        </div>
                      </div>
                    </>
                 ) : (
                    <div className="flex items-center gap-4 text-gray-600">
                       <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400"><Hash size={20}/></div>
                       <div>
                         <p className="text-xs text-gray-400 uppercase font-bold">Nomor Induk Pegawai (NIP)</p>
                         <p className="text-sm font-medium text-gray-900">{currentUser.nip}</p>
                       </div>
                    </div>
                 )}
              </div>
           </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl animate-scale-up">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Edit Profil</h3>
                    <button onClick={() => setIsEditing(false)}><X className="text-gray-500 hover:text-gray-700"/></button>
                </div>
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                        <input name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-gray-900" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-gray-900" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input name="password" type="password" value={formData.password} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-gray-900" />
                    </div>
                    
                    {currentUser.role === UserRole.MAHASISWA && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">NIM</label>
                                <input name="nim" value={formData.nim || ''} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-gray-900" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Angkatan</label>
                                    <select name="angkatan" value={formData.angkatan || ''} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-gray-900">
                                        {Array.from({length: 8}, (_, i) => <option key={i} value={String(2018+i)}>{2018+i}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Kelas</label>
                                    <select name="kelas" value={formData.kelas || ''} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-gray-900">
                                        {['A','B','C','D'].map(c => <option key={c} value={c}>Kelas {c}</option>)}
                                    </select>
                                </div>
                            </div>
                        </>
                    )}

                     {currentUser.role === UserRole.DOSEN && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">NIP</label>
                            <input name="nip" value={formData.nip || ''} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-gray-900" />
                        </div>
                    )}

                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition">Batal</button>
                        <button type="submit" className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition shadow-md flex items-center gap-2">
                            <Save size={18} /> Simpan
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};