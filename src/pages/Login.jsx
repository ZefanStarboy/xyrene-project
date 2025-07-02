import { useState } from 'react';
import supabase from '../supabase';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert('Login gagal: ' + error.message);
    } else {
      alert('Berhasil login!');
      navigate('/');
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">Masuk ke Akun Anda</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded bg-gray-800"
            required
          />
        </div>
        <div>
          <label className="block text-sm">Kata Sandi</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded bg-gray-800"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Memproses...' : 'Login'}
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-400">
        Belum punya akun?{' '}
        <a href="/register" className="text-blue-400 underline">
          Daftar di sini
        </a>
      </p>
    </div>
  );
}