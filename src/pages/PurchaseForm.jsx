import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/purchase-form.css";

function PurchaseForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", nama: "", telpon: "", alamat: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    sessionStorage.setItem("purchaseData", JSON.stringify({ ...form, product_id: id }));

    navigate("/checkout");
  };

  return (
    <div className="purchase-form container">
      <h2>Formulir Pembelian</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Nama
          <input type="text" name="nama" value={form.nama} onChange={handleChange} required />
        </label>
        <label>
          No. Telpon
          <input type="tel" name="telpon" value={form.telpon} onChange={handleChange} required />
        </label>
        <label>
          Alamat
          <textarea name="alamat" value={form.alamat} onChange={handleChange} rows="4" required />
        </label>
        <button type="submit">Lanjutkan</button>
      </form>
    </div>
  );
}

export default PurchaseForm;
