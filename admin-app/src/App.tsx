import { Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import AdminLayout from './components/AdminLayout';
import AdminLogin from './pages/AdminLogin';
import Subscriptions from './pages/Subscriptions';
import Users from './pages/Users';
import AppControl from './pages/AppControl';

export default function App() {
  const [isAdmin, setIsAdmin] = useState(!!localStorage.getItem('agesmart_admin'));

  const handleLogin = (password: string): boolean => {
    if (password === 'admin123') {
      localStorage.setItem('agesmart_admin', 'true');
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    localStorage.removeItem('agesmart_admin');
    setIsAdmin(false);
  };

  if (!isAdmin) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <Routes>
      <Route path="/" element={<AdminLayout onLogout={handleLogout} />}>
        <Route index element={<Subscriptions />} />
        <Route path="users" element={<Users />} />
        <Route path="app-control" element={<AppControl />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
