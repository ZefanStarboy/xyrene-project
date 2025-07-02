import { useEffect, useState } from 'react';
import supabase from '../supabase';
import { Link } from 'react-router-dom';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('produk')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setProducts(data);
  };

  const filtered = products.filter((p) =>
    p.nama.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 max-w-6xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Parfum Tersedia</h1>

      {/* Search bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Cari parfum..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Produk grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.map((product) => {
          const finalPrice =
            product.diskon > 0
              ? (product.harga * (1 - product.diskon / 100)).toFixed(0)
              : product.harga;

          return (
            <Link
              key={product.id}
              to={`/produk/${product.id}`}
              className={`border rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-105 ${
                product.stok === 0 ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              <img
                src={product.gambar_url}
                alt={product.nama}
                className="w-full h-64 object-cover"
              />
              <div className="p-4 bg-black">
                <h2 className="text-xl font-semibold">{product.nama}</h2>

                {/* Harga & Diskon */}
                {product.diskon > 0 ? (
                  <div className="mt-1">
                    <span className="line-through text-sm text-gray-400 mr-2">
                      Rp{product.harga}
                    </span>
                    <span className="text-green-400 font-bold">
                      Rp{finalPrice}
                    </span>
                  </div>
                ) : (
                  <p className="text-gray-300 mt-1">Rp{product.harga}</p>
                )}

                {/* Stok habis */}
                {product.stok === 0 && (
                  <p className="text-red-500 mt-2 font-semibold">SOLD OUT</p>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Jika hasil kosong */}
      {filtered.length === 0 && (
        <div className="text-center mt-10 text-gray-400">
          Produk tidak ditemukan.
        </div>
      )}
    </div>
  );
}