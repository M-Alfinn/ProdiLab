import React from 'react';
import { Atom, Users, Award, Check, ChevronRight, GraduationCap } from 'lucide-react';
import { User } from '../types';

interface LandingProps {
  currentUser: User | null;
  setView: (view: any) => void;
}

export const Landing: React.FC<LandingProps> = ({ currentUser, setView }) => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8 bg-gradient-to-b from-emerald-50/80 to-white pb-24">
        <div className="mx-auto max-w-3xl py-24 text-center">
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <div className="relative rounded-full px-4 py-1.5 text-sm leading-6 text-gray-600 ring-1 ring-emerald-900/10 hover:ring-emerald-900/20 bg-white/60 backdrop-blur-sm transition cursor-default">
              Membangun Ekosistem Riset Modern
            </div>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-7xl mb-8 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-emerald-800">
            ProdiLab
          </h1>
          <p className="text-xl font-medium text-emerald-600 mb-8 flex items-center justify-center gap-2">
            <GraduationCap className="text-emerald-600" size={32} /> 
            <span>Wadah Digital Inovasi</span>
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600 mb-12 max-w-2xl mx-auto">
            Platform kolaboratif untuk mahasiswa dan dosen. Publikasikan karya ilmiah, validasi riset, dan temukan inovasi teknologi terbaru di lingkungan kampus.
          </p>
          <div className="flex items-center justify-center gap-x-6">
            {!currentUser ? (
               <>
                 <button onClick={() => setView('register')} className="px-8 py-4 text-base font-semibold text-white bg-emerald-600 rounded-xl shadow-xl shadow-emerald-200 hover:bg-emerald-700 hover:-translate-y-1 transition duration-300 flex items-center gap-2">
                    Mulai Riset <ChevronRight size={18}/>
                 </button>
                 <button onClick={() => setView('login')} className="px-8 py-4 text-base font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition duration-300">
                    Masuk Akun
                 </button>
               </>
            ) : (
               <button onClick={() => setView('dashboard')} className="px-8 py-4 text-base font-semibold text-white bg-emerald-600 rounded-xl shadow-lg hover:bg-emerald-700 transition duration-300">
                  Akses Dashboard
               </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-emerald-950 py-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <dl className="grid grid-cols-1 gap-y-16 gap-x-8 text-center lg:grid-cols-3">
            {[
              { id: 1, name: 'Karya Ilmiah', value: '340+' },
              { id: 2, name: 'Mahasiswa Peneliti', value: '1.2k' },
              { id: 3, name: 'Jurnal Terbit', value: '125' },
            ].map((stat) => (
              <div key={stat.id} className="mx-auto flex max-w-xs flex-col gap-y-4">
                <dt className="text-base leading-7 text-emerald-200 uppercase tracking-widest text-xs font-semibold">{stat.name}</dt>
                <dd className="order-first text-4xl font-bold tracking-tight text-white sm:text-6xl font-mono">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Features */}
      <div className="py-24 sm:py-32 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-emerald-600 uppercase tracking-wider">Keunggulan Sistem</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Mengapa Memilih ProdiLab?</p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3">
              {[
                { name: 'Integrasi Data Riset', description: 'Database terpusat untuk semua karya ilmiah dan proyek mahasiswa.', icon: Atom },
                { name: 'Validasi Akademik', description: 'Proses review dan validasi langsung oleh dosen pembimbing.', icon: Check },
                { name: 'Showcase Inovasi', description: 'Galeri publik untuk memamerkan hasil riset kepada industri.', icon: Award },
              ].map((feature) => (
                <div key={feature.name} className="flex flex-col items-start p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-emerald-200 transition duration-300">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <dt className="text-lg font-bold leading-7 text-gray-900">{feature.name}</dt>
                  <dd className="mt-2 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};