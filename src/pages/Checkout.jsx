import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Checkout({ user, supabase }) {
  const [items, setItems] = useState([]);
  const [alamat, setAlamat] = useState('');
  const [bukti, setBukti] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('checkoutItems');
    if (stored) setItems(JSON.parse(stored));
  }, []);

  function formatRupiah(nominal) {
    return 'Rp ' + nominal.toLocaleString('id-ID');
  }

  const totalHarga = items.reduce((acc, item) => {
    return acc + (item.product_price || 0) * (item.qty || 1);
  }, 0);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!alamat || !bukti || items.length === 0) {
      alert("Lengkapi semua form & pastikan item terisi.");
      return;
    }

    setLoading(true);

    const filename = `${user.id}-${Date.now()}.jpg`;
    const { error: uploadError } = await supabase.storage
      .from('bukti')
      .upload(filename, bukti);

    if (uploadError) {
      alert("Upload gagal: " + uploadError.message);
      setLoading(false);
      return;
    }

    const itemList = items
      .map((i) => `${i.product_name} x${i.qty}`)
      .join(', ');

    const { error: orderError } = await supabase.from('orders').insert({
      user_id: user.id,
      alamat,
      bukti: filename,
      status: 'Menunggu Verifikasi',
      total: totalHarga,
      items: itemList,
    });

    if (orderError) {
      alert("Gagal simpan pesanan: " + orderError.message);
      setLoading(false);
      return;
    }

    const idList = items.map((i) => i.id);
    await supabase.from('cart').delete().in('id', idList);

    localStorage.removeItem('checkoutItems');
    alert("Pesanan berhasil dikirim!");
    navigate('/orders');
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      <ul className="mb-4">
        {items.map((item) => (
          <li key={item.id} className="mb-2 text-sm">
            {item.product_name} x{item.qty} →{' '}
            <strong>{formatRupiah(item.product_price * item.qty)}</strong>
          </li>
        ))}
      </ul>

      <p className="font-semibold mb-4">
        🧾 Total Harga: {formatRupiah(totalHarga)}
      </p>

      {/* SECTION QR PEMBAYARAN */}
      <div className="mb-6">
        <p className="font-medium mb-2">📸 Silakan transfer ke QR berikut:</p>
        <img
          src="/img/qris.png"
          alt="QR Pembayaran"
          className="w-full max-w-xs rounded-lg border"
        />
      </div>

      <form onSubmit={handleSubmit}>
        <label>Alamat Pengiriman</label>
        <textarea
          required
          value={alamat}
          onChange={(e) => setAlamat(e.target.value)}
          className="w-full mb-2"
        />

        <label>Upload Bukti Pembayaran</label>
        <input
          type="file"
          required
          accept="image/*"
          onChange={(e) => setBukti(e.target.files[0])}
          className="mb-4"
        />

        <button
          type="submit"
          className="bg-blue-600 px-4 py-2 rounded-lg text-white w-full"
          disabled={loading}
        >
          {loading ? 'Mengirim...' : 'Submit Pesanan'}
        </button>
      </form>
    </div>
  );
}