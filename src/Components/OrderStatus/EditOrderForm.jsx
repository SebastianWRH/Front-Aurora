import { useState } from 'react';

function EditOrderForm({ order, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    Phone: String(order.Phone || ''),
    Address: order.Address || '',
    District: order.District || '',
    City: order.City || '',
    References: order.References || ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Convertir a string antes de validar
    const phoneStr = String(formData.Phone || '');

    if (!phoneStr.trim()) {
      newErrors.Phone = 'El teléfono es requerido';
    } else if (!/^\d{9}$/.test(phoneStr.trim())) {
      newErrors.Phone = 'Debe tener 9 dígitos';
    }

    if (!formData.Address.trim()) {
      newErrors.Address = 'La dirección es requerida';
    }

    if (!formData.District.trim()) {
      newErrors.District = 'El distrito es requerido';
    }

    if (!formData.City.trim()) {
      newErrors.City = 'La ciudad es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    // Convertir Phone a número antes de guardar (si tu DB lo requiere como numeric)
    const dataToSave = {
      ...formData,
      Phone: parseInt(formData.Phone, 10)
    };
    
    await onSave(dataToSave);
    setLoading(false);
  };

  return (
    <div className="os-edit-container">
      <div className="os-edit-header">
        <h2 className="os-edit-title">Modificar Datos de Envío</h2>
        <p className="os-edit-subtitle">
          Actualiza tu información de contacto y dirección de entrega
        </p>
      </div>

      <form onSubmit={handleSubmit} className="os-edit-form">
        {/* Teléfono */}
        <div className="os-form-group">
          <label htmlFor="Phone" className="os-form-label">
            Teléfono *
          </label>
          <input
            type="tel"
            id="Phone"
            name="Phone"
            value={formData.Phone}
            onChange={handleChange}
            className={`os-form-input ${errors.Phone ? 'os-input-error' : ''}`}
            placeholder="987654321"
            maxLength="9"
          />
          {errors.Phone && (
            <span className="os-error-text">{errors.Phone}</span>
          )}
        </div>

        {/* Dirección */}
        <div className="os-form-group">
          <label htmlFor="Address" className="os-form-label">
            Dirección Completa *
          </label>
          <input
            type="text"
            id="Address"
            name="Address"
            value={formData.Address}
            onChange={handleChange}
            className={`os-form-input ${errors.Address ? 'os-input-error' : ''}`}
            placeholder="Av. Principal 123, Dpto. 456"
          />
          {errors.Address && (
            <span className="os-error-text">{errors.Address}</span>
          )}
        </div>

        {/* Distrito y Ciudad */}
        <div className="os-form-row">
          <div className="os-form-group">
            <label htmlFor="District" className="os-form-label">
              Distrito *
            </label>
            <input
              type="text"
              id="District"
              name="District"
              value={formData.District}
              onChange={handleChange}
              className={`os-form-input ${errors.District ? 'os-input-error' : ''}`}
              placeholder="San Isidro"
            />
            {errors.District && (
              <span className="os-error-text">{errors.District}</span>
            )}
          </div>

          <div className="os-form-group">
            <label htmlFor="City" className="os-form-label">
              Ciudad *
            </label>
            <input
              type="text"
              id="City"
              name="City"
              value={formData.City}
              onChange={handleChange}
              className={`os-form-input ${errors.City ? 'os-input-error' : ''}`}
              placeholder="Lima"
            />
            {errors.City && (
              <span className="os-error-text">{errors.City}</span>
            )}
          </div>
        </div>

        {/* Referencias */}
        <div className="os-form-group">
          <label htmlFor="References" className="os-form-label">
            Referencias (Opcional)
          </label>
          <textarea
            id="References"
            name="References"
            value={formData.References}
            onChange={handleChange}
            className="os-form-textarea"
            placeholder="Edificio verde, al lado del parque..."
            rows="3"
          />
        </div>

        {/* Botones */}
        <div className="os-form-actions">
          <button 
            type="button" 
            onClick={onCancel} 
            className="os-cancel-btn"
            disabled={loading}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="os-save-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="os-spinner"></div>
                Guardando...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                Guardar Cambios
              </>
            )}
          </button>
        </div>
      </form>

      <div className="os-edit-note">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
        <p>Los cambios solo afectarán a la dirección de envío. El contenido del pedido no puede ser modificado.</p>
      </div>
    </div>
  );
}

export default EditOrderForm;