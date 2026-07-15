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
  getAdminCategories,
  getAdminProducts,
  getAdminSessionStatus,
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

const createEmptyVariant = () => ({
  client_id: `variant-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  id: null,
  value: '',
  color_hex: '',
  stock_quantity: '',
  stock_status: 'Disponible',
  is_active: true,
  images: [],
  remove_image_ids: []
});

const formatCurrency = (value) => {
  if (value === null || value === undefined || value === '') return 'Sin precio';
  return `S/ ${Number(value).toFixed(2)}`;
};

const getFilePreview = (file) => file ? URL.createObjectURL(file) : '';

const isValidHexColor = (value = '') => !value || /^#[0-9a-fA-F]{6}$/.test(value);

const normalizeVariantForSubmit = (variant, index) => ({
  id: variant.id || undefined,
  client_id: variant.client_id,
  name: 'Color',
  value: variant.value.trim(),
  color_hex: variant.color_hex?.trim() || null,
  stock_quantity: variant.stock_quantity === '' ? null : Number(variant.stock_quantity),
  stock_status: variant.stock_status || 'Consultar disponibilidad',
  is_active: Boolean(variant.is_active),
  sort_order: index,
  images: (variant.images || []).map((image, imageIndex) => ({
    id: image.id,
    sort_order: imageIndex,
    alt_text: image.alt_text || variant.value
  })),
  remove_image_ids: variant.remove_image_ids || []
});

const validateProductDraft = (product, variants) => {
  if (!product.name.trim()) return 'El nombre del producto es obligatorio';
  if (product.price !== '' && Number(product.price) < 0) return 'El precio no puede ser negativo';
  if (!product.category_id) return 'Selecciona una categoria';

  const names = new Set();
  for (const variant of variants) {
    const name = variant.value.trim();
    if (!name) return 'No guardes colores vacios';
    if (names.has(name.toLowerCase())) return `Color duplicado: ${name}`;
    if (!isValidHexColor(variant.color_hex)) return `Codigo hexadecimal invalido para ${name}`;
    if (variant.stock_quantity !== '' && Number(variant.stock_quantity) < 0) return `Stock invalido para ${name}`;
    names.add(name.toLowerCase());
  }

  return '';
};

const buildProductFormData = ({
  values,
  mainImageFile,
  galleryFiles,
  variants,
  variantFiles,
  removedImageIds,
  removedMainImageId,
  existingGalleryImages
}) => {
  const formData = new FormData();

  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined && value !== null) formData.append(key, value);
  });

  const removedIds = [...removedImageIds];
  if (removedMainImageId) removedIds.push(Number(removedMainImageId));

  formData.append('remove_image_ids', JSON.stringify(removedIds));
  formData.append('gallery_images_meta', JSON.stringify(existingGalleryImages.map((image, index) => ({
    id: image.id,
    sort_order: index,
    alt_text: image.alt_text || values.name
  }))));
  formData.append('variants', JSON.stringify(variants.map(normalizeVariantForSubmit)));

  if (mainImageFile) formData.append('main_image', mainImageFile);
  galleryFiles.forEach(file => formData.append('gallery_images', file));
  variants.forEach((variant) => {
    (variantFiles[variant.client_id] || []).forEach(file => {
      formData.append(`variant_images_${variant.client_id}`, file);
    });
  });

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
        const admin = await getAdminSessionStatus();
        if (isMounted && admin) {
          navigate('/admin/dashboard', { replace: true });
          return;
        }
      } catch {
        // Login must remain available even if the optional session probe fails.
      } finally {
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
  const [mainImageFile, setMainImageFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [productVariants, setProductVariants] = useState([]);
  const [variantFiles, setVariantFiles] = useState({});
  const [removedMainImageId, setRemovedMainImageId] = useState(null);
  const [expandedProductId, setExpandedProductId] = useState(null);
  const [categoryFile, setCategoryFile] = useState(null);
  const [removedImageIds, setRemovedImageIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    setActiveTab(initialView);
  }, [initialView]);

  const currentMainImage = useMemo(() => {
    if (!editingProduct?.main_image || removedMainImageId) return null;
    return editingProduct.main_image;
  }, [editingProduct, removedMainImageId]);

  const visibleGalleryImages = useMemo(() => (
    editingProduct?.gallery_images?.filter(image => !removedImageIds.includes(Number(image.id))) || []
  ), [editingProduct, removedImageIds]);

  const mainImagePreview = mainImageFile ? getFilePreview(mainImageFile) : currentMainImage?.image_url || '';
  const galleryPreviews = galleryFiles.map(file => ({ name: file.name, image_url: getFilePreview(file) }));

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
    setProductVariants((product.variants || []).map((variant, index) => ({
      client_id: `existing-${variant.id || index}`,
      id: variant.id || null,
      value: variant.value || variant.color_name || '',
      color_hex: variant.color_hex || '',
      stock_quantity: variant.stock_quantity ?? '',
      stock_status: variant.stock_status || 'Consultar disponibilidad',
      is_active: variant.is_active !== false,
      images: variant.images || [],
      remove_image_ids: []
    })));
    setRemovedImageIds([]);
    setRemovedMainImageId(null);
    setMainImageFile(null);
    setGalleryFiles([]);
    setVariantFiles({});
    setExpandedProductId(product.id);
    goToTab('products');
  };

  const resetProductForm = () => {
    setEditingProduct(null);
    setProductForm(emptyProduct);
    setMainImageFile(null);
    setGalleryFiles([]);
    setProductVariants([]);
    setVariantFiles({});
    setRemovedImageIds([]);
    setRemovedMainImageId(null);
    setExpandedProductId(null);
  };

  const moveGalleryImage = (imageId, direction) => {
    const index = visibleGalleryImages.findIndex(image => image.id === imageId);
    const nextIndex = index + direction;
    if (index < 0 || nextIndex < 0 || nextIndex >= visibleGalleryImages.length) return;

    const nextImages = [...visibleGalleryImages];
    const [item] = nextImages.splice(index, 1);
    nextImages.splice(nextIndex, 0, item);

    setEditingProduct(current => current ? {
      ...current,
      gallery_images: [
        ...nextImages,
        ...(current.gallery_images || []).filter(image => removedImageIds.includes(Number(image.id)))
      ]
    } : current);
  };

  const addVariant = () => {
    setProductVariants(current => [...current, createEmptyVariant()]);
  };

  const updateVariant = (clientId, changes) => {
    setProductVariants(current => current.map(variant => (
      variant.client_id === clientId ? { ...variant, ...changes } : variant
    )));
  };

  const removeVariant = (clientId) => {
    if (!window.confirm('Eliminar este color y sus imagenes?')) return;
    setProductVariants(current => current.filter(variant => variant.client_id !== clientId));
    setVariantFiles(current => {
      const next = { ...current };
      delete next[clientId];
      return next;
    });
  };

  const removeVariantImage = (clientId, imageId) => {
    updateVariant(clientId, {
      images: productVariants.find(variant => variant.client_id === clientId)?.images?.filter(image => image.id !== imageId) || [],
      remove_image_ids: [
        ...(productVariants.find(variant => variant.client_id === clientId)?.remove_image_ids || []),
        Number(imageId)
      ]
    });
  };

  const moveVariantImage = (clientId, imageId, direction) => {
    const variant = productVariants.find(item => item.client_id === clientId);
    if (!variant) return;
    const index = variant.images.findIndex(image => image.id === imageId);
    const nextIndex = index + direction;
    if (index < 0 || nextIndex < 0 || nextIndex >= variant.images.length) return;
    const nextImages = [...variant.images];
    const [item] = nextImages.splice(index, 1);
    nextImages.splice(nextIndex, 0, item);
    updateVariant(clientId, { images: nextImages });
  };

  const submitProduct = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    try {
      const validationError = validateProductDraft(productForm, productVariants);
      if (validationError) {
        setError(validationError);
        return;
      }

      setLoading(true);
      const formData = buildProductFormData({
        values: productForm,
        mainImageFile,
        galleryFiles,
        variants: productVariants,
        variantFiles,
        removedImageIds,
        removedMainImageId,
        existingGalleryImages: visibleGalleryImages
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

  const toggleProductActive = async (product) => {
    try {
      setLoading(true);
      await updateAdminProduct(product.id, { is_active: !product.is_active });
      await loadAdminData();
      setMessage(product.is_active ? 'Producto desactivado' : 'Producto activado');
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

                <div className="admin-form-section">
                  <h3>Informacion general</h3>
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
                    <label>Color general<input value={productForm.color} onChange={(event) => setProductForm(current => ({ ...current, color: event.target.value }))} /></label>
                    <label>Medida<input value={productForm.size} onChange={(event) => setProductForm(current => ({ ...current, size: event.target.value }))} /></label>
                    <label>Stock general
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
                </div>

                <div className="admin-form-section">
                  <h3>Imagen principal</h3>
                  <div className="admin-media-grid">
                    {mainImagePreview ? (
                      <div className="admin-image-item">
                        <img src={mainImagePreview} alt="Vista previa principal" />
                        <button type="button" onClick={() => {
                          if (currentMainImage?.id) setRemovedMainImageId(currentMainImage.id);
                          setMainImageFile(null);
                        }}>Eliminar portada</button>
                      </div>
                    ) : (
                      <div className="admin-empty-media">Sin imagen principal</div>
                    )}
                    <label className="admin-upload-box">Subir o reemplazar portada
                      <input type="file" accept="image/*" onChange={(event) => {
                        const file = event.target.files?.[0] || null;
                        setMainImageFile(file);
                        if (file && currentMainImage?.id) setRemovedMainImageId(currentMainImage.id);
                      }} />
                    </label>
                  </div>
                </div>

                <div className="admin-form-section">
                  <h3>Galeria general</h3>
                  <div className="admin-image-list">
                    {visibleGalleryImages.map((image, index) => (
                      <div className="admin-image-item" key={image.id}>
                        <img src={image.image_url} alt={image.alt_text || productForm.name} />
                        <div className="image-order-actions">
                          <button type="button" onClick={() => moveGalleryImage(image.id, -1)} disabled={index === 0}>Subir</button>
                          <button type="button" onClick={() => moveGalleryImage(image.id, 1)} disabled={index === visibleGalleryImages.length - 1}>Bajar</button>
                        </div>
                        <button type="button" onClick={() => setRemovedImageIds(current => [...current, Number(image.id)])}>Eliminar</button>
                      </div>
                    ))}
                    {galleryPreviews.map((image) => (
                      <div className="admin-image-item" key={image.image_url}>
                        <img src={image.image_url} alt={image.name} />
                        <span>Nueva imagen</span>
                      </div>
                    ))}
                  </div>
                  <label className="admin-upload-box">Agregar imagenes de galeria
                    <input type="file" accept="image/*" multiple onChange={(event) => setGalleryFiles(Array.from(event.target.files || []))} />
                  </label>
                </div>

                <div className="admin-form-section">
                  <div className="panel-header compact">
                    <h3>Colores y variantes</h3>
                    <button type="button" className="refresh-btn" onClick={addVariant}>Agregar color</button>
                  </div>

                  <div className="variant-editor-list">
                    {productVariants.map((variant) => (
                      <article className="variant-editor-card" key={variant.client_id}>
                        <div className="variant-card-header">
                          <span className="variant-swatch-preview" style={{ background: variant.color_hex || '#d7c6ad' }}></span>
                          <strong>{variant.value || 'Nuevo color'}</strong>
                          <button type="button" onClick={() => removeVariant(variant.client_id)}>Eliminar color</button>
                        </div>

                        <div className="admin-form-grid">
                          <label>Nombre del color<input value={variant.value} onChange={(event) => updateVariant(variant.client_id, { value: event.target.value })} /></label>
                          <label>Hexadecimal<input placeholder="#D4AF37" value={variant.color_hex} onChange={(event) => updateVariant(variant.client_id, { color_hex: event.target.value })} /></label>
                          <label>Stock por color<input type="number" min="0" value={variant.stock_quantity} onChange={(event) => updateVariant(variant.client_id, { stock_quantity: event.target.value })} /></label>
                          <label>Estado
                            <select value={variant.stock_status} onChange={(event) => updateVariant(variant.client_id, { stock_status: event.target.value })}>
                              <option>Disponible</option>
                              <option>Agotado</option>
                              <option>Consultar disponibilidad</option>
                            </select>
                          </label>
                        </div>

                        <div className="admin-checks">
                          <label><input type="checkbox" checked={variant.is_active} onChange={(event) => updateVariant(variant.client_id, { is_active: event.target.checked })} /> Disponible en catalogo</label>
                        </div>

                        <div className="admin-image-list compact-images">
                          {(variant.images || []).map((image, index) => (
                            <div className="admin-image-item" key={image.id}>
                              <img src={image.image_url} alt={image.alt_text || variant.value} />
                              <div className="image-order-actions">
                                <button type="button" onClick={() => moveVariantImage(variant.client_id, image.id, -1)} disabled={index === 0}>Subir</button>
                                <button type="button" onClick={() => moveVariantImage(variant.client_id, image.id, 1)} disabled={index === variant.images.length - 1}>Bajar</button>
                              </div>
                              <button type="button" onClick={() => removeVariantImage(variant.client_id, image.id)}>Eliminar</button>
                            </div>
                          ))}
                          {(variantFiles[variant.client_id] || []).map(file => (
                            <div className="admin-image-item" key={`${variant.client_id}-${file.name}`}>
                              <img src={getFilePreview(file)} alt={file.name} />
                              <span>Nueva imagen</span>
                            </div>
                          ))}
                        </div>

                        <label className="admin-upload-box">Agregar imagenes de este color
                          <input type="file" accept="image/*" multiple onChange={(event) => setVariantFiles(current => ({
                            ...current,
                            [variant.client_id]: Array.from(event.target.files || [])
                          }))} />
                        </label>
                      </article>
                    ))}
                    {!productVariants.length && <p className="admin-muted">Este producto no tiene colores definidos.</p>}
                  </div>
                </div>

                <div className="admin-form-section">
                  <h3>Vista previa del producto</h3>
                  <div className="admin-product-preview">
                    {mainImagePreview && <img src={mainImagePreview} alt="Vista previa" />}
                    <div>
                      <span>{categories.find(category => String(category.id) === String(productForm.category_id))?.name || 'Categoria'}</span>
                      <strong>{productForm.name || 'Nombre del producto'}</strong>
                      <p>{formatCurrency(productForm.price)}</p>
                      <div className="variant-chip-row">
                        {productVariants.map(variant => (
                          <span key={variant.client_id} className="variant-chip">
                            <i style={{ background: variant.color_hex || '#d7c6ad' }}></i>{variant.value || 'Color'}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <button className="login-btn admin-submit" type="submit" disabled={loading}>
                  {loading ? 'Guardando...' : editingProduct ? 'Guardar producto' : 'Crear producto'}
                </button>
              </form>

              <div className="admin-products-list">
                {products.map(product => (
                  <article className="admin-product-row" key={product.id}>
                    <div className="admin-product-main">
                      <div className="admin-product-cover">
                        {product.image_url && <img src={product.image_url} alt={product.name} />}
                      </div>
                      <div>
                        <span className="product-category">{product.category}</span>
                        <h3>{product.name}</h3>
                        <p>{product.description || 'Sin descripcion'}</p>
                        <div className="admin-product-meta">
                          <span>{formatCurrency(product.price)}</span>
                          <span>{product.stock_status}</span>
                          <span>{product.is_active ? 'Activo' : 'Inactivo'}</span>
                          <span>{product.updated_at ? new Date(product.updated_at).toLocaleDateString('es-PE') : 'Sin fecha'}</span>
                        </div>
                      </div>
                    </div>

                    {expandedProductId === product.id && (
                      <div className="admin-product-details">
                        <div>
                          <h4>Galeria general</h4>
                          <div className="mini-image-row">
                            {(product.gallery_images || []).map(image => <img key={image.id} src={image.image_url} alt={image.alt_text || product.name} />)}
                            {!product.gallery_images?.length && <span>Sin galeria</span>}
                          </div>
                        </div>
                        <div>
                          <h4>Colores</h4>
                          <div className="admin-variant-summary">
                            {(product.variants || []).map(variant => (
                              <div className="variant-summary-card" key={variant.id}>
                                <div><i style={{ background: variant.color_hex || '#d7c6ad' }}></i><strong>{variant.value}</strong></div>
                                <span>{variant.stock_status}{variant.stock_quantity !== null ? ` · Stock ${variant.stock_quantity}` : ''}</span>
                                <div className="mini-image-row">
                                  {(variant.images || []).map(image => <img key={image.id} src={image.image_url} alt={image.alt_text || variant.value} />)}
                                  {!variant.images?.length && <small>Sin imagenes propias</small>}
                                </div>
                              </div>
                            ))}
                            {!product.variants?.length && <span>Sin colores</span>}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="admin-actions">
                      <button type="button" onClick={() => setExpandedProductId(current => current === product.id ? null : product.id)}>
                        {expandedProductId === product.id ? 'Ocultar' : 'Ver detalles'}
                      </button>
                      <button type="button" onClick={() => startEditProduct(product)}>Editar</button>
                      <button type="button" onClick={() => toggleProductActive(product)}>
                        {product.is_active ? 'Desactivar' : 'Activar'}
                      </button>
                      <button type="button" onClick={() => removeProduct(product)}>Eliminar</button>
                    </div>
                  </article>
                ))}
                {!products.length && <div className="empty-state"><h3>Sin productos</h3><p>Crea el primer producto del catalogo.</p></div>}
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
