import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'

const CartContext = createContext()

// A cart line is identified by product id + colour,
// so a black mouse and a white mouse are two separate lines.
const makeKey = (id, colorName) => `${id}::${colorName || 'default'}`

// Read the saved cart. Also upgrades old saved items that have no "key" yet.
const loadCart = () => {
  try {
    const saved = JSON.parse(localStorage.getItem('cartItems'))
    if (!Array.isArray(saved)) return []
    return saved.map((item) => ({
      ...item,
      key: item.key || makeKey(item.id, item.color),
      quantity: item.quantity || 1
    }))
  } catch {
    return []
  }
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(loadCart)

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems))
  }, [cartItems])

  // addToCart(product, quantity, selectedColor)
  const addToCart = useCallback((product, quantity = 1, color = null) => {
    const colorName = color?.name || null
    const key = makeKey(product.id, colorName)
    const max = product.stock ?? Infinity

    setCartItems((prev) => {
      const existing = prev.find((item) => item.key === key)
      if (existing) {
        return prev.map((item) =>
          item.key === key
            ? { ...item, quantity: Math.min(item.quantity + quantity, max) }
            : item
        )
      }
      return [
        ...prev,
        {
          key,
          id: product.id,
          name: product.name,
          price: product.price,
          image: color?.image || product.image,
          stock: product.stock,
          color: colorName,
          colorHex: color?.hex || null,
          quantity: Math.min(quantity, max)
        }
      ]
    })
  }, [])

  // delta is +1 or -1. Going below 1 removes the line.
  const updateQuantity = useCallback((key, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.key !== key) return item
          const max = item.stock ?? Infinity
          return { ...item, quantity: Math.min(item.quantity + delta, max) }
        })
        .filter((item) => item.quantity >= 1)
    )
  }, [])

  const deleteFromCart = useCallback((key) => {
    setCartItems((prev) => prev.filter((item) => item.key !== key))
  }, [])

  const clearCart = useCallback(() => setCartItems([]), [])

  // Totals are calculated, never stored in separate state
  const totalItems = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  )
  const totalPrice = useMemo(
    () => Math.round(cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100) / 100,
    [cartItems]
  )

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, updateQuantity, deleteFromCart, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
