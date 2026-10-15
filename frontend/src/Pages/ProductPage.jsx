import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import './productpage.css'
import NavBar from '../components/NavBar.jsx'
import SimilarProducts from '../components/SimilarProducts.jsx'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useCart } from '../context/CartContext.jsx'

const API = 'http://localhost:5000'
const TABS = ['Overview', 'Specs', 'Shipping']

const BagIcon = () => (
  <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.9' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
    <path d='M6 8h12l1.2 12H4.8L6 8z' />
    <path d='M9 8V7a3 3 0 0 1 6 0v1' />
  </svg>
)

const HeartIcon = ({ filled }) => (
  <svg width='22' height='22' viewBox='0 0 24 24' fill={filled ? '#d92d3f' : 'none'} stroke={filled ? '#d92d3f' : 'currentColor'} strokeWidth='1.9' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
    <path d='M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z' />
  </svg>
)

const TruckIcon = () => (
  <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='#3d5fa8' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
    <path d='M3 7h11v9H3zM14 10h4l3 3v3h-7' /><circle cx='7' cy='17' r='1.6' /><circle cx='17' cy='17' r='1.6' />
  </svg>
)
const ReturnIcon = () => (
  <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='#3d5fa8' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
    <path d='M4 12a8 8 0 1 0 3-6.2M4 4v4h4' />
  </svg>
)
const ShieldIcon = () => (
  <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='#3d5fa8' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
    <path d='M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z' /><path d='M9 12l2 2 4-4' />
  </svg>
)

const ProductPage = () => {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const [product, setProduct] = useState(null)
  const [error, setError] = useState(null)
  const [colorIndex, setColorIndex] = useState(0)
  const [qty, setQty] = useState(1)
  const [tab, setTab] = useState(0)
  const [liked, setLiked] = useState(false)

  // Runs on first load AND every time the id changes (clicking a similar product)
  useEffect(() => {
    window.scrollTo(0, 0)
    setColorIndex(0)
    setQty(1)
    setTab(0)
    setLiked(false)
    setError(null)

    const fromRoute = location.state
    if (fromRoute && String(fromRoute.id) === String(id)) {
      setProduct(fromRoute)
      return
    }

    setProduct(null)
    let cancelled = false
    axios
      .get(`${API}/products/${id}`)
      .then((res) => {
        if (!cancelled) setProduct(res.data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.status === 404 ? 'Product not found' : err.message)
      })
    return () => {
      cancelled = true
    }
  }, [id, location.state])

  if (error) return <p className='pp-message'>{error}</p>
  if (!product) return <p className='pp-message'>Loading...</p>

  const colors = product.colors || []
  const selectedColor = colors[colorIndex] || null
  const mainImage = selectedColor?.image || product.image
  const inStock = product.stock >= 1
  const hasColorImages = colors.some((c) => c.image)

  const handleAddToCart = () => {
    addToCart(product, qty, selectedColor)
    toast.success('Added to cart', {
      position: 'top-center',
      autoClose: 1200,
      theme: 'colored',
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true
    })
  }

  return (
    <div className='pp-wrapper'>
      <NavBar />

      <main className='pp-main'>
        <button className='breadcrumb' onClick={() => navigate('/')}>&#8249; Back to products</button>

        <div className='pp-grid'>
          {/* ── Image card ── */}
          <section className='pp-card pp-gallery'>
            <div className='pp-img'>
              <img src={mainImage} alt={`${product.name}${selectedColor ? ` in ${selectedColor.name}` : ''}`} />
            </div>

            {/* Thumbnails only appear when colours have their own photo */}
            {hasColorImages && (
              <div className='pp-thumbs'>
                {colors.map((c, i) => (
                  <button
                    key={c.name}
                    className={`pp-thumb ${i === colorIndex ? 'active' : ''}`}
                    onClick={() => setColorIndex(i)}
                    aria-label={`View ${c.name}`}
                  >
                    <img src={c.image || product.image} alt='' />
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* ── Details card ── */}
          <section className='pp-card pp-info'>
            <div>
              <p className='pp-sku'>ID: {product.id}{product.category ? ` · ${product.category.toUpperCase()}` : ''}</p>
              <h1 className='pp-name'>{product.name}</h1>
            </div>

            <div className='pp-stock'>
              <span className={`stock-dot ${inStock ? '' : 'out'}`}></span>
              <span>{inStock ? `In Stock · Ready to ship in 24h` : 'Out of Stock'}</span>
            </div>

            <div className='pp-price'>${product.price}</div>

            {product.description && <p className='pp-desc'>{product.description}</p>}

            {colors.length > 0 && (
              <div>
                <p className='pp-label'>Color: <span>{selectedColor?.name}</span></p>
                <div className='pp-swatches' role='group' aria-label='Choose color'>
                  {colors.map((c, i) => (
                    <button
                      key={c.name}
                      className={`pp-swatch ${i === colorIndex ? 'active' : ''}`}
                      onClick={() => setColorIndex(i)}
                      aria-label={c.name}
                      aria-pressed={i === colorIndex}
                    >
                      <span style={{ background: c.hex }} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className='pp-actions'>
              <div className='pp-qty'>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} aria-label='Decrease quantity'>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock || 1, q + 1))} aria-label='Increase quantity'>+</button>
              </div>

              <button className='add-to-cart-btn' onClick={handleAddToCart} disabled={!inStock}>
                <BagIcon /> {inStock ? 'Add to Cart' : 'Sold Out'}
              </button>

              <button className='pp-heart' onClick={() => setLiked(l => !l)} aria-label='Save to wishlist' aria-pressed={liked}>
                <HeartIcon filled={liked} />
              </button>
            </div>

            <div className='trust-row'>
              <div className='trust-item'><TruckIcon /><span>Ships in 24h</span></div>
              <div className='trust-item'><ReturnIcon /><span>Easy returns</span></div>
              <div className='trust-item'><ShieldIcon /><span>Secure checkout</span></div>
            </div>
          </section>
        </div>

        {/* ── Tabs ── */}
        <section className='pp-card pp-tabs'>
          <div className='pp-tab-list' role='tablist'>
            {TABS.map((t, i) => (
              <button
                key={t}
                role='tab'
                aria-selected={tab === i}
                className={`pp-tab ${tab === i ? 'active' : ''}`}
                onClick={() => setTab(i)}
              >
                {t}
              </button>
            ))}
          </div>

          <div className='pp-tab-body'>
            {tab === 0 && (
              <p>{product.description || 'No description has been added for this product yet.'}</p>
            )}
            {tab === 1 && (
              <dl className='pp-specs'>
                <dt>Category</dt><dd>{product.category || '-'}</dd>
                <dt>Product ID</dt><dd>{product.id}</dd>
                <dt>Colors</dt><dd>{colors.length > 0 ? colors.map(c => c.name).join(', ') : '-'}</dd>
                <dt>In stock</dt><dd>{product.stock} units</dd>
              </dl>
            )}
            {tab === 2 && (
              <p>Ready to ship in 24 hours. Pay by card, or choose cash on delivery at checkout.</p>
            )}
          </div>
        </section>

        {/* ── Similar products ── */}
        <SimilarProducts currentId={product.id} />
      </main>

      <ToastContainer />
    </div>
  )
}

export default ProductPage
