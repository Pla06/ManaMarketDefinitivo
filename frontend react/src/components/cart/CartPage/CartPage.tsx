import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartLine, cartStateService } from '../../../services/cartStateService';
import { cardService } from '../../../services/cardService';
import Swal from 'sweetalert2';
import './CartPage.css';

export const CartPage: React.FC = () => {
  const [items, setItems] = useState<CartLine[]>(cartStateService.getItems());
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setItems(cartStateService.getItems());
    const unsubscribe = cartStateService.subscribe(() => {
      setItems(cartStateService.getItems());
    });
    return unsubscribe;
  }, []);

  const updateQuantity = (cardId: string, quantity: number) => {
    if (!Number.isFinite(quantity) || quantity < 1) return;
    cartStateService.updateQuantity(cardId, quantity);
  };

  const remove = (cardId: string) => {
    cartStateService.removeCard(cardId);
  };

  const clear = async () => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Se eliminarán todas las cartas del carrito',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, vaciar carrito',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      cartStateService.clear();
      await Swal.fire({
        icon: 'success',
        title: '¡Carrito vaciado!',
        text: 'Se han eliminado todas las cartas del carrito',
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  const checkout = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    
    if (items.length === 0) {
      await Swal.fire({
        icon: 'warning',
        title: 'Carrito vacío',
        text: 'No hay cartas en el carrito para procesar',
        confirmButtonText: 'Entendido'
      });
      setIsProcessing(false);
      return;
    }

    try {
      const updates = items.map(item => {
        const nextStock = Math.max(item.card.stock - item.quantity, 0);
        return cardService.updateCard({
          ...item.card,
          stock: nextStock
        });
      });

      await Promise.all(updates);

      await Swal.fire({
        icon: 'success',
        title: '¡Compra completada!',
        text: 'Tu pedido ha sido procesado exitosamente',
        confirmButtonText: 'Continuar'
      });
      cartStateService.clear();
    } catch (error) {
      console.error('Error al actualizar stock:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar el stock. Inténtalo de nuevo.',
        confirmButtonText: 'Entendido'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const total = items.reduce((sum, item) => sum + item.card.price * item.quantity, 0);

  return (
    <div className="container-fluid py-4 cart-container">
      <div className="row">
        <div className="col-12">
          <h2 className="display-5 mb-4 fw-bold text-white">Mi Carrito</h2>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="empty-state text-center py-5">
          <div className="mb-3" style={{ fontSize: '3rem' }}>🛒</div>
          <h3>Tu carrito está vacío</h3>
          <p className="text-light">Añade cartas a tu carrito para comprar</p>
          <Link to="/card/list" className="btn btn-primary">
            Ver catálogo
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="cart-items-section">
              {items.map(item => (
                <div key={item.card._id} className="cart-item">
                  <img src={item.card.imageUrl} alt={item.card.name} className="cart-item-image" />
                  <div className="cart-item-details">
                    <h5>{item.card.name}</h5>
                    <p className="text-light">{item.card.collection} • {item.card.condition}</p>
                    <p className="fw-bold">{item.card.price.toFixed(2)}€</p>
                  </div>
                  <div className="cart-item-quantity">
                    <label>Cantidad:</label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.card._id, Number(e.target.value))}
                      className="form-control"
                    />
                  </div>
                  <div className="cart-item-total">
                    <p className="fw-bold">{(item.card.price * item.quantity).toFixed(2)}€</p>
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => remove(item.card._id)}
                  >
                    ✕ Eliminar
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="col-lg-4">
            <div className="cart-summary">
              <h4 className="mb-3">Resumen del pedido</h4>
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>{total.toFixed(2)}€</span>
              </div>
              <div className="summary-row">
                <span>Artículos:</span>
                <span>{items.length}</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row total-row">
                <span>Total:</span>
                <span>{total.toFixed(2)}€</span>
              </div>
              <button
                className="btn btn-success btn-lg w-100 mt-3"
                onClick={checkout}
                disabled={isProcessing}
              >
                {isProcessing ? 'Procesando...' : 'Proceder al pago'}
              </button>
              <Link to="/card/list" className="btn btn-outline-secondary btn-lg w-100 mt-2">
                Seguir comprando
              </Link>
              <button
                className="btn btn-outline-danger btn-lg w-100 mt-2"
                onClick={clear}
              >
                Vaciar carrito
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
