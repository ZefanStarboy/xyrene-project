import { useState } from 'react';

const products = [
  {
    id: 1,
    name: 'Serentis Crème',
    status: 'available',
    notes: 'Creamy white floral, sensual, elegan',
  },
  {
    id: 2,
    name: 'Noctis Amber',
    status: 'coming',
    notes: 'Amber oriental misterius',
  },
  {
    id: 3,
    name: 'Ventis Fleura',
    status: 'coming',
    notes: 'Tropical floral musky',
  },
];

export default function Home({ user, supabase }) {
  const [selected, setSelected] = useState(null);

  async function addToCart(product) {
    if (!user) return alert("Login dulu ya!");
    await supabase.from('cart').insert({
      user_id: user.id,
      product_id: product.id,
      product_name: product.name,
    });
    alert("🛒 Ditambahkan ke troli!");
  }

  function showNotes(product) {
    setSelected(product);
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">XYRENE FRAGRANCE</h1>
      <h2 className="text-xl font-semibold mb-2">"LEAVE YOUR MARK WITH XYRENE"</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
        {products.map((p) => (
          <div
            key={p.id}
            className={`bg-card ${p.status !== 'available' ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <h3 className="text-xl font-bold">{p.name}</h3>
            <p className="text-sm text-gray-400 mt-1">{p.status === 'available' ? 'Available Now' : 'Coming Soon'}</p>

            <div className="flex gap-2 mt-3">
              {p.status === 'available' ? (
                <>
                  <button
                    className="bg-green-600 px-3 py-1 rounded-full text-sm"
                    onClick={() => alert('Masukkan alamat di halaman checkout nanti.')}
                  >
                    🛍️ Beli Sekarang
                  </button>
                  <button
                    className="bg-white text-black px-3 py-1 rounded-full text-sm"
                    onClick={() => addToCart(p)}
                  >
                    🛒 Troli
                  </button>
                </>
              ) : (
                <button className="bg-red-600 px-3 py-1 rounded-full text-sm">
                  Pre-Order
                </button>
              )}
              <button
                onClick={() => showNotes(p)}
                className="px-3 py-1 rounded-full bg-zinc-700 text-sm"
              >
                Notes
              </button>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="bg-zinc-900 p-6 rounded-xl w-72 text-center">
            <h3 className="text-xl font-bold mb-2">{selected.name}</h3>
            <p className="mb-4">{selected.notes}</p>
            <button
              onClick={() => setSelected(null)}
              className="bg-zinc-700 px-4 py-1 rounded-full"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}