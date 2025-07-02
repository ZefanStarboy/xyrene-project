import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import supabase from '../supabase';

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [gambarBaru, setGambarBaru] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.from('products').select('*').eq('id', id).single().then(({ data }) => {
      if (data) setProduct(data);
    });
  }, [id]);

  const handleUpload = async () => {
    if (!gambarBaru) return product.gambar_url;
    const ext = gambarBaru.name.split('.').pop();
    const fileName = `${Date.now()}.${ext}`;
    const { data, error } = await supabase.storage.from('produk-img').upload(fileName, gambarBaru);
    if (error) return product.gambar_url;
    const url = supabase.storage.from('produk-img').getPublicUrl(data.path);
    return url.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const gambar_url = await handleUpload();
    const { error } = await supabase.from('products').update({ ...product, gambar_url }).eq('id', id);
    setLoading(false);
    if (error) return alert('Gagal update');
    alert('Produk berhasil diperbarui!');
    navigate('/dashboard');
  };

  if (!product) return <div className="p-6 text-white">Loading...</div>;

  return (
    <div className="p-6 max-w-xl mx-auto text-white">
      <h2 className="text-2xl font-bold mb-4">Edit Produk</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" value={product.nama} onChange={(e) => setProduct({ ...product, nama: e.target.value })} className="w-full p-2 rounded bg-gray-700" required />
        <input type="number" value={product.harga} onChange={(e) => setProduct({ ...product, harga: +e.target.value })} className="w-full p-2 rounded bg-gray-700" required />
        <textarea value={product.notes} onChange={(e) => setProduct({ ...product, notes: e.target.value })} className="w-full p-2 rounded bg-gray-700" />
        <input type="number" value={product.stok} onChange={(e) => setProduct({ ...product, stok: +e.target.value })} className="w-full p-2 rounded bg-gray-700" />
        <input type="number" value={product.diskon} onChange={(e) => setProduct({ ...product, diskon: +e.target.value })} className="w-full p-2 rounded bg-gray-700" />
        <select value={product.status} onChange={(e) => setProduct({ ...product, status: e.target.value })} className="w-full p-2 rounded bg-gray-700">
          <option value="available">Available</option>
          <option value="coming soon">Coming Soon</option>
        </select>
        <input type="file" onChange={(e) => setGambarBaru(e.target.files[0])} className="w-full p-2 bg-gray-800 rounded" />
        <button type="submit" disabled={loading} className="bg-blue-600 px-4 py-2 rounded">{loading ? 'Menyimpan...' : 'Simpan'}</button>
      </form>
    </div>
  );
}