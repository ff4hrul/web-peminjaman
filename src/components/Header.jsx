import React from 'react';
import { Search, Bell } from 'lucide-react';

export default function Header({ user }) {
  return (
    <header className="topbar">
      <div>
        <h1>Dashboard</h1>
        <p>Selamat datang kembali, {user.name}</p>
      </div>

      <div className="topbar-right">
        <div className="search-input">
          <Search size={18} />
          <input type="text" placeholder="Cari inventaris..." />
        </div>

        <button className="notification-btn">
          <Bell size={18} />
        </button>

        <div className="profile-mini">
          <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
        </div>
      </div>
    </header>
  );
}
