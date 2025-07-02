import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(savedCart);
  }, []);

  const updateCart = (newCart) => {
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const handleQuantity = (index, delta) => {
    const newCart = [...cartItems];
    newCart[index].quantity = Math.max(1, newCart[index].quantity + delta);
    updateCart(newCart);
  };

  const removeItem = (index) => {
    const newCart = [...cartItems];
    newCart.splice(index, 1);
    updateCart(newCart);
  };

  const getTotal = () => {
    return cartItems.reduce((total, item) => {
      const hargaAwal = item.harga || 0;
      const diskon = item.diskon || 0;
      const hargaSetelahDiskon = hargaAwal * ((100 - diskon) / 100);
      return total + hargaSetelahDiskon * item.quantity;
    }, 0);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    navigate('/checkout');
  };

  return (
    <div className="px-4 pt-24 pb-12 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-6">Troli Belanja 🛒</h1>

      {cartItems.length === 0 ? (
        <div className="text-center text-gray-400 mt-20">Keranjang kosong.</div>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item, index) => (
            <div key={index} className="flex items-center bg-gray-900 rounded-lg p-4 shadow-md">
              <img
                src={item.gambar || '/img/default.jpg'}
                alt={item.nama}
                className="w-20 h-20 object-cover rounded mr-4"
              />
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{item.nama}</h2>
                <p className="text-sm text-gray-400">
                  Harga: Rp{(item.harga || 0).toLocaleString()} {item.diskon > 0 && (
                    <span className="text-green-400 ml-2">Diskon {item.diskon}%</span>
                  )}
                </p>
                <div className="flex items-center mt-2">
                  <button
                    onClick={() => handleQuantity(index, -1)}
                    className="px-2 bg-gray-700 rounded-l hover:bg-gray-600"
                  >
                    -
                  </button>
                  <div className="px-4 bg-gray-800">{item.quantity}</div>
                  <button
                    onClick={() => handleQuantity(index, 1)}
                    className="px-2 bg-gray-700 rounded-r hover:bg-gray-600"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeItem(index)}
                    className="ml-4 text-red-400 hover:text-red-500 text-sm"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* TOTAL */}
          <div className="text-right text-xl mt-6">
            Total: <span className="text-green-400 font-bold">Rp{getTotal().toLocaleString()}</span>
          </div>

          {/* BUTTON */}
          <div className="text-right mt-4">
            <button
              onClick={handleCheckout}
              className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded text-white"
            >
              Lanjut Checkout 🛍️
            </button>
          </div>
        </div>
      )}
    </div>
  );
}