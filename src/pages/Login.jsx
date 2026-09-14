import React, { useState } from 'react';
import { Package, User, Lock } from 'lucide-react';
import API_URL from '../services/api';

export default function Login({ onLogin }) {
  const [form, setForm] = useState({
    username: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username || !form.password) {
      alert('Isi email dan password!');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.username,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      // Simpan token & user
      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('user', JSON.stringify(data.user));

      onLogin(data.user);
    } catch (error) {
      console.error(error);
      alert('Tidak dapat terhubung ke server!');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">
            <Package size={32} />
          </div>

          <h2>Sistem Peminjaman</h2>
          <p style={{ fontSize: '13px', color: '#64748b' }}>Silakan masuk ke akun Anda</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>

            <div className="input-wrapper">
              <User className="input-icon" size={18} />

              <input
                type="email"
                required
                className="input-control"
                placeholder="admin@gmail.com"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>

            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />

              <input
                type="password"
                required
                className="input-control"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '8px' }}>
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
}

