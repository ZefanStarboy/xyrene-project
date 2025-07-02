import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import supabase from '../supabase';

export default function ProductDetail({ user }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error loading product:', error);
      navigate('/');
    } else {
      setProduct(data);
      setLoading(false);
    }
  };

  const addToCart = () => {
    if (!user) {
      alert('Silakan login untuk menambahkan ke troli.');
      navigate('/login');
      return;
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      existing.jumlah += 1;
    } else {
      cart.push({ ...product, jumlah: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Ditambahkan ke troli!');
  };

  if (loading) return <div className="p-6 text-center text-white">Loading produk...</div>;

  const isSoldOut = product.stok <= 0;

  return (
    <div className="max-w-3xl mx-auto p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">{product.nama}</h2>
      <img
        src={product.gambar_url}
        alt={product.nama}
        className="w-full max-h-96 object-cover rounded mb-4"
      />

      <p className="mb-2 text-lg">Harga: Rp {product.harga.toLocaleString('id-ID')}</p>

      {product.diskon && product.diskon > 0 && (
        <p className="mb-2 text-green-400">Diskon: {product.diskon}%</p>
      )}

      <p className="mb-4 text-gray-300">{product.notes}</p>

      {isSoldOut ? (
        <div className="text-red-500 font-semibold">SOLD OUT</div>
      ) : (
        <div className="flex gap-4 mt-4">
          <button
            onClick={addToCart}
            className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200"
          >
            🛒 Tambah ke Troli
          </button>
          <button
            onClick={() => navigate('/checkout')}
            className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
          >
            🛍️ Beli Sekarang
          </button>
        </div>
      )}
    </div>
  );
}