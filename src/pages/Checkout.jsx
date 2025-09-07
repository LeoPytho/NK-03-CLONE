import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/checkout.css";

function Checkout() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [product, setProduct] = useState(null);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const [loadingProduct, setLoadingProduct] = useState(true);

  const ongkir = 15000;
  const diskon = 20000;
  const kodeUnik = 123;

  useEffect(() => {
    if (sessionStorage.getItem("checkoutData")) {
      navigate("/success", { replace: true });
      return;
    }

    const storedData =
      sessionStorage.getItem("customerData") ||
      sessionStorage.getItem("purchaseData");

    if (!storedData) {
      navigate("/", { replace: true });
      return;
    }

    const parsedData = JSON.parse(storedData);
    setData(parsedData);

    const fetchProducts = async () => {
      try {
        const res = await fetch(
          "https://backend-seven-nu-19.vercel.app/api/merchant/products"
        );
        if (!res.ok) throw new Error("Gagal mengambil data produk");
        const productsData = await res.json();

        const selected = productsData.find(
          (p) =>
            p.id ===
            parseInt(parsedData.product_id || parsedData.product_id_ref)
        );

        if (!selected) throw new Error("Produk tidak ditemukan");
        setProduct(selected);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoadingProduct(false);
      }
    };

    fetchProducts();
  }, [navigate]);

  const total = product ? product.price + ongkir - diskon + kodeUnik : 0;

  const handleFinalSubmit = async () => {
    setPaying(true);
    setError("");

    const checkoutData = {
      ...data,
      ongkir,
      diskon,
      kode_unik: kodeUnik,
      total,
      product_name: product?.name,
    };

    try {
      const response = await fetch(
        "https://v2.jkt48connect.com/api/nayrakuen/customer-input",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: "vzy",
            password: "vzy",
            nama: data.nama,
            alamat: data.alamat,
            nomor_hp: data.nomor_hp,
            email: data.email,
            harga: total,
            product: product?.name || "Produk Default",
            member: data.member || "no",
          }),
        }
      );

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.message || "Terjadi kesalahan pada server");
      }

      sessionStorage.setItem("checkoutData", JSON.stringify(checkoutData));
      navigate("/success", { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.message);
      setPaying(false);
    }
  };

  if (!data || loadingProduct) {
    return (
      <div className="checkout container">
        <h2>Invoice Pembelian</h2>
        <div className="skeleton-section">
          <div className="skeleton skeleton-label"></div>
          <div className="skeleton skeleton-text"></div>
          <div className="skeleton skeleton-text"></div>
          <div className="skeleton skeleton-text"></div>
        </div>
        <div className="skeleton-section">
          <div className="skeleton skeleton-label"></div>
          <div className="skeleton skeleton-table-row"></div>
          <div className="skeleton skeleton-table-row"></div>
          <div className="skeleton skeleton-table-row"></div>
          <div className="skeleton skeleton-table-row"></div>
          <div className="skeleton skeleton-table-row"></div>
          <div className="skeleton skeleton-table-row total-row"></div>
        </div>
        <div className="skeleton skeleton-button"></div>
      </div>
    );
  }

  if (!product) return <p>Produk tidak ditemukan.</p>;

  return (
    <div className="checkout container">
      <h2>Invoice Pembelian</h2>

      <div className="invoice-section">
        <h3>Data Pembeli</h3>
        <p>
          <strong>Nama:</strong> {data.nama}
        </p>
        <p>
          <strong>Email:</strong> {data.email}
        </p>
        <p>
          <strong>No. HP:</strong> {data.nomor_hp}
        </p>
        <p>
          <strong>Alamat:</strong> {data.alamat}
        </p>
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
              <td>
                <strong>Total Bayar</strong>
              </td>
              <td>
                <strong>Rp {total.toLocaleString()}</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {error && <p className="error">{error}</p>}

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
