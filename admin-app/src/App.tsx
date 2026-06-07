import { Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import AdminLayout from './components/AdminLayout';
import AdminLogin from './pages/AdminLogin';
import Overview from './pages/Overview';
import Users from './pages/Users';
import Verifications from './pages/Verifications';
import Subscriptions from './pages/Subscriptions';
import ProxyConfig from './pages/ProxyConfig';
import AppSettings from './pages/AppSettings';

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
        <Route index element={<Overview />} />
        <Route path="users" element={<Users />} />
        <Route path="verifications" element={<Verifications />} />
        <Route path="subscriptions" element={<Subscriptions />} />
        <Route path="proxy" element={<ProxyConfig />} />
        <Route path="settings" element={<AppSettings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
