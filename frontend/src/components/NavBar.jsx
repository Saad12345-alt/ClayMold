import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { HashLink } from 'react-router-hash-link'
import './NavBar.css'
import { useCart } from '../context/CartContext'
import Logo from './Logo.jsx'

// Hardcoded profile for now (no login for customers yet)
const PROFILE_INITIALS = 'SK'

const BagIcon = () => (
  <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
    <path d='M6 8h12l1.2 12H4.8L6 8z' />
    <path d='M9 8V7a3 3 0 0 1 6 0v1' />
  </svg>
)

const NavBar = () => {
  const [menu, setMenu] = useState(false)
  const { totalItems } = useCart()

  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector('.navbar')
      if (!navbar) return
      if (window.scrollY > 50) navbar.classList.add('shrink')
      else navbar.classList.remove('shrink')
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className='navbar'>
      {/* Logo + name */}
      <Link to='/' className='nav-logo' aria-label='ClayShop home'>
        <Logo size={38} />
        <span>ClayShop</span>
      </Link>

      {/* Centre links */}
      <div className='nav-links'>
        <p className='menuitems'><HashLink smooth to='/#productlist'>Shop</HashLink></p>
        <p className='menuitems'><HashLink smooth to='/#aboutsection'>About</HashLink></p>
      </div>

      {/* Profile + cart */}
      <div className='nav-right'>
        <button className='nav-avatar' aria-label='Profile'>{PROFILE_INITIALS}</button>
        <Link to='/Cart' className='nav-cart' aria-label={`Cart, ${totalItems} items`}>
          <BagIcon />
          {totalItems > 0 && <span className='cartitems'>{totalItems}</span>}
        </Link>
      </div>

      {/* Hamburger (mobile) */}
      <button className='hamburger' onClick={() => setMenu(!menu)} aria-label='Menu'>
        ☰
      </button>

      {/* Mobile overlay */}
      {menu && (
        <div className='menu-overlay' onClick={() => setMenu(false)}>
          <div className='menu-content' onClick={e => e.stopPropagation()}>
            <p onClick={() => setMenu(false)}><Link to='/'>Home</Link></p>
            <p onClick={() => setMenu(false)}><HashLink smooth to='/#productlist'>Shop</HashLink></p>
            <p onClick={() => setMenu(false)}><HashLink smooth to='/#aboutsection'>About</HashLink></p>
            <p onClick={() => setMenu(false)}><Link to='/Cart'>Cart ({totalItems})</Link></p>
          </div>
        </div>
      )}
    </nav>
  )
}

export default NavBar
