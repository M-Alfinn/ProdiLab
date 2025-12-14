export enum UserRole {
  MAHASISWA = 'MAHASISWA',
  DOSEN = 'DOSEN' // Admin
}

export enum ProjectStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum ProjectCategory {
  RISET = 'Riset',
  STARTUP = 'Startup',
  PRODUK = 'Produk',
  SKRIPSI = 'Skripsi',
  OTHER = 'Lainnya'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
  // Specific to Mahasiswa
  nim?: string;
  angkatan?: string; // 2018-2025
  kelas?: string; // A, B, C, D
  // Specific to Dosen
  nip?: string;
}

export interface Project {
  id: string;
  authorId: string;
  authorName: string; // Denormalized for easier display
  title: string;
  description: string;
  category: ProjectCategory;
  year: string;
  linkOrFile: string;
  documentName?: string; // New field for uploaded file name simulation
  status: ProjectStatus;
  createdAt: string;
  likes: string[]; // Array of User IDs who liked this
}

export interface News {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  webUrl?: string; // New
  documentUrl?: string; // New
  createdAt: string;
  authorId: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}