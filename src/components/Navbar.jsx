import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ user, supabase }) {
  const [dropdown, setDropdown] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => setDropdown(!dropdown);
  const isAdmin = user && ['allan.zefanka@gmail.com', 'zealledetta@gmail.com'].includes(user.email);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <nav className="flex items-center justify-between bg-black px-4 py-3 shadow-lg text-white relative z-50">
      <div className="flex items-center gap-3">
        <img src="/img/logo.png" alt="XYRENE" className="h-10 w-10 rounded-full" />
        <Link to="/" className="text-xl font-bold tracking-widest">XYRENE</Link>
      </div>

      <div className="flex-1 mx-6 max-w-xl">
        <input
          type="text"
          placeholder="Cari parfum..."
          className="w-full rounded-md px-4 py-2 text-black"
        />
      </div>

      <div className="relative">
        {user ? (
          <>
            <button
              onClick={toggleDropdown}
              className="bg-gray-800 px-4 py-2 rounded-md hover:bg-gray-700"
            >
              Profil
            </button>

            {dropdown && (
              <div className="absolute right-0 mt-2 w-52 bg-white text-black rounded-md shadow-lg py-2 text-sm">
                <Link to="/orders" className="block px-4 py-2 hover:bg-gray-100">Produk Diproses</Link>
                <Link to="/orders" className="block px-4 py-2 hover:bg-gray-100">Dalam Perjalanan</Link>
                <Link to="/orders" className="block px-4 py-2 hover:bg-gray-100">Sudah Sampai</Link>
                <Link to="/cart" className="block px-4 py-2 hover:bg-gray-100">Troli</Link>
                <Link to="/edit-profile" className="block px-4 py-2 hover:bg-gray-100">Edit Profil</Link>
                {isAdmin && (
                  <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-100">Dashboard Crew</Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Log Out
                </button>
                <div className="px-4 pt-2 text-[11px] text-gray-400 italic">xyrenefragrance</div>
              </div>
            )}
          </>
        ) : (
          <div className="flex gap-2">
            <Link to="/login" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">Sign In</Link>
            <Link to="/register" className="bg-green-600 px-4 py-2 rounded hover:bg-green-700">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
}