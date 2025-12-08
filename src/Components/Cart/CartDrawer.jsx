import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
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

  const navigate = useNavigate();

  // Función para ir al checkout
  const handleCheckout = () => {
    toggleCart(); // Cerrar el carrito
    navigate('/checkout'); // Navegar al checkout
  };

  // Manejar error de imagen
  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/100x100/f5f5f5/d4af37?text=Aurora';
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="cart-overlay" onClick={toggleCart}></div>

      {/* Drawer del carrito */}
      <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
        
        {/* Header del carrito */}
        <div className="cart-header">
          <h2>Carrito de Compras</h2>
          <button className="cart-close" onClick={toggleCart}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenido del carrito */}
        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25A1.125 1.125 0 0 1 3.13 20.507l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z" />
            </svg>
            <p>Tu carrito está vacío</p>
            <span>Agrega productos para comenzar tu compra</span>
          </div>
        ) : (
          <>
            {/* Lista de productos */}
            <div className="cart-items">
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-image">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      onError={handleImageError}
                    />
                  </div>
                  
                  <div className="cart-item-details">
                    <h3>{item.name}</h3>
                    {item.category && (
                      <span className="cart-item-category">{item.category}</span>
                    )}
                    <p className="cart-item-price">S/ {parseFloat(item.price).toFixed(2)}</p>
                    
                    <div className="cart-item-quantity">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="quantity-btn"
                        disabled={item.quantity <= 1}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                        </svg>
                      </button>
                      
                      <span className="quantity-value">{item.quantity}</span>
                      
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="quantity-btn"
                        disabled={item.stock && item.quantity >= item.stock}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m7-7H5" />
                        </svg>
                      </button>
                    </div>

                    {/* Mostrar aviso de stock si aplica */}
                    {item.stock && item.quantity >= item.stock && (
                      <span className="cart-item-stock-warning">
                        Stock máximo alcanzado
                      </span>
                    )}
                  </div>

                  <button 
                    className="cart-item-remove" 
                    onClick={() => removeFromCart(item.id)}
                    title="Eliminar producto"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Footer del carrito */}
            <div className="cart-footer">
              <button 
                className="cart-clear" 
                onClick={clearCart}
                title="Vaciar todo el carrito"
              >
                Vaciar Carrito
              </button>
              
              <div className="cart-total">
                <span>Total:</span>
                <span className="cart-total-amount">S/ {getCartTotal().toFixed(2)}</span>
              </div>
              
              <button 
                className="cart-checkout"
                onClick={handleCheckout}
              >
                Proceder al Pago
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default CartDrawer;