import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import '../styles/Admin.css';
import {
  adminLogin,
  adminLogout,
  createAdminCategory,
  createAdminProduct,
  deleteAdminCategory,
  deleteAdminProduct,
  deleteAdminProductImage,
  getAdminCategories,
  getAdminProducts,
  getAdminSettings,
  getCurrentAdmin,
  updateAdminCategory,
  updateAdminProduct,
  updateAdminSettings
} from '../lib/catalogApi';

const emptyProduct = {
  name: '',
  slug: '',
  category_id: '',
  description: '',
  price: '',
  material: '',
  color: '',
  size: '',
  stock_status: 'Consultar disponibilidad',
  whatsapp_message: '',
  featured: false,
  is_active: true
};

const emptyCategory = {
  name: '',
  slug: '',
  description: '',
  is_active: true
};

const emptySettings = {
  store_name: '',
  whatsapp_number: '',
  instagram_url: '',
  default_whatsapp_message: '',
  currency: 'S/'
};

const toFormData = (values, files = [], extra = {}) => {
  const formData = new FormData();

  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined && value !== null) formData.append(key, value);
  });

  Object.entries(extra).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, typeof value === 'string' ? value : JSON.stringify(value));
    }
  });

  files.forEach(file => formData.append('images', file));
  return formData;
};

const LoadingPanel = () => (
  <main className="admin-login-container">
    <div className="panel-loading">
      <div className="spinner"></div>
      <p>Validando sesion...</p>
    </div>
  </main>
);

export const AdminProtectedRoute = ({ children }) => {
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let isMounted = true;

    const validateSession = async () => {
      try {
        await getCurrentAdmin();
        if (isMounted) setStatus('authenticated');
      } catch {
        if (isMounted) setStatus('anonymous');
      }
    };

    validateSession();

    return () => {
      isMounted = false;
    };
  }, []);

  if (status === 'loading') return <LoadingPanel />;
  if (status === 'anonymous') return <Navigate to="/admin/login" replace />;

  return children;
};

export const AdminLogin = () => {
  const navigate = useNavigate();
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const redirectIfAuthenticated = async () => {
      try {
        await getCurrentAdmin();
        if (isMounted) navigate('/admin/dashboard', { replace: true });
      } catch {
        if (isMounted) setCheckingSession(false);
      }
    };

    redirectIfAuthenticated();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');

    try {
      setLoading(true);
      await adminLogin(loginForm.email, loginForm.password);
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) return <LoadingPanel />;

  return (
    <main className="admin-login-container">
      <section className="admin-login-box">
        <div className="login-header">
          <h1>Aurora</h1>
          <p>Panel administrativo</p>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          {error && <div className="login-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="admin-email">Correo</label>
            <input
              id="admin-email"
              type="email"
              value={loginForm.email}
              onChange={(event) => setLoginForm(current => ({ ...current, email: event.target.value }))}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="admin-password">Contrasena</label>
            <input
              id="admin-password"
              type={showPassword ? 'text' : 'password'}
              value={loginForm.password}
              onChange={(event) => setLoginForm(current => ({ ...current, password: event.target.value }))}
              autoComplete="current-password"
              required
            />
          </div>

          <label className="password-toggle">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={(event) => setShowPassword(event.target.checked)}
            />
            Mostrar contrasena
          </label>

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? 'Iniciando sesion...' : 'Iniciar sesion'}
          </button>
        </form>
      </section>
    </main>
  );
};

