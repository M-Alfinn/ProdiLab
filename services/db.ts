import { User, Project, News, Notification, UserRole, ProjectStatus, ProjectCategory } from '../types';

// Keys for LocalStorage
const STORAGE_KEYS = {
  USERS: 'prodilab_users',
  PROJECTS: 'prodilab_projects',
  NEWS: 'prodilab_news',
  NOTIFICATIONS: 'prodilab_notifications',
  CURRENT_USER: 'prodilab_current_user',
};

// --- Helper Functions ---
const getStorage = <T>(key: string, defaultVal: T): T => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultVal;
};

const setStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const generateId = () => Math.random().toString(36).substr(2, 9);

// --- Initialization (Seed Data) ---
export const initDB = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    const adminId = 'admin1';
    const users: User[] = [
      {
        id: adminId,
        role: UserRole.DOSEN,
        name: 'Dr. Admin Prodi',
        email: 'admin@prodilab.ac.id',
        password: 'admin',
        nip: '19850101201001'
      },
      {
        id: 'mhs1',
        role: UserRole.MAHASISWA,
        name: 'Budi Santoso',
        email: 'budi@mhs.ac.id',
        password: 'mhs',
        nim: '2021001',
        angkatan: '2021',
        kelas: 'A'
      }
    ];
    setStorage(STORAGE_KEYS.USERS, users);

    const projects: Project[] = [
      {
        id: 'p1',
        authorId: 'mhs1',
        authorName: 'Budi Santoso',
        title: 'Sistem Deteksi Banjir IoT',
        description: 'Prototipe alat pendeteksi banjir menggunakan sensor ultrasonic dan LoRa.',
        category: ProjectCategory.RISET,
        year: '2023',
        linkOrFile: 'https://github.com/budi/iot-flood',
        status: ProjectStatus.APPROVED,
        createdAt: new Date().toISOString(),
        likes: ['admin1']
      }
    ];
    setStorage(STORAGE_KEYS.PROJECTS, projects);

    const news: News[] = [
      {
        id: 'n1',
        authorId: adminId,
        title: 'Lomba Inovasi Nasional 2024',
        content: 'Segera daftarkan tim kalian untuk mengikuti LIN 2024. Hadiah total 50 Juta Rupiah!',
        imageUrl: 'https://picsum.photos/id/20/800/400',
        webUrl: 'https://lomba.id',
        createdAt: new Date().toISOString()
      }
    ];
    setStorage(STORAGE_KEYS.NEWS, news);
    setStorage(STORAGE_KEYS.NOTIFICATIONS, []);
  }
};

// --- Auth Services ---
export const authService = {
  login: (email: string, pass: string, role: UserRole): User | null => {
    const users = getStorage<User[]>(STORAGE_KEYS.USERS, []);
    const user = users.find(u => u.email === email && u.password === pass && u.role === role);
    if (user) {
      setStorage(STORAGE_KEYS.CURRENT_USER, user);
      return user;
    }
    return null;
  },
  register: (user: Omit<User, 'id'>) => {
    const users = getStorage<User[]>(STORAGE_KEYS.USERS, []);
    if (users.find(u => u.email === user.email || (user.nim && u.nim === user.nim) || (user.nip && u.nip === user.nip))) {
      throw new Error("User already exists (Email/NIM/NIP)");
    }
    const newUser = { ...user, id: generateId() };
    users.push(newUser);
    setStorage(STORAGE_KEYS.USERS, users);
    return newUser;
  },
  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },
  getCurrentUser: (): User | null => {
    return getStorage<User | null>(STORAGE_KEYS.CURRENT_USER, null);
  },
  getUserById: (id: string): User | undefined => {
    const users = getStorage<User[]>(STORAGE_KEYS.USERS, []);
    return users.find(u => u.id === id);
  },
  updateProfile: (userId: string, data: Partial<User>) => {
    const users = getStorage<User[]>(STORAGE_KEYS.USERS, []);
    const idx = users.findIndex(u => u.id === userId);
    if (idx !== -1) {
        users[idx] = { ...users[idx], ...data };
        setStorage(STORAGE_KEYS.USERS, users);
        setStorage(STORAGE_KEYS.CURRENT_USER, users[idx]); // Update session
        return users[idx];
    }
    throw new Error("User not found");
  }
};

// --- Project Services ---
export const projectService = {
  getAll: (): Project[] => getStorage(STORAGE_KEYS.PROJECTS, []),
  
  create: (project: Omit<Project, 'id' | 'createdAt' | 'status' | 'likes'>) => {
    const projects = getStorage<Project[]>(STORAGE_KEYS.PROJECTS, []);
    const newProject: Project = {
      ...project,
      id: generateId(),
      status: ProjectStatus.PENDING,
      likes: [],
      createdAt: new Date().toISOString()
    };
    projects.push(newProject);
    setStorage(STORAGE_KEYS.PROJECTS, projects);

    // Notify ALL Dosens about new project
    const users = getStorage<User[]>(STORAGE_KEYS.USERS, []);
    const dosens = users.filter(u => u.role === UserRole.DOSEN);
    dosens.forEach(dosen => {
        notificationService.create(dosen.id, `Karya Baru: "${newProject.title}" menunggu verifikasi.`, 'info');
    });

    return newProject;
  },

  update: (id: string, data: Partial<Project>) => {
    const projects = getStorage<Project[]>(STORAGE_KEYS.PROJECTS, []);
    const idx = projects.findIndex(p => p.id === id);
    if (idx !== -1) {
      projects[idx] = { ...projects[idx], ...data };
      setStorage(STORAGE_KEYS.PROJECTS, projects);
      return projects[idx];
    }
    return null;
  },

  delete: (id: string) => {
    let projects = getStorage<Project[]>(STORAGE_KEYS.PROJECTS, []);
    projects = projects.filter(p => p.id !== id);
    setStorage(STORAGE_KEYS.PROJECTS, projects);
  },

  toggleLike: (projectId: string, userId: string) => {
    const projects = getStorage<Project[]>(STORAGE_KEYS.PROJECTS, []);
    const users = getStorage<User[]>(STORAGE_KEYS.USERS, []);
    const liker = users.find(u => u.id === userId);
    
    const idx = projects.findIndex(p => p.id === projectId);
    if (idx !== -1) {
      const project = projects[idx];
      const hasLiked = project.likes.includes(userId);
      let updatedLikes = [...project.likes];
      
      if (hasLiked) {
        updatedLikes = updatedLikes.filter(id => id !== userId);
      } else {
        updatedLikes.push(userId);
        // Send notification to author with REAL NAME
        if (project.authorId !== userId) {
            const likerName = liker ? liker.name : "Seseorang";
            notificationService.create(project.authorId, `${likerName} menyukai karya Anda: "${project.title}"`, 'success');
        }
      }
      
      projects[idx] = { ...project, likes: updatedLikes };
      setStorage(STORAGE_KEYS.PROJECTS, projects);
      return projects[idx];
    }
    return null;
  },

  verify: (projectId: string, status: ProjectStatus) => {
    const projects = getStorage<Project[]>(STORAGE_KEYS.PROJECTS, []);
    const idx = projects.findIndex(p => p.id === projectId);
    if (idx !== -1) {
      projects[idx].status = status;
      setStorage(STORAGE_KEYS.PROJECTS, projects);
      
      // Notify Author
      const message = status === ProjectStatus.APPROVED 
        ? `Selamat! Karya Anda "${projects[idx].title}" telah disetujui.` 
        : `Maaf, Karya Anda "${projects[idx].title}" ditolak. Silakan perbaiki.`;
      const type = status === ProjectStatus.APPROVED ? 'success' : 'error';
      
      notificationService.create(projects[idx].authorId, message, type);
      return projects[idx];
    }
    return null;
  }
};

// --- News Services ---
export const newsService = {
  getAll: (): News[] => getStorage(STORAGE_KEYS.NEWS, []),
  create: (newsItem: Omit<News, 'id' | 'createdAt'>) => {
    const news = getStorage<News[]>(STORAGE_KEYS.NEWS, []);
    const newItem: News = {
      ...newsItem,
      id: generateId(),
      createdAt: new Date().toISOString()
    };
    news.push(newItem);
    setStorage(STORAGE_KEYS.NEWS, news);
    return newItem;
  },
  update: (id: string, data: Partial<News>) => {
    const news = getStorage<News[]>(STORAGE_KEYS.NEWS, []);
    const idx = news.findIndex(n => n.id === id);
    if (idx !== -1) {
      news[idx] = { ...news[idx], ...data };
      setStorage(STORAGE_KEYS.NEWS, news);
      return news[idx];
    }
    return null;
  },
  delete: (id: string) => {
      let news = getStorage<News[]>(STORAGE_KEYS.NEWS, []);
      news = news.filter(n => n.id !== id);
      setStorage(STORAGE_KEYS.NEWS, news);
  }
};

// --- Notification Services ---
export const notificationService = {
  getByUser: (userId: string): Notification[] => {
    const all = getStorage<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    return all.filter(n => n.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
  create: (userId: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const all = getStorage<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    const newNotif: Notification = {
      id: generateId(),
      userId,
      message,
      read: false,
      type,
      createdAt: new Date().toISOString()
    };
    all.push(newNotif);
    setStorage(STORAGE_KEYS.NOTIFICATIONS, all);
  },
  markRead: (notifId: string) => {
    const all = getStorage<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    const idx = all.findIndex(n => n.id === notifId);
    if (idx !== -1) {
      all[idx].read = true;
      setStorage(STORAGE_KEYS.NOTIFICATIONS, all);
    }
  },
  markAllAsRead: (userId: string) => {
    const all = getStorage<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    const updated = all.map(n => n.userId === userId ? { ...n, read: true } : n);
    setStorage(STORAGE_KEYS.NOTIFICATIONS, updated);
  }
};