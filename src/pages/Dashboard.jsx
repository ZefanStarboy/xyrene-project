import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard({ user, supabase }) {
  const navigate = useNavigate();
const ADMIN_EMAILS = ['allanzefanka@mail.com', 'unknownuserxxxyrene@mail.com'];
if (!ADMIN_EMAILS.includes(user.email)) {
  alert('Kamu bukan admin.');
  navigate('/');
  return;
}

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form Tambah/Edit Produk
  const [editMode, setEditMode] = useState(false);
  const [productId, setProductId] = useState(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('available');
  const [stock, setStock] = useState('');
  const [discount, setDiscount] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (!user) return;
    if (user.email !== ADMIN_EMAIL) {
      alert('Kamu bukan admin.');
      navigate('/');
      return;
    }
    fetchOrders();
    fetchProducts();
  }, [user]);

  async function fetchOrders() {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    setOrders(data || []);
  }

  async function fetchProducts() {
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    setProducts(data || []);
  }

  async function verifyOrder(id) {
    setLoading(true);
    await supabase
      .from('orders')
      .update({ status: 'Pembayaran Terverifikasi' })
      .eq('id', id);
    fetchOrders();
    setLoading(false);
  }

  function formatRupiah(n) {
    return 'Rp ' + n.toLocaleString('id-ID');
  }

  async function handleAddOrUpdate(e) {
    e.preventDefault();
    if (!name || !price || !notes || !stock) {
      alert('Lengkapi semua isian.');
      return;
    }

    setLoading(true);
    let filename = null;

    if (image) {
      filename = `${Date.now()}-${image.name}`;
      const { error: uploadError } = await supabase.storage
        .from('produk')
        .upload(filename, image);

      if (uploadError) {
        alert('Upload gambar gagal: ' + uploadError.message);
        setLoading(false);
        return;
      }
    }

    const data = {
      name,
      price: parseInt(price),
      notes,
      status,
      stock: parseInt(stock),
      discount: parseInt(discount || '0'),
    };
    if (filename) data.image = filename;

    if (editMode) {
      await supabase.from('products').update(data).eq('id', productId);
      alert('Produk berhasil diupdate!');
    } else {
      await supabase.from('products').insert(data);
      alert('Produk berhasil ditambahkan!');
    }

    resetForm();
    fetchProducts();
    setLoading(false);
  }

  function resetForm() {
    setEditMode(false);
    setProductId(null);
    setName('');
    setPrice('');
    setNotes('');
    setStatus('available');
    setStock('');
    setDiscount('');
    setImage(null);
  }

  function handleEdit(p) {
    setEditMode(true);
    setProductId(p.id);
    setName(p.name);
    setPrice(p.price);
    setNotes(p.notes);
    setStatus(p.status);
    setStock(p.stock);
    setDiscount(p.discount || '');
    setImage(null); // user bisa pilih ganti gambar atau tidak
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📦 Dashboard Admin</h1>

      {/* FORM TAMBAH / EDIT PRODUK */}
      <div className="mb-10 bg-card p-4 rounded border">
        <h2 className="text-lg font-semibold mb-2">
          {editMode ? '✏️ Edit Produk' : '➕ Tambah Produk Baru'}
        </h2>
        <form onSubmit={handleAddOrUpdate} className="grid gap-2">
          <input
            type="text"
            placeholder="Nama Produk"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="p-2 rounded border"
          />
          <input
            type="number"
            placeholder="Harga"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="p-2 rounded border"
          />
          <textarea
            placeholder="Notes / Deskripsi"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            required
            className="p-2 rounded border"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="p-2 rounded border"
          >
            <option value="available">Available</option>
            <option value="coming">Coming Soon</option>
          </select>
          <input
            type="number"
            placeholder="Stok"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
            className="p-2 rounded border"
          />
          <input
            type="number"
            placeholder="Diskon (%)"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="p-2 rounded border"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="p-2"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white rounded px-4 py-2"
            >
              {editMode
                ? loading
                  ? 'Mengupdate...'
                  : 'Update Produk'
                : loading
                ? 'Menambahkan...'
                : 'Tambah Produk'}
            </button>
            {editMode && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white rounded px-4 py-2"
              >
                Batal Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* LIST PRODUK + TOMBOL EDIT */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">📋 Produk Saat Ini</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {products.map((p) => (
            <div
              key={p.id}
              className="border p-4 rounded bg-background text-sm"
            >
              <p><strong>Nama:</strong> {p.name}</p>
              <p><strong>Harga:</strong> {formatRupiah(p.price)}</p>
              <p><strong>Stok:</strong> {p.stock}</p>
              <p><strong>Status:</strong> {p.status}</p>
              <p><strong>Diskon:</strong> {p.discount || 0}%</p>
              <button
                onClick={() => handleEdit(p)}
                className="mt-2 px-3 py-1 rounded bg-blue-500 text-white"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* VERIFIKASI PESANAN */}
      <h2 className="text-xl font-semibold mb-4">🧾 Pesanan Masuk</h2>
      {orders.length === 0 ? (
        <p className="text-gray-400">Belum ada pesanan.</p>
      ) : (
        <ul className="grid gap-4">
          {orders.map((o) => (
            <li key={o.id} className="bg-card border p-4 rounded-lg">
              <p><strong>Produk:</strong> {o.items}</p>
              <p><strong>Alamat:</strong> {o.alamat}</p>
              <p><strong>Total:</strong> {formatRupiah(o.total)}</p>
              <p>
                <strong>Status:</strong>{' '}
                <span className={o.status === 'Menunggu Verifikasi' ? 'text-yellow-400' : 'text-green-400'}>
                  {o.status}
                </span>
              </p>
              <p className="mt-2"><strong>Bukti:</strong></p>
              <img
                src={`https://uksmhisftpfhmyanermh.supabase.co/storage/v1/object/public/bukti/${o.bukti}`}
                alt="Bukti Bayar"
                className="w-40 rounded border"
              />
              {o.status === 'Menunggu Verifikasi' && (
                <button
                  onClick={() => verifyOrder(o.id)}
                  disabled={loading}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
                >
                  {loading ? 'Memverifikasi...' : 'Verifikasi'}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}