import { useState } from 'react';
import supabase  from '../supabase';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: 'https://xyrene-marking.netlify.app/', // Ganti sesuai URL deploy
      },
    });

    if (error) {
      alert('Gagal daftar: ' + error.message);
    } else {
      alert('Pendaftaran berhasil! Silakan cek email untuk verifikasi.');
      navigate('/login');
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">Daftar Akun Baru</h2>
      <form onSubmit={handleRegister} className="space-y-4">
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
          className="w-full bg-green-600 py-2 rounded hover:bg-green-700"
          disabled={loading}
        >
          {loading ? 'Mendaftarkan...' : 'Daftar'}
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-400">
        Sudah punya akun?{' '}
        <a href="/login" className="text-blue-400 underline">
          Login di sini
        </a>
      </p>
    </div>
  );
}