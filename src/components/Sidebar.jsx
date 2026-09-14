import React from 'react';
import { LayoutDashboard, History, ClipboardCheck, Boxes, LogOut, Package } from 'lucide-react';

export default function Sidebar({ currentPage, setCurrentPage, user, onLogout }) {
  const menus = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'history',
      label: 'Riwayat',
      icon: History,
    },

    // Menu khusus Admin
    ...(user.role === 'admin'
      ? [
          {
            id: 'approval',
            label: 'Approval',
            icon: ClipboardCheck,
          },
          {
            id: 'items',
            label: 'Inventory',
            icon: Boxes,
          },
        ]
      : []),
  ];

  return (
    <aside className="sidebar">
      {/* Atas */}
      <div className="sidebar-top">
        <div className="brand">
          <Package size={24} />
          <span>PinjamApp</span>
        </div>

        <nav className="menu">
          {menus.map((menu) => {
            const Icon = menu.icon;

            return (
              <button
                key={menu.id}
                onClick={() => setCurrentPage(menu.id)}
                className={`menu-item ${currentPage === menu.id ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{menu.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="user-card">
          <div className="user-info">
            <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>

            <div className="user-text">
              <h4>{user.name}</h4>
              <p>{user.role === 'admin' ? 'Administrator' : 'Mahasiswa'}</p>
            </div>
          </div>

          <button className="logout-btn" onClick={onLogout}>
            <LogOut size={15} />
            Keluar
          </button>
        </div>
      </div>
    </aside>
  );
}
