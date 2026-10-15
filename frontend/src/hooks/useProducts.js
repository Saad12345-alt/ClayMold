import { useState, useEffect } from 'react'
import axios from 'axios'

const API = 'http://localhost:5000'

// useProducts(searchterm, sortorder, category)
// sortorder: 'high-low' | 'low-high' | 'all'
// category:  'All' | 'Keyboards' | 'Mice' | 'Audio' | 'Displays' | 'Accessories'
export const useProducts = (searchterm = '', sortorder = 'high-low', category = 'All') => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    axios
      .get(`${API}/products`, {
        params: { search: searchterm, sort: sortorder, category }
      })
      .then((res) => {
        if (cancelled) return
        setProducts(res.data)
        setError(null)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    // Ignore the answer if the user typed again before it arrived
    return () => {
      cancelled = true
    }
  }, [searchterm, sortorder, category])

  return { products, loading, error }
}
