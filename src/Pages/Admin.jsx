import { useState, useEffect } from 'react';
import AdminLogin from '../Components/Admin/AdminLogin';
import AdminSidebar from '../Components/Admin/AdminSidebar';
import StatsCards from '../Components/Admin/StatsCards';
import OrdersPanel from '../Components/Admin/OrdersPanel';
import ProductsPanel from '../Components/Admin/ProductsPanel';
import '../styles/Admin.css';

function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [activePanel, setActivePanel] = useState('dashboard');

  useEffect(() => {
    // Verificar si hay una sesión guardada
    const savedKey = localStorage.getItem('adminKey');
    if (savedKey) {
      verifyKey(savedKey);
    }
  }, []);

  const verifyKey = async (key) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      
      const response = await fetch(`${API_URL}/api/admin/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ secretKey: key })
      });

      const data = await response.json();

      if (data.success) {
        setIsAuthenticated(true);
        setAdminKey(key);
      } else {
        localStorage.removeItem('adminKey');
      }
    } catch (error) {
      console.error('Error al verificar clave:', error);
      localStorage.removeItem('adminKey');
    }
  };

  const handleLogin = (key) => {
    setIsAuthenticated(true);
    setAdminKey(key);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminKey');
    setIsAuthenticated(false);
    setAdminKey('');
    setActivePanel('dashboard');
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="admin-dashboard">
      <AdminSidebar 
        activePanel={activePanel} 
        setActivePanel={setActivePanel}
        onLogout={handleLogout}
      />

      <main className="admin-content">
        <div className="content-header">
          <h1>
            {activePanel === 'dashboard' && '📊 Dashboard'}
            {activePanel === 'orders' && '📦 Gestión de Pedidos'}
            {activePanel === 'products' && '💎 Gestión de Productos'}
          </h1>
          <div className="header-info">
            <span className="current-date">
              {new Date().toLocaleDateString('es-PE', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </div>

        <div className="content-body">
          {activePanel === 'dashboard' && (
            <>
              <StatsCards />
              <div className="dashboard-panels">
                <div className="panel-quick">
                  <h3>Últimos Pedidos</h3>
                  <OrdersPanel />
                </div>
              </div>
            </>
          )}

          {activePanel === 'orders' && <OrdersPanel />}
          {activePanel === 'products' && <ProductsPanel />}
        </div>
      </main>
    </div>
  );
}

export default Admin;