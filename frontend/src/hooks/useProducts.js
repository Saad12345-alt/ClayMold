import { useEffect, useState } from "react";
import axios from "axios";

export const useProducts = (searchterm, sortorder) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:5000/products", {
          params: { search: searchterm, sort: sortorder },
        });
        setProducts(res.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchterm, sortorder]);

  return { products, loading, error };
};