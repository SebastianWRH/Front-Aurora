import { useCart } from '../../context/CartContext';

function CheckoutSummary() {
  const { cartItems, getCartTotal } = useCart();

  const subtotal = getCartTotal();
  const shipping = subtotal > 200 ? 0 : 15; // Envío gratis sobre S/200
  const total = subtotal + shipping;

  return (
    <div className="checkout-summary">
      <h2 className="summary-title">Resumen del Pedido</h2>

      {/* Lista de productos */}
      <div className="summary-products">
        {cartItems.map(item => (
          <div key={item.id} className="summary-product-item">
            <div className="summary-product-image">
              <img src={item.image} alt={item.name} />
              <span className="summary-product-qty">{item.quantity}</span>
            </div>
            <div className="summary-product-info">
              <h4>{item.name}</h4>
              <p>S/ {parseFloat(item.price).toFixed(2)}</p>
            </div>
            <div className="summary-product-total">
              <p>S/ {(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Totales */}
      <div className="summary-totals">
        <div className="summary-row">
          <span>Subtotal</span>
          <span>S/ {subtotal.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Envío</span>
          <span>{shipping === 0 ? 'Gratis' : `S/ ${shipping.toFixed(2)}`}</span>
        </div>
        {shipping === 0 && (
          <div className="summary-note">
            ¡Envío gratis por compra mayor a S/200!
          </div>
        )}
        <div className="summary-row summary-total">
          <span>Total a Pagar</span>
          <span>S/ {total.toFixed(2)}</span>
        </div>
      </div>

      {/* Información adicional */}
      <div className="summary-info">
        <div className="info-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
          <span>Compra 100% segura</span>
        </div>
        <div className="info-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span>Entrega en 24-48 horas</span>
        </div>
      </div>
    </div>
  );
}

export default CheckoutSummary;