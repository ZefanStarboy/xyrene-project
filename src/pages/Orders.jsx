import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Orders({ user, supabase }) {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchOrders();
    }
  }, [user]);

  async function fetchOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Gagal mengambil pesanan:', error);
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  }

  function formatRupiah(n) {
    return 'Rp ' + n.toLocaleString('id-ID');
  }

  function formatTanggal(tanggal) {
    return new Date(tanggal).toLocaleString('id-ID');
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">🧾 Riwayat Pembelian</h1>

      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">Kamu belum pernah melakukan pemesanan.</p>
      ) : (
        <ul className="grid gap-4">
          {orders.map((order) => (
            <li
              key={order.id}
              className="bg-card border rounded-lg p-4 shadow-sm"
            >
              <p><strong>Produk:</strong> {order.items}</p>
              <p><strong>Alamat:</strong> {order.alamat}</p>
              <p><strong>Total:</strong> {formatRupiah(order.total)}</p>
              <p>
                <strong>Status:</strong>{' '}
                <span
                  className={
                    order.status === 'Pembayaran Terverifikasi'
                      ? 'text-green-500'
                      : 'text-yellow-500'
                  }
                >
                  {order.status}
                </span>
              </p>
              {order.bukti && (
                <div className="mt-2">
                  <p><strong>Bukti Pembayaran:</strong></p>
                  <img
                    src={`https://uksmhisftpfhmyanermh.supabase.co/storage/v1/object/public/bukti/${order.bukti}`}
                    alt="Bukti"
                    className="w-40 border rounded"
                  />
                </div>
              )}
              <p className="text-sm text-gray-400 mt-2">
                Dipesan pada: {formatTanggal(order.created_at)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}