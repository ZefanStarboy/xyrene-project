import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  const isSoldOut = product.stok <= 0;
  const discounted = product.diskon && product.diskon > 0;
  const hargaDiskon = discounted
    ? Math.round(product.harga * (1 - product.diskon / 100))
    : product.harga;

  return (
    <div
      className={`rounded-xl overflow-hidden shadow-lg border ${
        isSoldOut ? 'opacity-40 pointer-events-none' : 'hover:shadow-xl'
      } transition`}
    >
      <Link to={`/produk/${product.id}`}>
        <img
          src={product.gambar_url}
          alt={product.nama}
          className="w-full h-64 object-cover"
        />

        <div className="p-4 bg-black bg-opacity-80 text-white">
          <h3 className="text-lg font-semibold mb-1">{product.nama}</h3>

          {discounted ? (
            <div className="mb-1">
              <span className="line-through text-sm text-gray-400">
                Rp {product.harga.toLocaleString('id-ID')}
              </span>{' '}
              <span className="text-green-400 font-bold">
                Rp {hargaDiskon.toLocaleString('id-ID')}
              </span>
            </div>
          ) : (
            <p className="mb-1">Rp {product.harga.toLocaleString('id-ID')}</p>
          )}

          {product.diskon > 0 && (
            <p className="text-sm text-green-400">Diskon {product.diskon}%</p>
          )}

          {isSoldOut && (
            <div className="mt-2 text-red-400 font-bold">SOLD OUT</div>
          )}
        </div>
      </Link>
    </div>
  );
}