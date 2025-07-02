import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabase';

export default function AddProduct() {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    nama: '',
    harga: '',
    notes: '',
    status: 'available',
    stok: 0,
    diskon: 0
  });
  const [gambar, setGambar] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!gambar) return '';
    const ext = gambar.name.split('.').pop();
    const fileName = `${Date.now()}.${ext}`;
    const { data, error } = await supabase.storage
      .from('produk-img')
      .upload(fileName, gambar);
    if (error) return '';
    const url = supabase.storage.from('produk-img').getPublicUrl(data.path);
    return url.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const gambar_url = await handleUpload();
    const { error } = await supabase.from('products').insert({ ...product, gambar_url });
    setLoading(false);
    if (error) return alert('Gagal tambah produk');
    alert('Produk berhasil ditambahkan!');
    navigate('/dashboard');
  };

  return (
    <div className="p-6 max-w-xl mx-auto text-white">
      <h2 className="text-2xl font-bold mb-4">Tambah Produk</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Nama Produk" value={product.nama} onChange={(e) => setProduct({ ...product, nama: e.target.value })} className="w-full p-2 rounded bg-gray-700" required />
        <input type="number" placeholder="Harga" value={product.harga} onChange={(e) => setProduct({ ...product, harga: +e.target.value })} className="w-full p-2 rounded bg-gray-700" required />
        <textarea placeholder="Notes" value={product.notes} onChange={(e) => setProduct({ ...product, notes: e.target.value })} className="w-full p-2 rounded bg-gray-700" />
        <input type="number" placeholder="Stok" value={product.stok} onChange={(e) => setProduct({ ...product, stok: +e.target.value })} className="w-full p-2 rounded bg-gray-700" />
        <input type="number" placeholder="Diskon (%)" value={product.diskon} onChange={(e) => setProduct({ ...product, diskon: +e.target.value })} className="w-full p-2 rounded bg-gray-700" />
        <select value={product.status} onChange={(e) => setProduct({ ...product, status: e.target.value })} className="w-full p-2 rounded bg-gray-700">
          <option value="available">Available</option>
          <option value="coming soon">Coming Soon</option>
        </select>
        <input type="file" onChange={(e) => setGambar(e.target.files[0])} className="w-full p-2 bg-gray-800 rounded" required />
        <button type="submit" disabled={loading} className="bg-green-600 px-4 py-2 rounded">{loading ? 'Mengunggah...' : 'Tambah'}</button>
      </form>
    </div>
  );
}