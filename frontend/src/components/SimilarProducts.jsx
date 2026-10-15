import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './ProductList.css'

const API = 'http://localhost:5000'

// Shows up to 4 similar products under the product page
const SimilarProducts = ({ currentId }) => {
  const navigate = useNavigate()
  const [items, setItems] = useState([])

  useEffect(() => {
    let cancelled = false
    axios
      .get(`${API}/products/${currentId}/similar`)
      .then((res) => {
        if (!cancelled) setItems(res.data)
      })
      .catch(() => {
        if (!cancelled) setItems([])
      })
    return () => {
      cancelled = true
    }
  }, [currentId])

  if (items.length === 0) return null

  return (
    <section className='similar-section'>
      <div className='similar-head'>
        <h2 className='similar-title'>Similar products</h2>
        <button className='similar-link' onClick={() => navigate('/')}>View all →</button>
      </div>

      <div className='similar-grid'>
        {items.map((p) => {
          const inStock = p.stock >= 1
          return (
            <div
              key={p.id}
              className={`card ${inStock ? '' : 'card-sold-out'}`}
              onClick={() => navigate(`/product/${p.id}`, { state: p })}
            >
              <div className='card-image'>
                <img src={p.image} alt={p.name} />
                <span className={`stock-badge ${inStock ? 'in-stock' : 'sold-out'}`}>
                  {inStock ? 'In Stock' : 'Sold Out'}
                </span>
              </div>
              <div className='card-body'>
                {p.category && <p className='card-cat'>{p.category}</p>}
                <p className='name'>{p.name}</p>
                <p className='price'>${p.price}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default SimilarProducts
