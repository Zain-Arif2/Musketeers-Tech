import { useEffect, useState } from "react";

// Simulates an API call so we can show skeleton loaders with mock data
export function useFakeLoading(ms = 800) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), ms);
    return () => clearTimeout(t);
  }, [ms]);

  return loading;
}