const Admin = ({ initialView = 'dashboard' }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(initialView);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [settingsForm, setSettingsForm] = useState(emptySettings);
  const [productForm, setProductForm] = useState(emptyProduct);
  const [categoryForm, setCategoryForm] = useState(emptyCategory);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [productFiles, setProductFiles] = useState([]);
  const [categoryFile, setCategoryFile] = useState(null);
  const [removedImageIds, setRemovedImageIds] = useState([]);
  const [primaryImageId, setPrimaryImageId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    setActiveTab(initialView);
  }, [initialView]);

  const visibleImages = useMemo(() => (
    editingProduct?.images?.filter(image => !removedImageIds.includes(Number(image.id))) || []
  ), [editingProduct, removedImageIds]);

  const loadAdminData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const [nextProducts, nextCategories, nextSettings] = await Promise.all([
        getAdminProducts(),
        getAdminCategories(),
        getAdminSettings()
      ]);
      setProducts(nextProducts);
      setCategories(nextCategories);
      if (nextSettings) setSettingsForm({ ...emptySettings, ...nextSettings });
    } catch (err) {
      setError(err.message);
      if (err.message.toLowerCase().includes('sesion') || err.message.toLowerCase().includes('autenticacion')) {
        navigate('/admin/login', { replace: true });
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  const goToTab = (tab) => {
    const paths = {
      dashboard: '/admin/dashboard',
      products: '/admin/productos',
      categories: '/admin/categorias',
      settings: '/admin/configuracion'
    };
    navigate(paths[tab]);
  };

  const handleLogout = async () => {
    try {
      await adminLogout();
    } finally {
      navigate('/admin/login', { replace: true });
    }
  };

  const startEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name || '',
      slug: product.slug || '',
      category_id: product.category_id || '',
      description: product.description || '',
      price: product.price ?? '',
      material: product.material || '',
      color: product.color || '',
      size: product.size || '',
      stock_status: product.stock_status || 'Consultar disponibilidad',
      whatsapp_message: product.whatsapp_message || '',
      featured: Boolean(product.featured),
      is_active: Boolean(product.is_active)
    });
    setRemovedImageIds([]);
    setPrimaryImageId(product.images?.find(image => image.is_primary)?.id || product.images?.[0]?.id || '');
    setProductFiles([]);
    goToTab('products');
  };

  const resetProductForm = () => {
    setEditingProduct(null);
    setProductForm(emptyProduct);
    setProductFiles([]);
    setRemovedImageIds([]);
    setPrimaryImageId('');
  };

  const submitProduct = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    try {
      setLoading(true);
      const orderedImages = visibleImages.map((image, index) => ({
        id: image.id,
        sort_order: index,
        alt_text: image.alt_text || productForm.name,
        is_primary: String(image.id) === String(primaryImageId)
      }));
      const formData = toFormData(productForm, productFiles, {
        remove_image_ids: removedImageIds,
        primary_image_id: primaryImageId,
        images: orderedImages
      });

      if (editingProduct) {
        await updateAdminProduct(editingProduct.id, formData);
        setMessage('Producto actualizado');
      } else {
        await createAdminProduct(formData);
        setMessage('Producto creado');
      }

      resetProductForm();
      await loadAdminData();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (product) => {
    if (!window.confirm(`Eliminar ${product.name}?`)) return;

    try {
      setLoading(true);
      await deleteAdminProduct(product.id);
      await loadAdminData();
      setMessage('Producto eliminado');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeProductImage = async (image) => {
    if (!editingProduct) return;
    if (!window.confirm('Eliminar esta imagen?')) return;

    try {
      setLoading(true);
      await deleteAdminProductImage(editingProduct.id, image.id);
      const updatedProduct = {
        ...editingProduct,
        images: editingProduct.images.filter(item => item.id !== image.id)
      };
      setEditingProduct(updatedProduct);
      setPrimaryImageId(updatedProduct.images?.[0]?.id || '');
      await loadAdminData();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name || '',
      slug: category.slug || '',
      description: category.description || '',
      is_active: Boolean(category.is_active)
    });
    setCategoryFile(null);
    goToTab('categories');
  };

  const resetCategoryForm = () => {
    setEditingCategory(null);
    setCategoryForm(emptyCategory);
    setCategoryFile(null);
  };

  const submitCategory = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    try {
      setLoading(true);
      const formData = new FormData();
      Object.entries(categoryForm).forEach(([key, value]) => formData.append(key, value));
      if (categoryFile) formData.append('image', categoryFile);

      if (editingCategory) {
        await updateAdminCategory(editingCategory.id, formData);
        setMessage('Categoria actualizada');
      } else {
        await createAdminCategory(formData);
        setMessage('Categoria creada');
      }

      resetCategoryForm();
      await loadAdminData();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeCategory = async (category) => {
    if (!window.confirm(`Eliminar ${category.name}?`)) return;

    try {
      setLoading(true);
      await deleteAdminCategory(category.id);
      await loadAdminData();
      setMessage('Categoria eliminada');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitSettings = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    try {
      setLoading(true);
      const nextSettings = await updateAdminSettings(settingsForm);
      setSettingsForm({ ...emptySettings, ...nextSettings });
      setMessage('Configuracion actualizada');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Aurora</h2>
          <p>Catalogo</p>
        </div>

        <nav className="sidebar-nav">
          <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => goToTab('dashboard')}>
            Dashboard
          </button>
          <button className={`nav-item ${activeTab === 'products' ? 'active' : ''}`} onClick={() => goToTab('products')}>
            Productos
          </button>
          <button className={`nav-item ${activeTab === 'categories' ? 'active' : ''}`} onClick={() => goToTab('categories')}>
            Categorias
          </button>
          <button className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => goToTab('settings')}>
            Configuracion
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>Cerrar sesion</button>
        </div>
      </aside>

      <section className="admin-content">
        <header className="content-header">
          <h1>
            {activeTab === 'dashboard' && 'Dashboard'}
            {activeTab === 'products' && 'Productos'}
            {activeTab === 'categories' && 'Categorias'}
            {activeTab === 'settings' && 'Configuracion'}
          </h1>
          <div className="header-info">
            <Link className="refresh-btn" to="/">Ver catalogo</Link>
            <button className="refresh-btn" onClick={loadAdminData} disabled={loading}>Actualizar</button>
          </div>
        </header>

        <div className="content-body">
          {error && <div className="login-error">{error}</div>}
          {message && <div className="admin-success">{message}</div>}

          <div className="stats-cards">
            <div className="stat-card">
              <div className="stat-info">
                <h3>Productos</h3>
                <p className="stat-value">{products.length}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-info">
                <h3>Categorias</h3>
                <p className="stat-value">{categories.length}</p>
              </div>
            </div>
          </div>

          {activeTab === 'dashboard' && (
            <section className="admin-panel">
              <div className="admin-shortcuts">
                <button type="button" onClick={() => goToTab('products')}>Productos</button>
                <button type="button" onClick={() => goToTab('categories')}>Categorias</button>
                <button type="button" onClick={() => goToTab('settings')}>Configuracion del catalogo</button>
                <button type="button" onClick={handleLogout}>Cerrar sesion</button>
              </div>
            </section>
          )}

          {activeTab === 'products' && (
            <section className="admin-panel">
              <form className="admin-form" onSubmit={submitProduct}>
                <div className="panel-header">
                  <h2>{editingProduct ? 'Editar producto' : 'Nuevo producto'}</h2>
                  {editingProduct && <button type="button" className="refresh-btn" onClick={resetProductForm}>Nuevo</button>}
                </div>

                <div className="admin-form-grid">
                  <label>Nombre<input value={productForm.name} onChange={(event) => setProductForm(current => ({ ...current, name: event.target.value }))} required /></label>
                  <label>Slug<input value={productForm.slug} onChange={(event) => setProductForm(current => ({ ...current, slug: event.target.value }))} /></label>
                  <label>Categoria
                    <select value={productForm.category_id} onChange={(event) => setProductForm(current => ({ ...current, category_id: event.target.value }))} required>
                      <option value="">Selecciona</option>
                      {categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}
                    </select>
                  </label>
                  <label>Precio<input type="number" min="0" step="0.01" value={productForm.price} onChange={(event) => setProductForm(current => ({ ...current, price: event.target.value }))} /></label>
                  <label>Material<input value={productForm.material} onChange={(event) => setProductForm(current => ({ ...current, material: event.target.value }))} /></label>
                  <label>Color<input value={productForm.color} onChange={(event) => setProductForm(current => ({ ...current, color: event.target.value }))} /></label>
                  <label>Medida<input value={productForm.size} onChange={(event) => setProductForm(current => ({ ...current, size: event.target.value }))} /></label>
                  <label>Estado
                    <select value={productForm.stock_status} onChange={(event) => setProductForm(current => ({ ...current, stock_status: event.target.value }))}>
                      <option>Disponible</option>
                      <option>Agotado</option>
                      <option>Consultar disponibilidad</option>
                    </select>
                  </label>
                </div>

                <label className="admin-form-wide">Descripcion
                  <textarea value={productForm.description} onChange={(event) => setProductForm(current => ({ ...current, description: event.target.value }))} />
                </label>
                <label className="admin-form-wide">Mensaje WhatsApp
                  <textarea value={productForm.whatsapp_message} onChange={(event) => setProductForm(current => ({ ...current, whatsapp_message: event.target.value }))} />
                </label>

                <div className="admin-checks">
                  <label><input type="checkbox" checked={productForm.featured} onChange={(event) => setProductForm(current => ({ ...current, featured: event.target.checked }))} /> Destacado</label>
                  <label><input type="checkbox" checked={productForm.is_active} onChange={(event) => setProductForm(current => ({ ...current, is_active: event.target.checked }))} /> Activo</label>
                </div>

                {editingProduct && visibleImages.length > 0 && (
                  <div className="admin-image-list">
                    {visibleImages.map(image => (
                      <div className="admin-image-item" key={image.id}>
                        <img src={image.image_url} alt={image.alt_text || editingProduct.name} />
                        <label><input type="radio" checked={String(primaryImageId) === String(image.id)} onChange={() => setPrimaryImageId(image.id)} /> Principal</label>
                        <button type="button" onClick={() => setRemovedImageIds(current => [...current, Number(image.id)])}>Quitar del guardado</button>
                        <button type="button" onClick={() => removeProductImage(image)}>Eliminar ahora</button>
                      </div>
                    ))}
                  </div>
                )}

                <label className="admin-form-wide">Imagenes
                  <input type="file" accept="image/*" multiple onChange={(event) => setProductFiles(Array.from(event.target.files || []))} />
                </label>

                <button className="login-btn admin-submit" type="submit" disabled={loading}>
                  {editingProduct ? 'Guardar producto' : 'Crear producto'}
                </button>
              </form>

              <div className="products-grid admin-products-grid">
                {products.map(product => (
                  <article className="product-card" key={product.id}>
                    <div className="product-image">
                      {product.image_url && <img src={product.image_url} alt={product.name} />}
                      {product.featured && <span className="featured-badge">Destacado</span>}
                    </div>
                    <div className="product-info">
                      <span className="product-category">{product.category}</span>
                      <h3>{product.name}</h3>
                      <p className="product-description">{product.stock_status}</p>
                      <div className="admin-actions">
                        <button type="button" onClick={() => startEditProduct(product)}>Editar</button>
                        <button type="button" onClick={() => removeProduct(product)}>Eliminar</button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'categories' && (
            <section className="admin-panel">
              <form className="admin-form" onSubmit={submitCategory}>
                <div className="panel-header">
                  <h2>{editingCategory ? 'Editar categoria' : 'Nueva categoria'}</h2>
                  {editingCategory && <button type="button" className="refresh-btn" onClick={resetCategoryForm}>Nueva</button>}
                </div>

                <div className="admin-form-grid">
                  <label>Nombre<input value={categoryForm.name} onChange={(event) => setCategoryForm(current => ({ ...current, name: event.target.value }))} required /></label>
                  <label>Slug<input value={categoryForm.slug} onChange={(event) => setCategoryForm(current => ({ ...current, slug: event.target.value }))} /></label>
                </div>
                <label className="admin-form-wide">Descripcion
                  <textarea value={categoryForm.description} onChange={(event) => setCategoryForm(current => ({ ...current, description: event.target.value }))} />
                </label>
                <div className="admin-checks">
                  <label><input type="checkbox" checked={categoryForm.is_active} onChange={(event) => setCategoryForm(current => ({ ...current, is_active: event.target.checked }))} /> Activa</label>
                </div>
                <label className="admin-form-wide">Imagen
                  <input type="file" accept="image/*" onChange={(event) => setCategoryFile(event.target.files?.[0] || null)} />
                </label>
                <button className="login-btn admin-submit" type="submit" disabled={loading}>
                  {editingCategory ? 'Guardar categoria' : 'Crear categoria'}
                </button>
              </form>

              <div className="orders-table admin-table">
                <table>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Slug</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map(category => (
                      <tr key={category.id}>
                        <td>{category.name}</td>
                        <td>{category.slug}</td>
                        <td>{category.is_active ? 'Activa' : 'Inactiva'}</td>
                        <td>
                          <div className="action-buttons">
                            <button type="button" className="btn-view" onClick={() => startEditCategory(category)}>Editar</button>
                            <button type="button" className="btn-confirm" onClick={() => removeCategory(category)}>Eliminar</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeTab === 'settings' && (
            <section className="admin-panel">
              <form className="admin-form" onSubmit={submitSettings}>
                <div className="panel-header">
                  <h2>Configuracion del catalogo</h2>
                </div>

                <div className="admin-form-grid">
                  <label>Tienda<input value={settingsForm.store_name} onChange={(event) => setSettingsForm(current => ({ ...current, store_name: event.target.value }))} required /></label>
                  <label>WhatsApp<input value={settingsForm.whatsapp_number} onChange={(event) => setSettingsForm(current => ({ ...current, whatsapp_number: event.target.value }))} required /></label>
                  <label>Instagram<input value={settingsForm.instagram_url || ''} onChange={(event) => setSettingsForm(current => ({ ...current, instagram_url: event.target.value }))} /></label>
                  <label>Moneda<input value={settingsForm.currency || 'S/'} onChange={(event) => setSettingsForm(current => ({ ...current, currency: event.target.value }))} /></label>
                </div>

                <label className="admin-form-wide">Mensaje predeterminado
                  <textarea value={settingsForm.default_whatsapp_message || ''} onChange={(event) => setSettingsForm(current => ({ ...current, default_whatsapp_message: event.target.value }))} />
                </label>

                <button className="login-btn admin-submit" type="submit" disabled={loading}>
                  Guardar configuracion
                </button>
              </form>
            </section>
          )}
        </div>
      </section>
    </main>
  );
};

export default Admin;
