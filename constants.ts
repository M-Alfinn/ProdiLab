// This string represents the SQL schema requested by the user.
// It is displayed in the Admin Dashboard.

export const MYSQL_SCHEMA = `
-- Database Schema for ProdiLab

CREATE DATABASE IF NOT EXISTS prodilab;
USE prodilab;

-- Table: Users
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    role ENUM('MAHASISWA', 'DOSEN') NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    
    -- Fields for Mahasiswa
    nim VARCHAR(20) UNIQUE,
    angkatan VARCHAR(4),
    kelas VARCHAR(10),
    
    -- Fields for Dosen
    nip VARCHAR(20) UNIQUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: Projects (Karya)
CREATE TABLE projects (
    id VARCHAR(36) PRIMARY KEY,
    author_id VARCHAR(36) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category ENUM('Riset', 'Startup', 'Produk', 'Skripsi', 'Lainnya') NOT NULL,
    year VARCHAR(4),
    link_or_file TEXT,
    document_name VARCHAR(255),
    status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table: Likes (Many-to-Many relationship)
CREATE TABLE project_likes (
    user_id VARCHAR(36) NOT NULL,
    project_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, project_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Table: News (Berita)
CREATE TABLE news (
    id VARCHAR(36) PRIMARY KEY,
    author_id VARCHAR(36) NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    web_url TEXT,
    document_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table: Notifications
CREATE TABLE notifications (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    type ENUM('info', 'success', 'warning', 'error') DEFAULT 'info',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
`;

export const DUMMY_NEWS_IMAGE = "https://picsum.photos/800/400";
export const DUMMY_PROFILE_IMAGE = "https://picsum.photos/200/200";