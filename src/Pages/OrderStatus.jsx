import { useState } from 'react';
import { getOrderByCode, sendVerificationCode, verifyCode, updateOrderData } from '../lib/orderService';
import OrderSearch from '../Components/OrderStatus/OrderSearch';
import OrderDetails from '../Components/OrderStatus/OrderDetails';
import VerificationModal from '../Components/OrderStatus/VerificationModal';
import EditOrderForm from '../Components/OrderStatus/EditOrderForm';
import '../styles/OrderStatus.css';

function OrderStatus() {
  const [currentView, setCurrentView] = useState('search');
  const [order, setOrder] = useState(null);
  const [showVerification, setShowVerification] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Buscar orden
  const handleSearch = async (orderCode) => {
    setError('');
    setSuccessMessage('');
    
    const result = await getOrderByCode(orderCode);
    
    if (result.success) {
      console.log('Orden encontrada:', result.data);
      setOrder(result.data);
      setCurrentView('details');
      setIsVerified(false);
    } else {
      setError('Orden no encontrada. Verifica el código e intenta nuevamente.');
    }
  };

  // Solicitar edición (mostrar modal de verificación)
  const handleRequestEdit = async () => {
    setError('');
    
    // ✅ Obtener email (MAYÚSCULA según tu DB)
    const email = order.Email;
    
    console.log('Email encontrado:', email); // ✅ CORREGIDO
    console.log('Order code:', order.Order_code);
    
    if (!email) {
      setError('No se encontró el email asociado a esta orden');
      return;
    }
    
    const result = await sendVerificationCode(order.Order_code, email);
    
    if (result.success) {
      setShowVerification(true);
    } else {
      setError(result.error || 'Error al enviar código de verificación');
    }
  };

  // Verificar código
  const handleVerify = async (code) => {
    const email = order.Email;
    const result = await verifyCode(order.Order_code, email, code);
    
    if (result.success) {
      setShowVerification(false);
      setIsVerified(true);
      setCurrentView('edit');
      return { success: true };
    } else {
      return { 
        success: false, 
        error: result.error || 'Código inválido o expirado' 
      };
    }
  };

  // Reenviar código
  const handleResendCode = async () => {
    const email = order.Email;
    await sendVerificationCode(order.Order_code, email);
  };

  // Guardar cambios
  const handleSaveChanges = async (updates) => {
    setError('');
    
    const result = await updateOrderData(order.Order_code, updates);
    
    if (result.success) {
      setOrder(result.data);
      setSuccessMessage('Datos actualizados correctamente');
      setCurrentView('details');
      setIsVerified(false);
      
      setTimeout(() => setSuccessMessage(''), 5000);
    } else {
      setError(result.error || 'Error al actualizar los datos');
    }
  };

  // Volver a la búsqueda
  const handleBack = () => {
    setCurrentView('search');
    setOrder(null);
    setIsVerified(false);
    setError('');
    setSuccessMessage('');
  };

  // Cancelar edición
  const handleCancelEdit = () => {
    setCurrentView('details');
    setIsVerified(false);
  };

  return (
    <div className="os-page">
      <div className="os-container">
        
        {/* Mensajes de Error/Éxito */}
        {error && (
          <div className="os-alert os-alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <p>{error}</p>
            <button onClick={() => setError('')} className="os-alert-close">×</button>
          </div>
        )}

        {successMessage && (
          <div className="os-alert os-alert-success">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <p>{successMessage}</p>
            <button onClick={() => setSuccessMessage('')} className="os-alert-close">×</button>
          </div>
        )}

        {/* Contenido según vista */}
        {currentView === 'search' && (
          <OrderSearch onSearch={handleSearch} />
        )}

        {currentView === 'details' && order && (
          <OrderDetails 
            order={order}
            onRequestEdit={handleRequestEdit}
            onBack={handleBack}
          />
        )}

        {currentView === 'edit' && order && isVerified && (
          <EditOrderForm
            order={order}
            onSave={handleSaveChanges}
            onCancel={handleCancelEdit}
          />
        )}

        {/* Modal de Verificación */}
        {showVerification && order && (
          <VerificationModal
            email={order.Email}
            onVerify={handleVerify}
            onClose={() => setShowVerification(false)}
            onResend={handleResendCode}
          />
        )}

      </div>
    </div>
  );
}

export default OrderStatus;