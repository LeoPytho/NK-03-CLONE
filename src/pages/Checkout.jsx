import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/checkout.css";

const products = [
  { id: 1, name: "Kaos JKT48 Birthday T-Shirt", price: 199000 },
  { id: 2, name: "Kaos JKT48 Hoodie", price: 250000 },
  { id: 3, name: "Kaos JKT48 Polo Shirt", price: 180000 },
];

function Checkout() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const storedData = sessionStorage.getItem("purchaseData");
    if (!storedData) {
      navigate("/");
    } else {
      setData(JSON.parse(storedData));
    }
  }, []);

  if (!data) return null;

  const product = products.find((p) => p.id === parseInt(data.product_id));
  const ongkir = 15000;
  const diskon = 20000;
  const kodeUnik = 123;
  const total = product.price + ongkir - diskon + kodeUnik;

  const handleFinalSubmit = () => {
    setPaying(true);

    const checkoutData = {
      ...data,
      ongkir,
      diskon,
      kode_unik: kodeUnik,
      total,
      product_name: product.name,
    };
    sessionStorage.setItem("checkoutData", JSON.stringify(checkoutData));

    setTimeout(() => {
      navigate("/success");
    }, 1500);
  };

  return (
    <div className="checkout container">
      <h2>Invoice Pembelian</h2>

      <div className="invoice-section">
        <h3>Data Pembeli</h3>
        <p><strong>Nama:</strong> {data.nama}</p>
        <p><strong>Email:</strong> {data.email}</p>
        <p><strong>No. Telpon:</strong> {data.telpon}</p>
        <p><strong>Alamat:</strong> {data.alamat}</p>
      </div>

      <div className="invoice-section">
        <h3>Rincian Produk</h3>
        <table className="invoice-table">
          <tbody>
            <tr>
              <td>Produk</td>
              <td>{product.name}</td>
            </tr>
            <tr>
              <td>Harga Produk</td>
              <td>Rp {product.price.toLocaleString()}</td>
            </tr>
            <tr>
              <td>Ongkir</td>
              <td>Rp {ongkir.toLocaleString()}</td>
            </tr>
            <tr>
              <td>Diskon</td>
              <td>- Rp {diskon.toLocaleString()}</td>
            </tr>
            <tr>
              <td>Kode Unik</td>
              <td>Rp {kodeUnik.toLocaleString()}</td>
            </tr>
            <tr className="total-row">
              <td><strong>Total Bayar</strong></td>
              <td><strong>Rp {total.toLocaleString()}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>

      <button className="btn-pay" onClick={handleFinalSubmit} disabled={paying}>
        {paying ? (
          <div className="btn-loader">
            <span className="loader-ring"></span>
            Memproses...
          </div>
        ) : (
          "Bayar Sekarang"
        )}
      </button>
    </div>
  );
}

export default Checkout;
