import {createContext, useContext, useState,useEffect} from 'react'

const CartContext = createContext();

export const CartProvider = ({children}) => {
    const [cartItems, setCartItems] = useState(() =>
    {
      const saved = localStorage.getItem('cartItems');
      return saved ? JSON.parse(saved) : [];
    }
  )

    useEffect(() =>
    {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);


const addToCart = (item) => {
  setCartItems((prevItems) => {
    const existingItem = prevItems.find((i) => i.id === item.id);
    if (existingItem) {
      return prevItems.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      );
    }
    return [...prevItems, { ...item, quantity: 1 }];
  });
};

    const deleteFromCart = (productsid) =>
    {
        const update = cartItems.filter((item) => item.id !== productsid);
        setCartItems(update);
    }
    
  return (
    <CartContext.Provider value= {{cartItems, addToCart, deleteFromCart }}>
        {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext);
