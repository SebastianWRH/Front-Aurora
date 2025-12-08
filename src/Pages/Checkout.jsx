import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { createOrder } from '../lib/supabaseClient';
import CheckoutForm from '../Components/Checkout/CheckoutForm';
import PaymentMethods from '../Components/Checkout/PaymentMethods';
import CheckoutSummary from '../Components/Checkout/CheckoutSummary';
import OrderConfirmation from '../Components/Checkout/OrderConfirmation';
import '../styles/Checkout.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function CheckoutPage() {
  const { cartItems, getCartTotal } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    district: '',
    city: '',
    reference: '',
    notes: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('');
  const [ticketUrl, setTicketUrl] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [orderError, setOrderError] = useState('');

  const handleFormComplete = () => {
    setCurrentStep(2);
  };

  const handlePaymentSelect = (method) => {
    setPaymentMethod(method);
  };

  const handleTicketUpload = (url) => {
    setTicketUrl(url);
  };

  const calculateTotal = () => {
    const subtotal = getCartTotal();
    const shipping = subtotal > 200 ? 0 : 15;
    return subtotal + shipping;
  };

  // ✅ FUNCIÓN PARA ENVIAR EMAIL DE CONFIRMACIÓN
  const sendOrderConfirmationEmail = async (orderPayload) => {
    try {
      const response = await fetch(`${API_URL}/api/send-order-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData: orderPayload.formData,
          cartItems: orderPayload.cartItems,
          total: orderPayload.total,
          orderCode: orderPayload.orderCode,
          paymentMethod: orderPayload.paymentMethod
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al enviar el email');
      }

      console.log('✅ Email de confirmación enviado:', result);
      return { success: true, data: result };
    } catch (error) {
      console.error('❌ Error al enviar email de confirmación:', error);
      return { success: false, error: error.message };
    }
  };

  const handlePlaceOrder = async () => {
    // Validar método de pago seleccionado
    if (!paymentMethod) {
      setOrderError('Por favor selecciona un método de pago');
      return;
    }

    // Validar comprobante para transfer y yape
    if ((paymentMethod === 'transfer' || paymentMethod === 'yape') && !ticketUrl) {
      setOrderError('Por favor sube tu comprobante de pago');
      return;
    }

    setOrderError('');
    setIsCreatingOrder(true);

    try {
      // Preparar datos de la orden
      const orderPayload = {
        formData,
        paymentMethod,
        cartItems,
        ticket: ticketUrl || null
      };

      // 1. Crear orden en Supabase
      console.log('📝 Creando orden en Supabase...');
      const result = await createOrder(orderPayload);

      if (result.success) {
        console.log('✅ Orden creada exitosamente:', result.orderCode);

        // 2. Enviar email de confirmación
        console.log('📧 Enviando email de confirmación...');
        const emailResult = await sendOrderConfirmationEmail({
          ...orderPayload,
          total: calculateTotal(),
          orderCode: result.orderCode
        });

        if (emailResult.success) {
          console.log('✅ Email enviado exitosamente');
        } else {
          console.warn('⚠️ Orden creada pero email no enviado:', emailResult.error);
          // No bloqueamos la confirmación si falla el email
        }

        // 3. Mostrar confirmación
        setOrderData({
          formData,
          paymentMethod,
          cartItems,
          total: calculateTotal(),
          orderCode: result.orderCode,
          orderId: result.order.id
        });
        
        setShowConfirmation(true);
      } else {
        setOrderError(result.error || 'Error al crear la orden. Intenta nuevamente.');
      }
    } catch (error) {
      console.error('❌ Error al procesar la orden:', error);
      setOrderError('Error al procesar la orden. Por favor intenta nuevamente.');
    } finally {
      setIsCreatingOrder(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout-empty">
        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        <h2>Tu carrito está vacío</h2>
        <p>Agrega productos para realizar tu compra</p>
        <a href="/" className="btn-primary">Ir a la tienda</a>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      {/* Progress Steps */}
      <div className="checkout-progress">
        <div className={`progress-step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
          <div className="progress-circle">1</div>
          <span>Información de Envío</span>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>
          <div className="progress-circle">2</div>
          <span>Método de Pago</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="checkout-container">
        <div className="checkout-main">
          {currentStep === 1 && (
            <CheckoutForm
              onFormComplete={handleFormComplete}
              formData={formData}
              setFormData={setFormData}
            />
          )}

          {currentStep === 2 && (
            <>
              <PaymentMethods
                onMethodSelect={handlePaymentSelect}
                selectedMethod={paymentMethod}
                onTicketUpload={handleTicketUpload}
              />

              {orderError && (
                <div className="order-error">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                  </svg>
                  {orderError}
                </div>
              )}

              <div className="checkout-actions">
                <button 
                  className="btn-back" 
                  onClick={() => setCurrentStep(1)}
                  disabled={isCreatingOrder}
                >
                  Volver
                </button>
                <button 
                  className="btn-place-order" 
                  onClick={handlePlaceOrder}
                  disabled={!paymentMethod || isCreatingOrder}
                >
                  {isCreatingOrder ? (
                    <>
                      <div className="btn-spinner"></div>
                      Procesando...
                    </>
                  ) : (
                    'Confirmar Pedido'
                  )}
                </button>
              </div>
            </>
          )}
        </div>

        <div className="checkout-sidebar">
          <CheckoutSummary />
        </div>
      </div>

      {/* Order Confirmation Modal */}
      {showConfirmation && orderData && (
        <OrderConfirmation
          orderData={orderData}
          onClose={() => setShowConfirmation(false)}
        />
      )}
    </div>
  );
}

export default CheckoutPage;