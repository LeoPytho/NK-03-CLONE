import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/purchase-form.css";

function PurchaseForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    nama: "",
    nomor_hp: "",
    alamat: "",
    detail_alamat: "", // Tambahan untuk detail alamat
    member: "non", // default non-anggota
  });
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchingAddress, setSearchingAddress] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `https://backend-seven-nu-19.vercel.app/api/merchant/products/${id}`
        );
        const data = await res.json();
        if (res.ok) {
          setProduct(data);
        } else {
          setError("Produk tidak ditemukan.");
        }
      } catch (err) {
        console.error("Gagal ambil detail produk:", err);
        setError("Gagal mengambil data produk.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Function untuk search alamat dari HERE Maps API
  const searchAddress = async (query) => {
    if (query.length < 3) {
      setAddressSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setSearchingAddress(true);
    try {
      const apiKey = "ZcgqQFaE9azO73XJTasyhgHSVBST-aHpmj-VF4UM6sY"; // ganti dengan API Key HERE kamu
      const url = `https://autosuggest.search.hereapi.com/v1/autosuggest?at=-6.2,106.8&q=${encodeURIComponent(
        query
      )}&limit=5&apiKey=${apiKey}`;

      const res = await fetch(url);
      const data = await res.json();

      // Filter hanya alamat/tempat yang punya address
      const suggestions = data.items.filter(
        (item) => item.address && item.address.label
      );

      setAddressSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } catch (err) {
      console.error("Error searching address:", err);
      setAddressSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setSearchingAddress(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });

    // Trigger address search when alamat field changes
    if (name === "alamat") {
      searchAddress(value);
    }
  };

  // Function untuk select alamat dari suggestion
  const selectAddress = (selectedAddress) => {
    setForm({
      ...form,
      alamat: selectedAddress.address.label,
    });
    setShowSuggestions(false);
    setAddressSuggestions([]);
    console.log(
      "Selected address - Lat:",
      selectedAddress.position?.lat,
      "Lon:",
      selectedAddress.position?.lng
    );
  };

  // Function untuk hide suggestions ketika click outside
  const handleAddressBlur = () => {
    // Delay untuk memungkinkan click pada suggestion
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.nama || !form.nomor_hp || !form.alamat) {
      setError("Harap lengkapi semua field wajib.");
      return;
    }

    if (!product) {
      setError("Produk tidak valid.");
      return;
    }

    setSubmitting(true);

    try {
      const params = new URLSearchParams({
        username: "vzy",
        password: "vzy",
        email: form.email,
        limit: 1,
      });

      const res = await fetch(
        `https://v2.jkt48connect.com/api/nayrakuen/cari-data?${params}`
      );
      const result = await res.json();

      let dataToSave;

      // Gabungkan alamat dan detail alamat
      const fullAddress = form.detail_alamat
        ? `${form.alamat}, ${form.detail_alamat}`
        : form.alamat;

      if (result.status && result.count > 0) {
        const existing = result.data[0];
        dataToSave = {
          customer_id: existing.customer_id,
          nama: existing.nama,
          alamat: fullAddress,
          nomor_hp: existing.nomor_hp,
          email: existing.email,
          member: existing.member,
          product_id: id,
        };
      } else {
        dataToSave = {
          product_id: id,
          email: form.email,
          nama: form.nama,
          nomor_hp: form.nomor_hp,
          alamat: fullAddress,
          member: form.member,
        };
      }

      sessionStorage.setItem("purchaseData", JSON.stringify(dataToSave));
      navigate("/checkout");
    } catch (err) {
      setError("Terjadi kesalahan koneksi.");
      console.error("Error checking email:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="purchase-form">
      <h2 className="form-title">Form Penginputan Pembelian</h2>

      {loading ? (
        <div className="skeleton-form">
          <div className="skeleton skeleton-label"></div>
          <div className="skeleton skeleton-input"></div>
          <div className="skeleton skeleton-label"></div>
          <div className="skeleton skeleton-input"></div>
          <div className="skeleton skeleton-label"></div>
          <div className="skeleton skeleton-input"></div>
          <div className="skeleton skeleton-label"></div>
          <div className="skeleton skeleton-textarea"></div>
          <div className="skeleton skeleton-button"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="contoh: adam@gmail.com"
              required
            />
          </label>
          <label>
            Nama
            <input
              type="text"
              name="nama"
              value={form.nama}
              onChange={handleChange}
              placeholder="contoh: Adam"
              required
            />
          </label>
          <label>
            No Telepon
            <input
              type="tel"
              name="nomor_hp"
              value={form.nomor_hp}
              onChange={handleChange}
              placeholder="contoh: 0898XXXXXXXX"
              required
            />
          </label>
          
          {/* Address field with HERE Maps integration */}
          <label>
            Alamat Utama
            <div className="address-input-container" style={{ position: 'relative' }}>
              <input
                type="text"
                name="alamat"
                value={form.alamat}
                onChange={handleChange}
                onBlur={handleAddressBlur}
                placeholder="Ketik alamat... (minimal 3 karakter)"
                required
                style={{ width: '100%' }}
              />
              {searchingAddress && (
                <div className="address-loading" style={{ 
                  position: 'absolute', 
                  right: '10px', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  fontSize: '12px',
                  color: '#666'
                }}>
                  Mencari...
                </div>
              )}
              
              {/* Address suggestions dropdown */}
              {showSuggestions && addressSuggestions.length > 0 && (
                <ul className="address-suggestions" style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: 'white',
                  border: '1px solid #ddd',
                  borderTop: 'none',
                  maxHeight: '200px',
                  overflowY: 'auto',
                  zIndex: 1000,
                  listStyle: 'none',
                  margin: 0,
                  padding: 0,
                  borderRadius: '0 0 4px 4px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  {addressSuggestions.map((address, index) => (
                    <li
                      key={index}
                      onClick={() => selectAddress(address)}
                      style={{
                        padding: '10px',
                        cursor: 'pointer',
                        borderBottom: '1px solid #eee',
                        fontSize: '14px',
                        lineHeight: '1.4'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                    >
                      {address.address.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </label>

          {/* Detail alamat field */}
          <label>
            Detail Alamat (Opsional)
            <textarea
              name="detail_alamat"
              value={form.detail_alamat}
              onChange={handleChange}
              placeholder="contoh: Blok A No. 15, Lantai 2, dekat Indomaret"
              rows="2"
              style={{ resize: 'vertical' }}
            />
            <small style={{ fontSize: '12px', color: '#666', marginTop: '5px', display: 'block' }}>
              Tambahkan detail seperti nomor rumah, blok, lantai, patokan, dll.
            </small>
          </label>

          <label>
            Status Anggota Fanbase
            <select
              name="member"
              value={form.member}
              onChange={handleChange}
              required
            >
              <option value="non">Bukan Anggota</option>
              <option value="yes">Anggota Fanbase</option>
            </select>
          </label>

          {error && <p className="error">{error}</p>}

          <div className="button-container">
            <button type="submit" disabled={submitting}>
              {submitting ? (
                <div className="btn-loader">
                  <span className="loader-ring"></span>
                  Mengecek...
                </div>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default PurchaseForm;
