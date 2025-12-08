function OrderDetails({ order, onRequestEdit, onBack }) {
  const getStatusInfo = (status) => {
    const statusMap = {
      pending: { text: 'Pendiente', color: '#ffc107', icon: '⏳' },
      confirmed: { text: 'Confirmado', color: '#2196f3', icon: '✓' },
      delivered: { text: 'Entregado', color: '#4caf50', icon: '📦' },
      cancelled: { text: 'Cancelado', color: '#f44336', icon: '✗' }
    };
    return statusMap[status] || statusMap.pending;
  };

  const statusInfo = getStatusInfo(order.Status);

  return (
    <div className="os-details-container">
      {/* Header */}
      <div className="os-details-header">
        <button onClick={onBack} className="os-back-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Volver
        </button>
        <h2 className="os-details-title">Detalles de la Orden</h2>
      </div>

      {/* Order Code */}
      <div className="os-order-code-box">
        <span className="os-order-label">Código de Orden</span>
        <h1 className="os-order-code">{order.Order_code}</h1>
      </div>

      {/* Status Timeline */}
      <div className="os-status-section">
        <h3 className="os-section-title">Estado del Pedido</h3>
        <div 
          className="os-status-badge"
          style={{ 
            background: `${statusInfo.color}15`,
            borderColor: statusInfo.color,
            color: statusInfo.color
          }}
        >
          <span className="os-status-icon">{statusInfo.icon}</span>
          <span className="os-status-text">{statusInfo.text}</span>
        </div>

        <div className="os-timeline">
          <div className={`os-timeline-item ${['pending', 'confirmed', 'delivered'].includes(order.Status) ? 'active' : ''}`}>
            <div className="os-timeline-dot"></div>
            <div className="os-timeline-content">
              <h4>Pedido Recibido</h4>
              <p>Tu pedido ha sido registrado</p>
            </div>
          </div>
          <div className={`os-timeline-item ${['confirmed', 'delivered'].includes(order.Status) ? 'active' : ''}`}>
            <div className="os-timeline-dot"></div>
            <div className="os-timeline-content">
              <h4>Confirmado</h4>
              <p>Pago verificado</p>
            </div>
          </div>
          <div className={`os-timeline-item ${order.Status === 'delivered' ? 'active' : ''}`}>
            <div className="os-timeline-dot"></div>
            <div className="os-timeline-content">
              <h4>Entregado</h4>
              <p>Pedido completado</p>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Info */}
      <div className="os-info-section">
        <h3 className="os-section-title">Información del Cliente</h3>
        <div className="os-info-grid">
          <div className="os-info-item">
            <span className="os-info-label">Nombre</span>
            <span className="os-info-value">{order.Name || order.name}</span>
          </div>
          <div className="os-info-item">
            <span className="os-info-label">Teléfono</span>
            <span className="os-info-value">{order.Phone || order.phone}</span>
          </div>
          <div className="os-info-item">
            <span className="os-info-label">Email</span>
            <span className="os-info-value">{order.Email || order.email}</span>
          </div>
        </div>
      </div>

      {/* Delivery Info */}
      <div className="os-info-section">
        <h3 className="os-section-title">Dirección de Envío</h3>
        <div className="os-address-box">
          <p>{order.Address}</p>
          <p>{order.District}, {order.City}</p>
          {order.References && (
            <p className="os-references">Referencias: {order.References}</p>
          )}
        </div>
      </div>

      {/* Payment Info */}
      <div className="os-info-section">
        <h3 className="os-section-title">Información de Pago</h3>
        <div className="os-info-grid">
          <div className="os-info-item">
            <span className="os-info-label">Método de Pago</span>
            <span className="os-info-value">
              {order.Pay_meth === 'transfer' ? 'Transferencia Bancaria' :
               order.Pay_meth === 'yape' ? 'Yape/Plin' :
               'Pago contra entrega'}
            </span>
          </div>
          <div className="os-info-item">
            <span className="os-info-label">Total</span>
            <span className="os-info-value os-total">S/ {parseFloat(order.Cost).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {order.Notes && (
        <div className="os-info-section">
          <h3 className="os-section-title">Notas Adicionales</h3>
          <p className="os-notes">{order.Notes}</p>
        </div>
      )}

      {/* Edit Button */}
      <div className="os-actions">
        <button onClick={onRequestEdit} className="os-edit-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
          Modificar Datos de Envío
        </button>
      </div>
    </div>
  );
}

export default OrderDetails;