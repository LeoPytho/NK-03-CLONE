import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/purchase-form.css";

function PurchaseForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    nama: "",
    telpon: "",
    alamat: "",
    fanbase_membership: false,
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.nama || !form.telpon || !form.alamat) {
      setError("Harap lengkapi semua field wajib.");
      return;
    }

    setSubmitting(true);

    try {
      // Simpan data pembelian ke sessionStorage
      sessionStorage.setItem(
        "purchaseData",
        JSON.stringify({
          product_id: id,
          email: form.email,
          nama: form.nama,
          telpon: form.telpon,
          alamat: form.alamat,
          fanbase_membership: form.fanbase_membership ? "yes" : "no",
        })
      );

      navigate("/checkout");
    } catch (err) {
      setError("Terjadi kesalahan saat menyimpan data.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="purchase-form container">
      <h2>Formulir Pembelian</h2>

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
              required
            />
          </label>
          <label>
            No. Telpon
            <input
              type="tel"
              name="telpon"
              value={form.telpon}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Alamat
            <textarea
              name="alamat"
              value={form.alamat}
              onChange={handleChange}
              rows="4"
              required
            />
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="fanbase_membership"
              checked={form.fanbase_membership}
              onChange={handleChange}
            />
            anggota fanbase
          </label>

          {error && <p className="error">{error}</p>}

          <button type="submit" disabled={submitting}>
            {submitting ? (
              <div className="btn-loader">
                <span className="loader-ring"></span>
                Menyimpan...
              </div>
            ) : (
              "Selanjutnya"
            )}
          </button>
        </form>
      )}
    </div>
  );
}

export default PurchaseForm;
