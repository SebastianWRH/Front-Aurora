import { useState } from 'react';

function CheckoutForm({ onFormComplete, formData, setFormData }) {
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'El nombre completo es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Correo electrónico inválido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (!/^\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Debe tener 9 dígitos';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'La dirección es requerida';
    }

    if (!formData.district.trim()) {
      newErrors.district = 'El distrito es requerido';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'La ciudad es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onFormComplete();
    }
  };

  return (
    <div className="checkout-form">
      <h2 className="form-title">Información de Envío</h2>

      <form onSubmit={handleSubmit}>
        {/* Nombre Completo */}
        <div className="form-group">
          <label htmlFor="fullName">Nombre Completo *</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={errors.fullName ? 'error' : ''}
            placeholder="Juan Pérez García"
          />
          {errors.fullName && <span className="error-message">{errors.fullName}</span>}
        </div>

        {/* Email y Teléfono */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="correo@ejemplo.com"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Teléfono *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? 'error' : ''}
              placeholder="987654321"
              maxLength="9"
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>
        </div>

        {/* Dirección */}
        <div className="form-group">
          <label htmlFor="address">Dirección Completa *</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className={errors.address ? 'error' : ''}
            placeholder="Av. Principal 123, Dpto. 456"
          />
          {errors.address && <span className="error-message">{errors.address}</span>}
        </div>

        {/* Distrito y Ciudad */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="district">Distrito *</label>
            <input
              type="text"
              id="district"
              name="district"
              value={formData.district}
              onChange={handleChange}
              className={errors.district ? 'error' : ''}
              placeholder="San Isidro"
            />
            {errors.district && <span className="error-message">{errors.district}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="city">Ciudad *</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={errors.city ? 'error' : ''}
              placeholder="Lima"
            />
            {errors.city && <span className="error-message">{errors.city}</span>}
          </div>
        </div>

        {/* Referencias */}
        <div className="form-group">
          <label htmlFor="reference">Referencias (Opcional)</label>
          <textarea
            id="reference"
            name="reference"
            value={formData.reference}
            onChange={handleChange}
            placeholder="Edificio verde, al lado del parque..."
            rows="3"
          />
        </div>

        {/* Notas adicionales */}
        <div className="form-group">
          <label htmlFor="notes">Notas del Pedido (Opcional)</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Horario preferido de entrega, instrucciones especiales..."
            rows="3"
          />
        </div>

        <button type="submit" className="form-submit-btn">
          Continuar al Pago
        </button>
      </form>
    </div>
  );
}

export default CheckoutForm;