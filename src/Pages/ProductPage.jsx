import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import './productpage.css'
import NavBar from '../components/NavBar.jsx'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useCart } from '../context/CartContext.jsx'

const ProductPage = () => {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const productlocation = location.state
  const [product, setProduct] = useState(productlocation || null)
  const { addToCart } = useCart()

  useEffect(() => {
    if (!productlocation) {
      const fetchproduct = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/products/${id}`)
          setProduct(res.data)
        } catch (err) {
          console.error(err)
        }
      }
      fetchproduct()
    }
  }, [id, productlocation])

  const handleAddToCart = () => {
    addToCart(product)
    setTimeout(() => {
      toast.success('✅ Added to Cart!', {
        position: 'top-center',
        autoClose: 1000,
        theme: 'colored',
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
      })
    }, 250)
  }

  if (!product) return <p style={{ fontFamily: 'Inter,sans-serif', padding: '2rem' }}>Loading...</p>

  const inStock = product.stock >= 1

  return (
    <div className='product-page-wrapper'>
      <NavBar />

      {/* Breadcrumb */}
      <p className='breadcrumb' onClick={() => navigate('/')}>&#8250; Back to products</p>

      {/* Large image card */}
      <div className='product-img-card'>
        <img src={product.image} alt={product.name} />
      </div>

      {/* Detail card */}
      <div className='productcard'>
        <p className='product-sku'>ID: {product.id}</p>
        <h1 className='product-name-heading'>{product.name}</h1>

        <div className='product-stock-row'>
          <span className={`stock-dot ${inStock ? '' : 'out'}`}></span>
          <span>{inStock ? 'In Stock · Ready to ship in 24h' : 'Out of Stock'}</span>
        </div>

        <div className='product-price-row'>
          <span className='product-price-main'>${product.price}</span>
        </div>

        <button
          className='add-to-cart-btn'
          onClick={handleAddToCart}
          disabled={!inStock}
        >
          🛒 Add to Cart
        </button>

        {/* Trust badges */}
        <div className='trust-row'>
          <div className='trust-item'>
            <span className='trust-icon'>🚚</span>
            <span>Free Shipping</span>
          </div>
          <div className='trust-item'>
            <span className='trust-icon'>🛡️</span>
            <span>2 Year Warranty</span>
          </div>
          <div className='trust-item'>
            <span className='trust-icon'>↩️</span>
            <span>30 Day Return</span>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  )
}

export default ProductPage