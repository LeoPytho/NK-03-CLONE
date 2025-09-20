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
  const [loadingOngkir, setLoadingOngkir] = useState(false);
  const [ongkir, setOngkir] = useState(0);
  const [ongkirError, setOngkirError] = useState("");

  const kodeUnik = 123;
  const originId = 17473; // ID asal (sesuaikan dengan lokasi toko)

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

  // Function untuk menghitung ongkir berdasarkan zona alamat
  const calculateShippingByZone = (alamat) => {
    const address = alamat.toLowerCase();
    
    // Zona 1: Jakarta & sekitarnya (15k)
    const zona1 = ['jakarta', 'depok', 'bekasi', 'tangerang', 'bogor'];
    if (zona1.some(city => address.includes(city))) {
      return 15000;
    }
    
    // Zona 2: Jawa Barat, Jawa Tengah, Jawa Timur (25k)
    const zona2 = [
      'bandung', 'surabaya', 'semarang', 'yogyakarta', 'solo', 'malang', 
      'kediri', 'madiun', 'pekalongan', 'tegal', 'purwokerto', 'cirebon',
      'jawa barat', 'jawa tengah', 'jawa timur'
    ];
    if (zona2.some(city => address.includes(city))) {
      return 25000;
    }
    
    // Zona 3: Sumatera, Kalimantan bagian selatan (35k)
    const zona3 = [
      'medan', 'palembang', 'pekanbaru', 'padang', 'bandar lampung',
      'jambi', 'bengkulu', 'banjarmasin', 'pontianak',
      'sumatera', 'kalimantan', 'lampung'
    ];
    if (zona3.some(city => address.includes(city))) {
      return 35000;
    }
    
    // Zona 4: Sulawesi, Bali, NTB, NTT (45k)
    const zona4 = [
      'makassar', 'manado', 'kendari', 'palu', 'denpasar', 'mataram',
      'kupang', 'bali', 'sulawesi', 'nusa tenggara'
    ];
    if (zona4.some(city => address.includes(city))) {
      return 45000;
    }
    
    // Zona 5: Papua, Maluku, Kalimantan utara (65k)
    const zona5 = [
      'jayapura', 'ambon', 'ternate', 'manokwari', 'sorong', 
      'papua', 'maluku', 'samarinda', 'balikpapan'
    ];
    if (zona5.some(city => address.includes(city))) {
      return 65000;
    }
    
    // Default: Jawa (25k) - karena kebanyakan pengiriman dalam pulau Jawa
    return 25000;
  };

  // Function untuk mencari destination ID melalui backend proxy (jika tersedia)
  const findDestinationViaProxy = async (alamat) => {
    try {
      // Coba gunakan backend sebagai proxy jika endpoint tersedia
      const response = await fetch(
        `https://backend-seven-nu-19.vercel.app/api/shipping/destination?search=${encodeURIComponent(alamat)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.destinationId) {
          return result.destinationId;
        }
      }
      
      throw new Error("Proxy not available");
    } catch (err) {
      console.log("Backend proxy tidak tersedia, menggunakan zona fallback");
      throw err;
    }
  };

  // Function untuk menghitung ongkir melalui backend proxy (jika tersedia)
  const calculateShippingViaProxy = async (destinationId) => {
    try {
      const response = await fetch(
        'https://backend-seven-nu-19.vercel.app/api/shipping/calculate',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            origin: originId,
            destination: destinationId,
            weight: 1000,
            courier: 'jne'
          })
        }
      );

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.cost) {
          return result.cost;
        }
      }
      
      throw new Error("Proxy calculation failed");
    } catch (err) {
      console.log("Backend proxy calculation tidak tersedia");
      throw err;
    }
  };

  // Effect untuk menghitung ongkir ketika data alamat tersedia
  useEffect(() => {
    if (data && data.alamat && !loadingProduct) {
      const fetchOngkir = async () => {
        setLoadingOngkir(true);
        setOngkirError("");
        
        try {
          // Coba gunakan backend proxy terlebih dahulu
          try {
            const destinationId = await findDestinationViaProxy(data.alamat);
            const shippingCost = await calculateShippingViaProxy(destinationId);
            setOngkir(shippingCost);
            return;
          } catch (proxyError) {
            console.log("Proxy gagal, menggunakan zona fallback");
          }
          
          // Fallback ke sistem zona
          const zoneCost = calculateShippingByZone(data.alamat);
          setOngkir(zoneCost);
          
        } catch (err) {
          console.error("Error fetching ongkir:", err);
          setOngkirError("Menggunakan ongkir berdasarkan zona");
          // Set default ongkir berdasarkan zona
          const zoneCost = calculateShippingByZone(data.alamat);
          setOngkir(zoneCost);
        } finally {
          setLoadingOngkir(false);
        }
      };

      fetchOngkir();
    }
  }, [data, loadingProduct]);

  // Hitung diskon dari data redeem atau gunakan default
  const getDiskonAmount = () => {
    if (data && data.discount_type && data.discount_value) {
      if (data.discount_type === 'nominal') {
        return data.discount_value;
      } else if (data.discount_type === 'percentage' && product) {
        return Math.round((product.price * data.discount_percentage) / 100);
      }
    }
    return 0; // Tidak ada diskon jika tidak ada redeem code
  };

  const diskon = getDiskonAmount();
  const total = product ? product.price + ongkir - diskon + kodeUnik : 0;

  const handleFinalSubmit = async () => {
    if (loadingOngkir) {
      setError("Mohon tunggu hingga ongkir selesai dihitung");
      return;
    }

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
        {data.redeem_code && (
          <p>
            <strong>Code Redeem:</strong> {data.redeem_code}
          </p>
        )}
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
              <td>Ongkir (JNE)</td>
              <td>
                {loadingOngkir ? (
                  <span style={{ fontSize: '12px', color: '#666' }}>
                    Menghitung...
                  </span>
                ) : (
                  <>
                    Rp {ongkir.toLocaleString()}
                    {ongkirError && (
                      <span style={{ fontSize: '11px', color: '#f39c12', display: 'block' }}>
                        (berdasarkan zona)
                      </span>
                    )}
                  </>
                )}
              </td>
            </tr>
            {diskon > 0 && (
              <tr>
                <td>
                  Diskon
                  {data.redeem_code && (
                    <span style={{ fontSize: '12px', color: '#27ae60', display: 'block' }}>
                      ({data.redeem_code})
                    </span>
                  )}
                </td>
                <td>- Rp {diskon.toLocaleString()}</td>
              </tr>
            )}
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

      {ongkirError && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#fff3cd', 
          border: '1px solid #ffeaa7', 
          borderRadius: '4px', 
          marginBottom: '15px',
          fontSize: '14px',
          color: '#856404'
        }}>
          <strong>Peringatan:</strong> {ongkirError}. Menggunakan ongkir default Rp {ongkir.toLocaleString()}.
        </div>
      )}

      {error && <p className="error">{error}</p>}

      <button 
        className="btn-pay" 
        onClick={handleFinalSubmit} 
        disabled={paying || loadingOngkir}
      >
        {paying ? (
          <div className="btn-loader">
            <span className="loader-ring"></span>
            Memproses...
          </div>
        ) : loadingOngkir ? (
          <div className="btn-loader">
            <span className="loader-ring"></span>
            Menghitung Ongkir...
          </div>
        ) : (
          "Bayar Sekarang"
        )}
      </button>
    </div>
  );
}

export default Checkout;
