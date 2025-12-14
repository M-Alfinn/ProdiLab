import React, { useState } from 'react';
import { Eye, EyeOff, GraduationCap } from 'lucide-react';
import { authService } from '../services/db';
import { UserRole } from '../types';

interface LoginProps {
  setCurrentUser: (user: any) => void;
  setView: (view: any) => void;
  addToast: (msg: string, type: any) => void;
}

export const Login: React.FC<LoginProps> = ({ setCurrentUser, setView, addToast }) => {
  const [tab, setTab] = useState<UserRole>(UserRole.MAHASISWA);
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = authService.login(formData.email, formData.password, tab);
    if (user) {
      setCurrentUser(user);
      addToast(`Selamat datang, ${user.name}!`, 'success');
      setView('dashboard');
    } else {
      addToast("Email atau password salah!", 'error');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-emerald-200">
             <GraduationCap size={36} />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Masuk Akun</h2>
          <p className="mt-2 text-sm text-gray-500">
             Silakan pilih peran Anda untuk melanjutkan.
          </p>
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
            Dosen / Admin
          </button>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Institusi</label>
            <input 
              type="email" 
              value={formData.email} 
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition bg-white"
              required 
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type={showPass ? "text" : "password"} 
              value={formData.password} 
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition bg-white"
              required 
            />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-9 text-gray-400 hover:text-gray-600">
              {showPass ? <EyeOff size={20}/> : <Eye size={20}/>}
            </button>
          </div>

          <button type="submit" className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-200 transition duration-200 transform hover:-translate-y-0.5">
            Masuk Sekarang
          </button>
        </form>
        
        <div className="mt-8 text-center text-sm">
          <span className="text-gray-500">Belum punya akun? </span>
          <span onClick={() => setView('register')} className="text-emerald-600 cursor-pointer hover:underline font-bold">Daftar disini</span>
        </div>
      </div>
    </div>
  );
};