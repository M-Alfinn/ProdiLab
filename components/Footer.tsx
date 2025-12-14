import React from 'react';

export const Footer = () => (
  <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
    <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
      <p>&copy; 2024 ProdiLab. Inovasi Kampus.</p>
      <div className="flex space-x-6 mt-2 md:mt-0">
         <a href="#" className="hover:text-emerald-600 transition">Kebijakan Privasi</a>
         <a href="#" className="hover:text-emerald-600 transition">Syarat & Ketentuan</a>
         <a href="#" className="hover:text-emerald-600 transition">Bantuan</a>
      </div>
    </div>
  </footer>
);