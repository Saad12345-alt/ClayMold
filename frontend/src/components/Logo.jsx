import React from 'react'

// ClayShop logo mark: rounded blue square with a white "C" ring
const Logo = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox='0 0 40 40' aria-hidden='true' style={{ flexShrink: 0 }}>
    <defs>
      <linearGradient id='csLogoGrad' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0' stopColor='#7aa7e8' />
        <stop offset='1' stopColor='#1b2a4e' />
      </linearGradient>
    </defs>
    <rect width='40' height='40' rx='13' fill='url(#csLogoGrad)' />
    <path
      d='M26.5 14a8.5 8.5 0 1 0 0 12'
      stroke='#fff'
      strokeWidth='4.2'
      strokeLinecap='round'
      fill='none'
    />
    <circle cx='28' cy='20' r='2.3' fill='#cfe0ff' />
  </svg>
)

export default Logo
