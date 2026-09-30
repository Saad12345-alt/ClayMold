import React, { useState, useEffect } from 'react';
import './cart.css';
import NavBar from '../components/NavBar.jsx';
import { useCart } from '../context/CartContext.jsx';

const Cart = () => {
  const { cartItems, deleteFromCart } = useCart();
  const [totalprice, setTotalPrice] = useState(0);

  useEffect(() => {
    const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotalPrice(total);
  }, [cartItems]);

  const decreaseQuantity = (item) => {
    if (item.quantity === 1) {
      deleteFromCart(item.id);
    } else {
      item.quantity -= 1;
      setTotalPrice((prev) => prev - item.price);
    }
  };

  const increaseQuantity = (item) => {
    item.quantity += 1;
    setTotalPrice((prev) => prev + item.price);
  };

  return (
    <div>
      <NavBar />
      <div className="cart-container">
        {cartItems.length === 0 ? (
          <p className="empty-msg">Your Cart is empty</p>
        ) : (
          <>
            
            <div className="cart-header">
              <span>Name</span>
              <span>Quantity</span>
              <span>Price</span>
            </div>

            
            {cartItems.map((item, index) => (
              <div className="cart-item" key={index}>
                <span className="item-name">{item.name}</span>
                <div className="quantity-controls">
                  <button onClick={() => decreaseQuantity(item)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQuantity(item)}>+</button>
                </div>
                <div className="item-price">
                  <span>{item.price * item.quantity} $</span>
                  <button onClick={() => deleteFromCart(item.id)} className="delete-btn">
                    Delete
                  </button>
                </div>
              </div>
            ))}

            
            <div className="cart-total">
              <p>Total: {totalprice} $</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
