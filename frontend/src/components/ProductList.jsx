import React from 'react'
import './ProductList.css'
import { useNavigate } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'

const ProductList = ({ searchterm, sortorder }) => {
  const navigate = useNavigate()
  const { products, loading, error } = useProducts(searchterm, sortorder)

  if (loading) return (
    <p style={{ fontFamily: 'Inter,sans-serif', color: '#6b7280', padding: '2rem', gridColumn: '1/-1' }}>
      Loading products...
    </p>
  )
  if (error) return (
    <p style={{ fontFamily: 'Inter,sans-serif', color: '#e63946', padding: '2rem', gridColumn: '1/-1' }}>
      Error: {error}
    </p>
  )

  return (
    <>
      {products.map(product => (
        <div
          key={product.id}
          className='card'
          onClick={() => navigate(`/product/${product.id}`, { state: product })}
        >
          {/* Image + badge */}
          <div className='card-image'>
            <img src={product.image} alt={product.name} />
            <span className={`stock-badge ${product.stock >= 1 ? 'in-stock' : 'sold-out'}`}>
              {product.stock >= 1 ? 'In Stock' : 'Sold Out'}
            </span>
          </div>

          {/* Info */}
          <div className='card-body'>
            <p className='name'>{product.name}</p>
            <p className='price'>${product.price}</p>
          </div>
        </div>
      ))}
    </>
  )
}

export default ProductList