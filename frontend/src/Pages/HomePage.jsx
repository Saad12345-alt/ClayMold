import React, { useState } from 'react'
import { HashLink } from 'react-router-hash-link'
import './homepage.css'
import ProductList from '../components/ProductList.jsx'
import NavBar from '../components/NavBar.jsx'
import { useDebounce } from '../hooks/useDebounce.js'

const CATEGORIES = ['All', 'Keyboards', 'Mice', 'Audio', 'Displays', 'Accessories']

const HomePage = () => {
  const [searchterm, setSearchTerm] = useState('')
  const [sortorder, setSortOrder] = useState('high-low') // default: price high to low
  const [category, setCategory] = useState('All')
  const debouncesearchterm = useDebounce(searchterm, 200)

  return (
    <div className='body'>
      <NavBar />

      <main className='home-main'>
        {/* ── Hero / About ── */}
        <section className='idbox' id='aboutsection'>
          <div className='AboutContainer'>
            <div className='about-text'>
              <h1 className='About'>Our Craft</h1>
              <p className='AboutP'>
                Meticulously molded digital gear for your physical workspace.
                Tools that feel as good as they perform.
              </p>
            </div>
            <HashLink smooth to='/#productlist' className='hero-btn'>
              Shop new arrivals
            </HashLink>
          </div>
        </section>

        {/* ── Filter bar: chips + search + sort ── */}
        <div className='FilterBar'>
          <div className='chips' role='group' aria-label='Filter by category'>
            {CATEGORIES.map(c => (
              <button
                key={c}
                className={`chip ${category === c ? 'active' : ''}`}
                aria-pressed={category === c}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>

          <div className='filter-right'>
            <label className='search-wrap'>
              <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='#5b6785' strokeWidth='2' strokeLinecap='round' aria-hidden='true'>
                <circle cx='11' cy='11' r='7' />
                <path d='M20 20l-3.5-3.5' />
              </svg>
              <input
                className='search-input'
                type='text'
                placeholder='Search premium hardware...'
                value={searchterm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </label>

            <label className='sort-wrap'>
              Sort:
              <select
                className='filter-pill'
                value={sortorder}
                onChange={e => setSortOrder(e.target.value)}
              >
                <option value='high-low'>Price: high to low</option>
                <option value='low-high'>Price: low to high</option>
                <option value='all'>Featured</option>
              </select>
            </label>
          </div>
        </div>

        {/* ── Product grid ── */}
        <div className='productlist' id='productlist'>
          <ProductList
            searchterm={debouncesearchterm}
            sortorder={sortorder}
            category={category}
          />
        </div>
      </main>
    </div>
  )
}

export default HomePage
