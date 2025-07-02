// src/App.jsx
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import supabase from './supabase';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Dashboard from './pages/Dashboard';
import EditProfile from './pages/EditProfile';
import ProductDetail from './pages/ProductDetail';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';

const ADMIN_EMAILS = ['allan.zefanka@gmail.com', 'zealedetta@gmail.com'];

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const isAdmin = user && ADMIN_EMAILS.includes(user.email);

  return (
    <Router>
      <Navbar user={user} />
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout user={user} />} />
        <Route path="/orders" element={<Orders user={user} />} />
        <Route path="/edit-profile" element={<EditProfile user={user} />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route
          path="/dashboard"
          element={
            isAdmin ? (
              <Dashboard user={user} />
            ) : (
              <div className="text-center p-10 text-xl">Akses ditolak</div>
            )
          }
        />
        <Route
          path="/add-product"
          element={
            isAdmin ? (
              <AddProduct />
            ) : (
              <div className="text-center p-10 text-xl">Akses ditolak</div>
            )
          }
        />
        <Route
          path="/edit-product/:id"
          element={
            isAdmin ? (
              <EditProduct />
            ) : (
              <div className="text-center p-10 text-xl">Akses ditolak</div>
            )
          }
        />
      </Routes>
    </Router>
  );
}