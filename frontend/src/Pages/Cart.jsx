import React, { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './cart.css'
import NavBar from '../components/NavBar.jsx'
import { useCart } from '../context/CartContext.jsx'

const API = 'http://localhost:5000'

const formatMoney = (n) => `$${n.toFixed(2)}`

// Card input helpers (display only)
const formatCardNumber = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
const formatExpiry = (v) => {
  const d = v.replace(/\D/g, '').slice(0, 4)
  return d.length > 2 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d
}

const Cart = () => {
  const { cartItems, updateQuantity, deleteFromCart, clearCart, totalItems, totalPrice } = useCart()

  const [payment, setPayment] = useState('cash') // 'cash' | 'card'
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '' })
  const [submitting, setSubmitting] = useState(false)
  const [placedOrder, setPlacedOrder] = useState(null)

  const placeOrder = async () => {
    if (payment === 'card' && (!card.number.trim() || !card.expiry.trim() || !card.cvv.trim())) {
      toast.error('Please fill in the card details')
      return
    }

    setSubmitting(true)
    try {
      // Only the payment METHOD is sent. Card details never leave this page.
      // (For real card payments, connect a provider such as Stripe here.)
      const res = await axios.post(`${API}/orders`, {
        paymentMethod: payment,
        items: cartItems.map((i) => ({ id: i.id, quantity: i.quantity, color: i.color }))
      })
      clearCart()
      setCard({ number: '', expiry: '', cvv: '' })
      setPlacedOrder(res.data)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not place your order')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Order placed ──
  if (placedOrder) {
    return (
      <div className='cart-page'>
        <NavBar />
        <main className='cart-main'>
          <div className='cart-card cart-done'>
            <div className='done-check'>✓</div>
            <h1>Order placed</h1>
            <p>
              Total {formatMoney(placedOrder.total)} ·{' '}
              {placedOrder.paymentMethod === 'cash' ? 'Pay on delivery' : 'Paid by card'}
            </p>
            <p className='done-id'>Order ID: {placedOrder.orderId}</p>
            <Link to='/' className='cart-btn-primary done-btn'>Continue shopping</Link>
          </div>
        </main>
        <ToastContainer />
      </div>
    )
  }

  // ── Empty cart ──
  if (cartItems.length === 0) {
    return (
      <div className='cart-page'>
        <NavBar />
        <main className='cart-main'>
          <div className='cart-card cart-empty'>
            <h1>Your cart is empty</h1>
            <p>Add something you like and it will show up here.</p>
            <Link to='/' className='cart-btn-primary done-btn'>Browse products</Link>
          </div>
        </main>
        <ToastContainer />
      </div>
    )
  }

  return (
    <div className='cart-page'>
      <NavBar />

      <main className='cart-main'>
        <h1 className='cart-title'>Your Cart</h1>

        <div className='cart-layout'>
          {/* ── Items ── */}
          <section className='cart-card cart-items'>
            {cartItems.map((item) => (
              <div className='cart-item' key={item.key}>
                <img className='item-img' src={item.image} alt={item.name} />

                <div className='item-info'>
                  <p className='item-name'>{item.name}</p>
                  {item.color && <p className='item-variant'>Color: {item.color}</p>}
                  <p className='item-unit'>{formatMoney(item.price)} each</p>
                </div>

                <div className='quantity-controls'>
                  <button onClick={() => updateQuantity(item.key, -1)} aria-label='Decrease quantity'>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.key, 1)} aria-label='Increase quantity'>+</button>
                </div>

                <p className='item-total'>{formatMoney(item.price * item.quantity)}</p>

                <button className='delete-btn' onClick={() => deleteFromCart(item.key)} aria-label={`Remove ${item.name}`}>
                  <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.9' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
                    <path d='M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3' />
                  </svg>
                </button>
              </div>
            ))}

            <Link to='/' className='continue-link'>← Continue shopping</Link>
          </section>

          {/* ── Payment + summary ── */}
          <aside className='cart-side'>
            <section className='cart-card cart-box'>
              <h2>Payment Method</h2>

              <div className='pay-options' role='radiogroup' aria-label='Payment method'>
                <button
                  role='radio'
                  aria-checked={payment === 'cash'}
                  className={`pay-option ${payment === 'cash' ? 'selected' : ''}`}
                  onClick={() => setPayment('cash')}
                >
                  <span className='pay-icon cash'>
                    <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
                      <rect x='3' y='6' width='18' height='12' rx='2' /><circle cx='12' cy='12' r='2.6' />
                    </svg>
                  </span>
                  <span className='pay-text'>
                    <strong>Cash on Delivery</strong>
                    <small>Pay when your order arrives</small>
                  </span>
                  <span className='pay-radio' />
                </button>

                <button
                  role='radio'
                  aria-checked={payment === 'card'}
                  className={`pay-option ${payment === 'card' ? 'selected' : ''}`}
                  onClick={() => setPayment('card')}
                >
                  <span className='pay-icon card'>
                    <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
                      <rect x='3' y='5' width='18' height='14' rx='2.5' /><path d='M3 10h18M7 15h4' />
                    </svg>
                  </span>
                  <span className='pay-text'>
                    <strong>Credit / Debit Card</strong>
                    <small>Visa, Mastercard</small>
                  </span>
                  <span className='pay-radio' />
                </button>
              </div>

              {payment === 'card' && (
                <div className='card-fields'>
                  <label>
                    Card number
                    <input
                      type='text'
                      inputMode='numeric'
                      autoComplete='off'
                      placeholder='1234 5678 9012 3456'
                      value={card.number}
                      onChange={(e) => setCard({ ...card, number: formatCardNumber(e.target.value) })}
                    />
                  </label>
                  <div className='card-row'>
                    <label>
                      Expiry
                      <input
                        type='text'
                        inputMode='numeric'
                        autoComplete='off'
                        placeholder='MM / YY'
                        value={card.expiry}
                        onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
                      />
                    </label>
                    <label>
                      CVV
                      <input
                        type='password'
                        inputMode='numeric'
                        autoComplete='off'
                        placeholder='123'
                        value={card.cvv}
                        onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                      />
                    </label>
                  </div>
                </div>
              )}
            </section>

            <section className='cart-card cart-box'>
              <h2>Order Summary</h2>
              <div className='sum-row'><span>Subtotal ({totalItems} items)</span><span>{formatMoney(totalPrice)}</span></div>
              <div className='sum-row'><span>Shipping</span><span>Free</span></div>
              <div className='sum-total'><span>Total</span><span>{formatMoney(totalPrice)}</span></div>

              <button className='cart-btn-primary' onClick={placeOrder} disabled={submitting}>
                {submitting
                  ? 'Placing order...'
                  : payment === 'card'
                    ? `Pay ${formatMoney(totalPrice)}`
                    : 'Place Order · Pay on Delivery'}
              </button>
            </section>
          </aside>
        </div>
      </main>

      <ToastContainer />
    </div>
  )
}

export default Cart
