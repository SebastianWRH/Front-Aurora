import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

function OrderConfirmation({ orderData, onClose }) {
  const navigate = useNavigate();
  const { clearCart } = useCart();

  const handleWhatsApp = () => {
    const { formData, paymentMethod, cartItems, total, orderCode } = orderData;
    
    let message = `🛍️ *NUEVO PEDIDO - AURORA JOYERÍA*\n\n`;
    message += `📋 *Código de Orden:* ${orderCode}\n\n`;
    message += `*Información del Cliente:*\n`;
    message += `Nombre: ${formData.fullName}\n`;
    message += `Email: ${formData.email}\n`;
    message += `Teléfono: ${formData.phone}\n`;
    message += `Dirección: ${formData.address}, ${formData.district}, ${formData.city}\n`;
    
    if (formData.reference) {
      message += `Referencias: ${formData.reference}\n`;
    }
    
    message += `\n🛒 *Productos:*\n`;
    cartItems.forEach(item => {
      message += `• ${item.name} - Cantidad: ${item.quantity} - S/ ${(item.price * item.quantity).toFixed(2)}\n`;
    });
    
    message += `\n💰 *Total: S/ ${total.toFixed(2)}*\n\n`;
    
    message += `💳 *Método de Pago:* `;
    if (paymentMethod === 'transfer') {
      message += `Transferencia Bancaria\n`;
    } else if (paymentMethod === 'yape') {
      message += `Yape/Plin\n`;
    } else {
      message += `Pago contra entrega (Efectivo)`;
    }
    
    if (formData.notes) {
      message += `\n\n📝 *Notas:* ${formData.notes}`;
    }

    const phoneNumber = '942346985'; // Reemplaza con tu número
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
  };

  const handleFinish = () => {
    clearCart();
    navigate('/');
    onClose();
  };

  return (
    <div className="order-confirmation-overlay">
      <div className="order-confirmation-modal">
        <div className="confirmation-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>

        <h2>¡Pedido Confirmado!</h2>
        <p className="confirmation-message">
          Tu pedido ha sido registrado exitosamente en nuestro sistema.
          {orderData.paymentMethod !== 'cash' && ' Tu comprobante de pago ha sido recibido.'}
          <br /><br />
          📧 Hemos enviado un correo de confirmación a <strong>{orderData.formData.email}</strong>
        </p>

        <div className="order-details">
          <div className="detail-row">
            <span>Código de Pedido:</span>
            <strong>{orderData.orderCode}</strong>
          </div>
          <div className="detail-row">
            <span>Total:</span>
            <strong>S/ {orderData.total.toFixed(2)}</strong>
          </div>
          <div className="detail-row">
            <span>Método de Pago:</span>
            <strong>
              {orderData.paymentMethod === 'transfer' ? 'Transferencia Bancaria' : 
               orderData.paymentMethod === 'yape' ? 'Yape/Plin' : 
               'Pago contra entrega'}
            </strong>
          </div>
        </div>

        <div className="confirmation-actions">
          <button className="whatsapp-btn" onClick={handleWhatsApp}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Contactar por WhatsApp
          </button>
          <button className="finish-btn" onClick={handleFinish}>
            Volver al Inicio
          </button>
        </div>

        <div className="confirmation-note">
          <p>📧 Revisa tu correo para más detalles del pedido</p>
          <p>💬 Te contactaremos por WhatsApp para coordinar la entrega</p>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;