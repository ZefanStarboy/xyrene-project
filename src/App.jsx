import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import Home from './pages/Home';
import Login from './pages/Login';
import Cart from './pages/Cart';
import Order from './pages/Order';
import Orders from './pages/Orders';
import Dashboard from './pages/Dashboard';

const supabase = createClient(
  'https://uksmhisftpfhmyanermh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrc21oaXNmdHBmaG15YW5lcm1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNzUwMzksImV4cCI6MjA2Njk1MTAzOX0.lWMW_DuE6LRWVZ8sOmUuaLpk3wOAdPr9swNcveKXDIM'
);

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

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home user={user} supabase={supabase} />} />
        <Route path="/login" element={<Login supabase={supabase} />} />
        <Route path="/cart" element={<Cart user={user} supabase={supabase} />} />
        <Route path="/checkout" element={<Order user={user} supabase={supabase} />} />
        <Route path="/orders" element={<Orders user={user} supabase={supabase} />} />
        <Route path="/dashboard" element={<Dashboard user={user} supabase={supabase} />} />
      </Routes>
    </Router>
  );
}