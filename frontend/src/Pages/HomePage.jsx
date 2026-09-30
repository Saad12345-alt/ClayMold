import React, { useState, useEffect } from 'react'
import './homepage.css'
import ProductList from '../components/ProductList.jsx'
import NavBar from '../components/NavBar.jsx'
import { useDebounce } from '../hooks/useDebounce.js'

const HomePage = () => {
  const [searchterm, setSearchTerm] = useState('')
  const [sortorder, setSortOrder] = useState('all')
  const debouncesearchterm = useDebounce(searchterm, 200)

  useEffect(() => {
    if (!debouncesearchterm) return
  })

  return (
    <div className='body'>
      <NavBar />

      {/* ── Hero / About ── */}
      <div className='idbox' id='aboutsection'>
        <div className='AboutContainer'>
          <div className='about-text'>
            <p className='About'>Our Craft</p>
            <p className='AboutP'>
              Meticulously molded digital gear for your physical workspace.
              We believe your tools should feel as good as they perform,
              blending organic forms with high-precision engineering.
            </p>
          </div>
          <div className='about-icon'>🦾</div>
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div className='FilterBar'>
        <div className='search-wrap'>
          
          <input
            className='search-input'
            type='text'
            placeholder='Search premium hardware...'
            value={searchterm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className='filter-pill'
          value={sortorder}
          onChange={e => setSortOrder(e.target.value)}
        >
          <option value='all'>All Products</option>
          <option value='low-high'>Price: Low to High</option>
          <option value='high-low'>Price: High to Low</option>
        </select>
      </div>

      {/* ── Product grid ── */}
      <div className='productlist' id='productlist'>
        <ProductList searchterm={debouncesearchterm} sortorder={sortorder} />
      </div>
    </div>
  )
}

export default HomePage