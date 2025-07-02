import { useEffect, useState } from 'react';
import supabase from '../supabase';
import { useNavigate } from 'react-router-dom';

export default function EditProfile() {
  const [userData, setUserData] = useState({ nama: '', email: '', no_hp: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data, error } = await supabase
        .from('profiles')
        .select('nama, email, no_hp')
        .eq('id', user.id)
        .single();

      if (data) {
        setUserData({
          nama: data.nama || '',
          email: data.email || user.email,
          no_hp: data.no_hp || '',
        });
      }
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase.from('profiles').upsert({
        id: user.id,
        nama: userData.nama,
        email: userData.email,
        no_hp: userData.no_hp,
      });

      // optional: update auth email if changed
      if (user.email !== userData.email) {
        await supabase.auth.updateUser({ email: userData.email });
      }

      alert('Profil berhasil diperbarui!');
      navigate('/');
    }

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-lg mx-auto text-white">
      <h2 className="text-2xl font-bold mb-4">Edit Profil</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nama"
          value={userData.nama}
          onChange={(e) => setUserData({ ...userData, nama: e.target.value })}
          className="w-full p-2 rounded bg-gray-700"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={userData.email}
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          className="w-full p-2 rounded bg-gray-700"
          required
        />
        <input
          type="text"
          placeholder="No HP"
          value={userData.no_hp}
          onChange={(e) => setUserData({ ...userData, no_hp: e.target.value })}
          className="w-full p-2 rounded bg-gray-700"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 px-4 py-2 rounded"
        >
          {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </form>
    </div>
  );
}