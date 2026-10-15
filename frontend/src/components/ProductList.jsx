import React from 'react'
import './ProductList.css'
import { useNavigate } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'

const ProductList = ({ searchterm, sortorder, category }) => {
  const navigate = useNavigate()
  const { products, loading, error } = useProducts(searchterm, sortorder, category)

  if (loading) return <p className='list-message'>Loading products...</p>
  if (error) return <p className='list-message error'>Error: {error}</p>
  if (products.length === 0) return <p className='list-message'>No products found.</p>

  return (
    <>
      {products.map(product => {
        const inStock = product.stock >= 1
        const colors = product.colors || []

        return (
          <div
            key={product.id}
            className={`card ${inStock ? '' : 'card-sold-out'}`}
            onClick={() => navigate(`/product/${product.id}`, { state: product })}
          >
            {/* Image + badge */}
            <div className='card-image'>
              <img src={product.image} alt={product.name} />
              <span className={`stock-badge ${inStock ? 'in-stock' : 'sold-out'}`}>
                {inStock ? 'In Stock' : 'Sold Out'}
              </span>
            </div>

            {/* Info */}
            <div className='card-body'>
              {product.category && <p className='card-cat'>{product.category}</p>}
              <p className='name'>{product.name}</p>
              <div className='card-bottom'>
                <p className='price'>${product.price}</p>
                {colors.length > 0 && (
                  <div className='color-dots' aria-label='Available colors'>
                    {colors.map(c => (
                      <span key={c.name} className='color-dot' style={{ background: c.hex }} title={c.name} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </>
  )
}

export default ProductList
