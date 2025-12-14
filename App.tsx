import React, { useState, useEffect } from 'react';
import { User, Project, News, Notification, ToastMessage } from './types';
import { initDB, authService, projectService, newsService, notificationService } from './services/db';

// Component Imports
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Alert } from './components/Alert';

// Page Imports
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Gallery } from './pages/Gallery';
import { NewsPage } from './pages/News';
import { Profile } from './pages/Profile';

// Initialize Simulated DB
initDB();

const App = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<'landing' | 'login' | 'register' | 'dashboard' | 'gallery' | 'news' | 'profile'>('landing');
  const [alert, setAlert] = useState<{message: string, type: 'success'|'error'|'info'} | null>(null);
  
  // Data State
  const [projects, setProjects] = useState<Project[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const refreshData = () => {
    setProjects(projectService.getAll());
    setNews(newsService.getAll());
    if (currentUser) {
      setNotifications(notificationService.getByUser(currentUser.id));
    }
  };

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      // Logic: If user was just refreshed/loaded and is logged in, show dashboard instead of landing
      if(view === 'landing') setView('dashboard');
    }
    refreshData();
  }, []);

  useEffect(() => {
    refreshData();
  }, [currentUser, view]);

  const addAlert = (message: string, type: 'success' | 'error' | 'info') => {
    setAlert({ message, type });
    // Auto dismiss after 3s
    setTimeout(() => setAlert(null), 3000);
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setView('landing');
    addAlert("Berhasil Logout", "info");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans text-gray-900">
      <Navbar 
        currentUser={currentUser} 
        view={view} 
        setView={setView} 
        handleLogout={handleLogout}
        notifications={notifications}
        onNotificationRead={refreshData}
      />
      
      {alert && (
        <Alert 
          message={alert.message} 
          type={alert.type} 
          onClose={() => setAlert(null)} 
        />
      )}
      
      <main className="flex-grow animate-fade-in">
        {view === 'landing' && <Landing currentUser={currentUser} setView={setView} />}
        {view === 'login' && <Login setCurrentUser={setCurrentUser} setView={setView} addToast={addAlert} />}
        {view === 'register' && <Register setView={setView} addToast={addAlert} />}
        {view === 'gallery' && <Gallery projects={projects} currentUser={currentUser} refreshData={refreshData} addToast={addAlert} />}
        {view === 'news' && <NewsPage news={news} />}
        {view === 'profile' && currentUser && <Profile currentUser={currentUser} setCurrentUser={setCurrentUser} addToast={addAlert} />}
        {view === 'dashboard' && currentUser && (
          <Dashboard 
            currentUser={currentUser} 
            projects={projects} 
            news={news} 
            refreshData={refreshData} 
            addToast={addAlert} 
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default App;