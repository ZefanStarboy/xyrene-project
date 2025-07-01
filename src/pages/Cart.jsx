import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Cart({ user, supabase }) {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState([]);
  const [qtyMap, setQtyMap] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (user) fetchCart();
  }, [user]);

  async function fetchCart() {
    const { data } = await supabase
      .from('cart')
      .select('*')
      .eq('user_id', user.id);

    const initialQty = {};
    (data || []).forEach((item) => {
      initialQty[item.id] = item.qty || 1;
    });

    setItems(data || []);
    setQtyMap(initialQty);
  }

  function toggleItem(itemId) {
    if (selected.includes(itemId)) {
      setSelected(selected.filter((id) => id !== itemId));
    } else {
      setSelected([...selected, itemId]);
    }
  }

  function updateQty(itemId, value) {
    const qty = Math.max(1, parseInt(value || 1));
    setQtyMap({ ...qtyMap, [itemId]: qty });
  }

  async function deleteItem(id) {
    await supabase.from('cart').delete().eq('id', id);
    fetchCart();
  }

  function handleCheckoutSelected() {
    if (selected.length === 0) {
      alert("Pilih minimal 1 item untuk checkout.");
      return;
    }

    const selectedItems = items
      .filter((item) => selected.includes(item.id))
      .map((item) => ({
        ...item,
        qty: qtyMap[item.id] || 1,
      }));

    localStorage.setItem('checkoutItems', JSON.stringify(selectedItems));
    navigate('/checkout');
  }

  function formatRupiah(number) {
    return 'Rp ' + number.toLocaleString('id-ID');
  }

  const totalSemua = selected.reduce((acc, id) => {
    const item = items.find((i) => i.id === id);
    if (!item) return acc;
    const qty = qtyMap[id] || 1;
    return acc + (item.product_price || 0) * qty;
  }, 0);

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🛒 Troli Belanja</h1>
      {items.length === 0 ? (
        <p className="text-gray-400">Troli kamu masih kosong.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {items.map((item) => {
              const qty = qtyMap[item.id] || 1;
              const total = (item.product_price || 0) * qty;
              return (
                <li
                  key={item.id}
                  className="bg-card p-3 rounded-lg flex flex-col gap-2"
                >
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selected.includes(item.id)}
                      onChange={() => toggleItem(item.id)}
                    />
                    <span className="font-semibold">{item.product_name}</span>
                  </label>

                  <label className="text-sm">
                    Jumlah:
                    <input
                      type="number"
                      min="1"
                      value={qty}
                      onChange={(e) => updateQty(item.id, e.target.value)}
                      className="ml-2 w-16"
                    />
                  </label>

                  <p className="text-sm text-gray-400">
                    💰 Total: {formatRupiah(total)}
                  </p>

                  <button
                    onClick={() => deleteItem(item.id)}
                    className="text-sm text-red-400 underline self-end"
                  >
                    Hapus
                  </button>
                </li>
              );
            })}
          </ul>

          {selected.length > 0 && (
            <div className="mt-6">
              <p className="text-lg font-semibold">
                🧾 Total Semua: {formatRupiah(totalSemua)}
              </p>
              <button
                onClick={handleCheckoutSelected}
                className="w-full bg-green-600 mt-2 px-4 py-2 rounded-lg text-white"
              >
                🚀 Checkout Terpilih
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}