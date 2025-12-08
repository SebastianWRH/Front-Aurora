import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

function OrdersPanel() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('Orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const { error } = await supabase
        .from('Orders')
        .update({ Status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      
      // Actualizar la lista local
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, Status: newStatus } : order
      ));
      
      alert('Estado actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      alert('Error al actualizar el estado');
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { label: 'Pendiente', class: 'status-pending' },
      confirmed: { label: 'Confirmado', class: 'status-confirmed' },
      delivered: { label: 'Entregado', class: 'status-delivered' },
      cancelled: { label: 'Cancelado', class: 'status-cancelled' }
    };
    
    const statusInfo = statusMap[status] || statusMap.pending;
    return <span className={`status-badge ${statusInfo.class}`}>{statusInfo.label}</span>;
  };

  const getPaymentMethodText = (method) => {
    const methods = {
      transfer: 'Transferencia',
      yape: 'Yape/Plin',
      cash: 'Efectivo'
    };
    return methods[method] || method;
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.Status === filter);

  if (loading) {
    return (
      <div className="panel-loading">
        <div className="spinner"></div>
        <p>Cargando pedidos...</p>
      </div>
    );
  }

  return (
    <div className="orders-panel">
      <div className="panel-header">
        <h2>Gestión de Pedidos</h2>
        <button className="refresh-btn" onClick={fetchOrders}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 4 23 10 17 10"></polyline>
            <polyline points="1 20 1 14 7 14"></polyline>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
          </svg>
          Actualizar
        </button>
      </div>

      <div className="orders-filters">
        <button 
          className={filter === 'all' ? 'active' : ''} 
          onClick={() => setFilter('all')}
        >
          Todos ({orders.length})
        </button>
        <button 
          className={filter === 'pending' ? 'active' : ''} 
          onClick={() => setFilter('pending')}
        >
          Pendientes ({orders.filter(o => o.Status === 'pending').length})
        </button>
        <button 
          className={filter === 'confirmed' ? 'active' : ''} 
          onClick={() => setFilter('confirmed')}
        >
          Confirmados ({orders.filter(o => o.Status === 'confirmed').length})
        </button>
        <button 
          className={filter === 'delivered' ? 'active' : ''} 
          onClick={() => setFilter('delivered')}
        >
          Entregados ({orders.filter(o => o.Status === 'delivered').length})
        </button>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          <h3>No hay pedidos</h3>
          <p>Los pedidos aparecerán aquí cuando los clientes realicen compras</p>
        </div>
      ) : (
        <div className="orders-table">
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Cliente</th>
                <th>Teléfono</th>
                <th>Dirección</th>
                <th>Total</th>
                <th>Método Pago</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id}>
                  <td>
                    <strong>{order.Order_code}</strong>
                  </td>
                  <td>{order.Name}</td>
                  <td>{order.Phone}</td>
                  <td className="address-cell">
                    {order.Address}, {order.District}
                  </td>
                  <td>
                    <strong>S/ {order.Cost?.toFixed(2)}</strong>
                  </td>
                  <td>{getPaymentMethodText(order.Pay_meth)}</td>
                  <td>{getStatusBadge(order.Status)}</td>
                  <td>
                    {new Date(order.created_at).toLocaleDateString('es-PE')}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-view"
                        onClick={() => setSelectedOrder(order)}
                        title="Ver detalles"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </button>
                      
                      {order.Status === 'pending' && (
                        <button 
                          className="btn-confirm"
                          onClick={() => updateOrderStatus(order.id, 'confirmed')}
                          title="Confirmar"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </button>
                      )}
                      
                      {order.Status === 'confirmed' && (
                        <button 
                          className="btn-deliver"
                          onClick={() => updateOrderStatus(order.id, 'delivered')}
                          title="Marcar entregado"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="1" y="3" width="15" height="13"></rect>
                            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                            <circle cx="5.5" cy="18.5" r="2.5"></circle>
                            <circle cx="18.5" cy="18.5" r="2.5"></circle>
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de detalles */}
      {selectedOrder && (
        <div className="order-modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="order-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Detalles del Pedido</h3>
              <button className="close-btn" onClick={() => setSelectedOrder(null)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <div className="modal-body">
              <div className="detail-section">
                <h4>Código de Pedido</h4>
                <p className="order-code">{selectedOrder.Order_code}</p>
              </div>

              <div className="detail-section">
                <h4>Información del Cliente</h4>
                <p><strong>Nombre:</strong> {selectedOrder.Name}</p>
                <p><strong>Teléfono:</strong> {selectedOrder.Phone}</p>
                <p><strong>Dirección:</strong> {selectedOrder.Address}, {selectedOrder.District}, {selectedOrder.City}</p>
                {selectedOrder.References && (
                  <p><strong>Referencias:</strong> {selectedOrder.References}</p>
                )}
              </div>

              <div className="detail-section">
                <h4>Detalles del Pago</h4>
                <p><strong>Método:</strong> {getPaymentMethodText(selectedOrder.Pay_meth)}</p>
                <p><strong>Total:</strong> S/ {selectedOrder.Cost?.toFixed(2)}</p>
                <p><strong>Estado:</strong> {getStatusBadge(selectedOrder.Status)}</p>
                
                {selectedOrder.Ticket && (
                  <div className="ticket-preview">
                    <p><strong>Comprobante de pago:</strong></p>
                    <a href={selectedOrder.Ticket} target="_blank" rel="noopener noreferrer">
                      <img src={selectedOrder.Ticket} alt="Comprobante" />
                    </a>
                  </div>
                )}
              </div>

              {selectedOrder.Notes && (
                <div className="detail-section">
                  <h4>Notas del Cliente</h4>
                  <p>{selectedOrder.Notes}</p>
                </div>
              )}

              <div className="detail-section">
                <h4>Fecha de Creación</h4>
                <p>{new Date(selectedOrder.created_at).toLocaleString('es-PE')}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrdersPanel;