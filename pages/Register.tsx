import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { authService } from '../services/db';
import { UserRole } from '../types';

interface RegisterProps {
  setView: (view: any) => void;
  addToast: (msg: string, type: any) => void;
}

export const Register: React.FC<RegisterProps> = ({ setView, addToast }) => {
  const [tab, setTab] = useState<UserRole>(UserRole.MAHASISWA);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [formData, setFormData] = useState<any>({
    name: '', email: '', password: '', confirmPassword: '',
    nim: '', angkatan: '2022', kelas: 'A',
    nip: ''
  });

  const handleChange = (e: any) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi Password
    if (formData.password !== formData.confirmPassword) {
        addToast("Konfirmasi password tidak sesuai!", 'error');
        return;
    }

    try {
      const newUser = {
        role: tab,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        ...(tab === UserRole.MAHASISWA ? {
          nim: formData.nim,
          angkatan: formData.angkatan,
          kelas: formData.kelas
        } : {
          nip: formData.nip
        })
      };
      authService.register(newUser);
      addToast("Registrasi Berhasil! Silakan Login.", 'success');
      setView('login');
    } catch (err: any) {
      addToast(err.message, 'error');
    }
  };

  return (
     <div className="flex min-h-[calc(100vh-140px)] items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center mb-8">
           <h2 className="text-3xl font-bold tracking-tight text-gray-900">Buat Akun Baru</h2>
           <p className="mt-2 text-sm text-gray-500">Bergabunglah dengan komunitas inovator kampus.</p>
        </div>

        <div className="flex p-1 bg-gray-100 rounded-xl mb-8">
          <button 
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${tab === UserRole.MAHASISWA ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setTab(UserRole.MAHASISWA)}
          >
            Mahasiswa
          </button>
          <button 
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${tab === UserRole.DOSEN ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setTab(UserRole.DOSEN)}
          >
            Dosen
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <input name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-gray-900" />
          </div>
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
             <input name="email" type="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-gray-900" />
          </div>
          
          {tab === UserRole.MAHASISWA && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NIM</label>
                <input name="nim" value={formData.nim} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-gray-900" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Angkatan</label>
                   <select name="angkatan" value={formData.angkatan} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-gray-900">
                      {Array.from({length: 8}, (_, i) => <option key={i} value={String(2018+i)}>{2018+i}</option>)}
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Kelas</label>
                   <select name="kelas" value={formData.kelas} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-gray-900">
                      {['A','B','C','D'].map(c => <option key={c} value={c}>Kelas {c}</option>)}
                   </select>
                </div>
              </div>
            </>
          )}

          {tab === UserRole.DOSEN && (
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">NIP</label>
               <input name="nip" value={formData.nip} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-gray-900" />
            </div>
          )}

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input name="password" type={showPass ? "text" : "password"} value={formData.password} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-gray-900" />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-8 text-gray-500">
              {showPass ? <EyeOff size={18}/> : <Eye size={18}/>}
            </button>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password</label>
            <input name="confirmPassword" type={showConfirmPass ? "text" : "password"} value={formData.confirmPassword} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-gray-900" />
            <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-3 top-8 text-gray-500">
              {showConfirmPass ? <EyeOff size={18}/> : <Eye size={18}/>}
            </button>
          </div>

          <button type="submit" className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-md transition duration-200 mt-6">Daftar Sekarang</button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-500">Sudah punya akun? </span>
          <span onClick={() => setView('login')} className="text-emerald-600 cursor-pointer hover:underline font-bold">Masuk disini</span>
        </div>
      </div>
    </div>
  );
};