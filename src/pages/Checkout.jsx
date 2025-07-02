import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabase';

export default function Checkout({ user }) {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [bukti, setBukti] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      alert('Silakan login terlebih dahulu');
      navigate('/login');
      return;
    }

    const cartData = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(cartData);

    let t = 0;
    cartData.forEach(item => {
      const hargaAwal = item.harga || 0;
      const diskon = item.diskon || 0;
      const hargaSetelahDiskon = hargaAwal - (hargaAwal * diskon / 100);
      t += hargaSetelahDiskon * (item.jumlah || 1);
    });

    setTotal(t);
  }, [user]);

  const handleUpload = (e) => {
    setBukti(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bukti) {
      alert('Mohon upload bukti pembayaran!');
      return;
    }

    // Upload bukti pembayaran ke Supabase Storage
    const fileExt = bukti.name.split('.').pop();
    const fileName = `${Date.now()}-${user.id}.${fileExt}`;
    const filePath = `bukti/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('bukti')
      .upload(filePath, bukti);

    if (uploadError) {
      console.error(uploadError);
      alert('Gagal upload bukti.');
      return;
    }

    const { data: urlData } = supabase.storage
      .from('bukti')
      .getPublicUrl(filePath);

    // Kirim data order
    const { error: insertError } = await supabase.from('orders').insert({
      user_id: user.id,
      items: cart,
      total,
      bukti_url: urlData?.publicUrl || '',
      status: 'diproses'
    });

    if (insertError) {
      console.error(insertError);
      alert('Gagal mengirim pesanan.');
    } else {
      alert('Pesanan berhasil dikirim!');
      localStorage.removeItem('cart');
      navigate('/orders');
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto text-white">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>

      <ul className="mb-4 space-y-2">
        {cart.map((item, index) => (
          <li key={index} className="bg-gray-800 rounded p-3 flex justify-between items-center">
            <div>
              <p className="font-semibold">{item.nama}</p>
              <p className="text-sm text-gray-400">Jumlah: {item.jumlah}</p>
            </div>
            <p>
              Rp {(
                (item.harga - (item.harga * (item.diskon || 0) / 100)) *
                item.jumlah
              ).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>

      <div className="mb-6 text-right font-semibold text-lg">
        Total: Rp {total.toLocaleString()}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm">Upload Bukti Pembayaran</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="w-full text-white bg-gray-800 p-2 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 w-full"
        >
          Kirim Pesanan
        </button>
      </form>
    </div>
  );
}