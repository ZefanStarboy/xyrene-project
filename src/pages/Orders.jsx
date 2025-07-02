import { useEffect, useState } from 'react';
import supabase from '../supabase';
import { useNavigate } from 'react-router-dom';

export default function Orders({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
    } else {
      setOrders(data);
    }

    setLoading(false);
  };

  if (loading) return <div className="p-6 text-center">Loading riwayat...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">Riwayat Pemesanan</h2>
      {orders.length === 0 ? (
        <p className="text-gray-400">Belum ada riwayat pesanan.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-gray-800 p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{order.nama_produk}</p>
                <p className="text-sm text-gray-400">Jumlah: {order.jumlah}</p>
                <p className="text-sm text-gray-400">Status: <span className="capitalize">{order.status}</span></p>
              </div>
              <div className="text-sm text-right text-gray-400">
                <p>{new Date(order.created_at).toLocaleDateString('id-ID')}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}