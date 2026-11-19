import { Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Dashboard from "/pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";

export default function App() {
  return (
    <Routes>
      {/* All pages share the Layout (sidebar + header) */}
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/orders" element={<Orders />} />
      </Route>
    </Routes>
  );
}