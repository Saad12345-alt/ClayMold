import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { HashLink } from 'react-router-hash-link'
import './NavBar.css'
import { useCart } from '../context/CartContext'

const NavBar = () => {
  const [menu, setMenu] = useState(false)
  const { cartItems } = useCart()

  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector('.navbar')
      if (window.scrollY > 50) navbar.classList.add('shrink')
      else navbar.classList.remove('shrink')
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className='navbar'>

      
      <Link to='/' className='nav-logo'>ClayShop</Link>

      
      <div className='nav-links'>
        <p className='menuitems'><HashLink smooth to='/#productlist'>Shop</HashLink></p>
        <p className='menuitems'><HashLink smooth to='/#aboutsection'>About</HashLink></p>
      </div>

      
      <div className='nav-cart-area'>
        <Link to='/Cart'>
          🛒
          <span className='cartitems'>{cartItems.length}</span>
        </Link>
      </div>

      
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
            <p onClick={() => setMenu(false)}><Link to='/Cart'>🛒 ({cartItems.length})</Link></p>
          </div>
        </div>
      )}

    </nav>
  )
}

export default NavBar