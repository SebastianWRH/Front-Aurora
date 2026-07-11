import { useCart } from '../../context/CartContext';
import { useSettings } from '../../hooks/useSettings';
import { formatPrice, generateSelectionWhatsAppMessage, openWhatsApp } from '../../lib/whatsapp';
import '../../layouts/Cart.css';

function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    toggleCart,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    clearCart
  } = useCart();
  const { settings } = useSettings();

  const handleSendSelection = () => {
    const message = generateSelectionWhatsAppMessage(cartItems, settings.currency);
    openWhatsApp(message, settings.whatsapp_number);
  };

  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/160x160/f7f1ea/9b7b52?text=Aurora';
  };

  if (!isCartOpen) return null;

  return (
    <>
      <div className="cart-overlay" onClick={toggleCart}></div>

      <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <div>
            <span className="cart-kicker">Catalogo virtual</span>
            <h2>Mi seleccion</h2>
          </div>
          <button className="cart-close" onClick={toggleCart} aria-label="Cerrar lista">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 7.5h6m-7.5 4.5h9m-10.5 4.5h12M5.25 4.5h13.5A2.25 2.25 0 0 1 21 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 17.25V6.75A2.25 2.25 0 0 1 5.25 4.5Z" />
            </svg>
            <p>Tu lista de consulta esta vacia</p>
            <span>Agrega piezas del catalogo y envialas por WhatsApp.</span>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map(item => {
                const itemKey = item.cart_id || String(item.id);

                return (
                  <div key={itemKey} className="cart-item">
                    <div className="cart-item-image">
                      <img src={item.image} alt={item.name} onError={handleImageError} />
                    </div>

                    <div className="cart-item-details">
                      <h3>{item.name}</h3>
                      {item.category && <span className="cart-item-category">{item.category}</span>}
                      {item.variant_label && <span className="cart-item-variant">{item.variant_label}</span>}
                      {item.price !== null && item.price !== undefined && (
                        <p className="cart-item-price">{formatPrice(item.price, settings.currency)}</p>
                      )}

                      <div className="cart-item-quantity">
                        <button
                          onClick={() => updateQuantity(itemKey, item.quantity - 1)}
                          className="quantity-btn"
                          disabled={item.quantity <= 1}
                          aria-label="Reducir cantidad"
                        >
                          -
                        </button>

                        <span className="quantity-value">{item.quantity}</span>

                        <button
                          onClick={() => updateQuantity(itemKey, item.quantity + 1)}
                          className="quantity-btn"
                          aria-label="Aumentar cantidad"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      className="cart-item-remove"
                      onClick={() => removeFromCart(itemKey)}
                      title="Quitar de mi seleccion"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="cart-footer">
              <button className="cart-clear" onClick={clearCart} title="Vaciar lista">
                Vaciar lista
              </button>

              <div className="cart-total">
                <span>Total estimado:</span>
                <span className="cart-total-amount">{formatPrice(getCartTotal(), settings.currency)}</span>
              </div>

              <button className="cart-whatsapp" onClick={handleSendSelection}>
                Enviar seleccion por WhatsApp
              </button>
              <p className="cart-note">Consulta disponibilidad antes de coordinar tu compra.</p>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default CartDrawer;
