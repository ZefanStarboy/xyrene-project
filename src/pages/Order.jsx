import { useEffect, useState } from 'react';

export default function Orders({ user, supabase }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  async function fetchOrders() {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setOrders(data || []);
  }

  function formatRupiah(nominal) {
    return 'Rp ' + nominal.toLocaleString('id-ID');
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🧾 Riwayat Pesanan</h1>
      {orders.length === 0 ? (
        <p className="text-gray-400">Belum ada pesanan.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li
              key={order.id}
              className="bg-card rounded-lg p-4 border border-gray-700"
            >
              <p className="mb-1">
                <strong>Produk:</strong> {order.items}
              </p>
              <p className="mb-1">
                <strong>Total:</strong> {formatRupiah(order.total)}
              </p>
              <p className="mb-1">
                <strong>Status:</strong>{' '}
                <span
                  className={
                    order.status === 'Menunggu Verifikasi'
                      ? 'text-yellow-400'
                      : 'text-green-400'
                  }
                >
                  {order.status}
                </span>
              </p>
              <p className="mb-1">
                <strong>Alamat:</strong> {order.alamat}
              </p>
              <p className="mb-2">
                <strong>Bukti Bayar:</strong>
              </p>
              <img
                src={`https://uksmhisftpfhmyanermh.supabase.co/storage/v1/object/public/bukti/${order.bukti}`}
                alt="bukti bayar"
                className="rounded w-full max-w-xs border"
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}