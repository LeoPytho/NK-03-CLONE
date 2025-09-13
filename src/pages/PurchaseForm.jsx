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
    member: "non", // default non-anggota
  });
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
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

      if (result.status && result.count > 0) {
        const existing = result.data[0];
        dataToSave = {
          customer_id: existing.customer_id,
          nama: existing.nama,
          alamat: existing.alamat,
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
          alamat: form.alamat,
          member: form.member, // langsung ambil value select
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
          <label>
            Alamat
            <textarea
              name="alamat"
              value={form.alamat}
              onChange={handleChange}
              placeholder="contoh: Jl. Medan Merdeka Timur No.XX"
              rows="3"
              required
            />
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
