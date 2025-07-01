import { useState } from 'react';

export default function Login({ supabase }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) alert('Gagal mengirim link: ' + error.message);
    else alert('Link login sudah dikirim ke email kamu ✅');
    setLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.reload();
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleLogin}>
        <label>Email</label>
        <input
          type="email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email kamu"
        />
        <button type="submit" className="bg-blue-600 px-4 py-2 rounded-lg mt-2">
          {loading ? 'Mengirim...' : 'Kirim Link Login'}
        </button>
      </form>

      <button
        onClick={handleLogout}
        className="mt-4 text-sm text-red-400 underline"
      >
        Logout (jika sudah login)
      </button>
    </div>
  );
}