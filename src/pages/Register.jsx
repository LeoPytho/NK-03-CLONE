import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    alamat: '',
    nomor_hp: '',
    full_name: '',
    date_of_birth: '',
    gender: '',
    city: '',
    province: '',
    postal_code: '',
    country: 'Indonesia'
  });
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // Check if user is already registered
  useEffect(() => {
    const checkRegistration = () => {
      try {
        const registrationData = JSON.parse(sessionStorage.getItem('userRegistration') || 'null');
        if (registrationData && registrationData.isRegistered) {
          // User already registered, show message
          showToast('Anda sudah terdaftar!', 'success');
        }
      } catch (error) {
        console.error('Error checking registration status:', error);
      }
    };

    checkRegistration();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      showToast('Username harus diisi', 'error');
      return false;
    }

    if (formData.username.length < 3) {
      showToast('Username minimal 3 karakter', 'error');
      return false;
    }

    if (!formData.email.trim()) {
      showToast('Email harus diisi', 'error');
      return false;
    }

    if (!formData.password) {
      showToast('Password harus diisi', 'error');
      return false;
    }

    if (formData.password.length < 6) {
      showToast('Password minimal 6 karakter', 'error');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      showToast('Konfirmasi password tidak cocok', 'error');
      return false;
    }

    if (!formData.alamat.trim()) {
      showToast('Alamat harus diisi', 'error');
      return false;
    }

    if (!formData.nomor_hp.trim()) {
      showToast('Nomor HP harus diisi', 'error');
      return false;
    }

    if (!formData.full_name.trim()) {
      showToast('Nama lengkap harus diisi', 'error');
      return false;
    }

    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Prepare data for API
      const requestData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        alamat: formData.alamat,
        nomor_hp: formData.nomor_hp,
        full_name: formData.full_name,
        date_of_birth: formData.date_of_birth || null,
        gender: formData.gender || null,
        city: formData.city || null,
        province: formData.province || null,
        postal_code: formData.postal_code || null,
        country: formData.country
      };

      // Add URL params as requested
      const url = new URL('https://v2.jkt48connect.com/api/dashboard/register');
      url.searchParams.append('username', 'vzy');
      url.searchParams.append('password', 'vzy');

      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();

      if (response.ok && data.status) {
        // Registration successful
        const registrationData = {
          isRegistered: true,
          username: formData.username,
          registeredAt: new Date().toISOString(),
          userData: data.data || {}
        };

        // Store registration data in sessionStorage
        sessionStorage.setItem('userRegistration', JSON.stringify(registrationData));
        
        showToast('Registrasi berhasil!', 'success');
        
        // Show success message
        setTimeout(() => {
          showToast('Data telah tersimpan dengan aman.', 'success');
        }, 2000);

      } else {
        // Registration failed
        showToast(data.message || 'Registrasi gagal. Silakan coba lagi.', 'error');
      }

    } catch (error) {
      console.error('Registration error:', error);
      showToast('Terjadi kesalahan koneksi. Silakan coba lagi.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      alamat: '',
      nomor_hp: '',
      full_name: '',
      date_of_birth: '',
      gender: '',
      city: '',
      province: '',
      postal_code: '',
      country: 'Indonesia'
    });
  };

  if (loading) {
    return (
      <div className="container">
        <div className="register-loading">
          <div className="loading-spinner"></div>
          <p>Memproses registrasi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`toast toast-${toast.type}`}>
          <div className="toast-content">
            <div className="toast-icon">
              {toast.type === 'success' ? '✅' : '❌'}
            </div>
            <span className="toast-message">{toast.message}</span>
          </div>
        </div>
      )}

      <div className="register-container">
        <div className="register-header">
          <h1>Registrasi Akun</h1>
          <p>Buat akun baru untuk melanjutkan</p>
        </div>

        <div className="register-form-container">
          <div onSubmit={handleRegister} className="register-form">
            {/* Required Fields */}
            <div className="form-section">
              <h3>Data Wajib</h3>
              
              <div className="form-group">
                <label htmlFor="username">Username *</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Masukkan username"
                  className="form-input"
                  required
                  minLength={3}
                />
                <small className="form-hint">Minimal 3 karakter</small>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Masukkan email"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="full_name">Nama Lengkap *</label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  placeholder="Masukkan nama lengkap"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="nomor_hp">Nomor HP *</label>
                <input
                  type="tel"
                  id="nomor_hp"
                  name="nomor_hp"
                  value={formData.nomor_hp}
                  onChange={handleInputChange}
                  placeholder="Contoh: 081234567890"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="alamat">Alamat *</label>
                <textarea
                  id="alamat"
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleInputChange}
                  placeholder="Masukkan alamat lengkap"
                  className="form-input form-textarea"
                  required
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password *</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Masukkan password"
                  className="form-input"
                  required
                  minLength={6}
                />
                <small className="form-hint">Minimal 6 karakter</small>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Konfirmasi Password *</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Ulangi password"
                  className="form-input"
                  required
                />
                <small className="form-hint">Harus sama dengan password di atas</small>
              </div>
            </div>

            {/* Optional Fields */}
            <div className="form-section">
              <h3>Data Tambahan (Opsional)</h3>
              
              <div className="form-group">
                <label htmlFor="date_of_birth">Tanggal Lahir</label>
                <input
                  type="date"
                  id="date_of_birth"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="gender">Jenis Kelamin</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="">Pilih jenis kelamin</option>
                  <option value="male">Laki-laki</option>
                  <option value="female">Perempuan</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="city">Kota</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Masukkan kota"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="province">Provinsi</label>
                <input
                  type="text"
                  id="province"
                  name="province"
                  value={formData.province}
                  onChange={handleInputChange}
                  placeholder="Masukkan provinsi"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="postal_code">Kode Pos</label>
                <input
                  type="text"
                  id="postal_code"
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleInputChange}
                  placeholder="Masukkan kode pos"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="country">Negara</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="Indonesia"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="btn btn-primary btn-full"
                disabled={loading}
              >
                {loading ? 'Memproses...' : 'Daftar Sekarang'}
              </button>
              
              <button 
                type="button" 
                className="btn btn-outline btn-full"
                onClick={handleReset}
                disabled={loading}
              >
                Reset Form
              </button>
            </div>
          </div>

          <div className="register-info">
            <div className="info-card">
              <h3>Informasi Registrasi</h3>
              <ul className="info-list">
                <li>Username harus unik dan minimal 3 karakter</li>
                <li>Email harus valid dan unik</li>
                <li>Password harus minimal 6 karakter</li>
                <li>Nama lengkap, nomor HP, dan alamat wajib diisi</li>
                <li>Data tambahan bersifat opsional</li>
                <li>Data akan disimpan dengan aman</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 20px;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .register-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 300px;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #ff6b6b;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .register-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .register-header {
          background: linear-gradient(135deg, #ff6b6b, #ee5a52);
          color: white;
          text-align: center;
          padding: 40px 20px;
        }

        .register-header h1 {
          margin-bottom: 10px;
          font-size: 2rem;
          font-weight: bold;
        }

        .register-header p {
          font-size: 1.1rem;
          opacity: 0.9;
        }

        .register-form-container {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 30px;
          padding: 30px;
        }

        .register-form {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }

        .form-section {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-section h3 {
          color: #333;
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 10px;
          padding-bottom: 8px;
          border-bottom: 2px solid #ff6b6b;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-weight: 600;
          color: #333;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .form-input {
          padding: 12px 16px;
          border: 2px solid #e1e5e9;
          border-radius: 8px;
          font-size: 16px;
          transition: all 0.3s;
          background: #f8f9fa;
          font-family: inherit;
        }

        .form-textarea {
          resize: vertical;
          min-height: 80px;
        }

        .form-input:focus {
          outline: none;
          border-color: #ff6b6b;
          background: white;
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(255, 107, 107, 0.2);
        }

        .form-hint {
          color: #666;
          font-size: 12px;
          font-style: italic;
        }

        .form-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 20px;
        }

        .btn {
          padding: 14px 20px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          transition: all 0.3s;
          text-align: center;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-primary {
          background: linear-gradient(135deg, #ff6b6b, #ee5a52);
          color: white;
          border: 2px solid transparent;
        }

        .btn-primary:hover:not(:disabled) {
          background: linear-gradient(135deg, #ee5a52, #e04848);
        }

        .btn-outline {
          background: transparent;
          border: 2px solid #ff6b6b;
          color: #ff6b6b;
        }

        .btn-outline:hover:not(:disabled) {
          background: #ff6b6b;
          color: white;
        }

        .btn-full {
          width: 100%;
        }

        .register-info {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
        }

        .info-card {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 20px;
          border: 1px solid #e1e5e9;
          position: sticky;
          top: 20px;
        }

        .info-card h3 {
          margin-bottom: 15px;
          color: #333;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .info-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .info-list li {
          padding: 8px 0;
          color: #666;
          font-size: 14px;
          border-bottom: 1px solid #eee;
          position: relative;
          padding-left: 20px;
        }

        .info-list li:before {
          content: "•";
          color: #ff6b6b;
          font-weight: bold;
          position: absolute;
          left: 0;
        }

        .info-list li:last-child {
          border-bottom: none;
        }

        .toast {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 1000;
          max-width: 400px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          animation: slideIn 0.3s ease-out;
        }

        .toast-success {
          background: linear-gradient(135deg, #d4edda, #c3e6cb);
          border: 1px solid #c3e6cb;
          color: #155724;
        }

        .toast-error {
          background: linear-gradient(135deg, #f8d7da, #f5c6cb);
          border: 1px solid #f5c6cb;
          color: #721c24;
        }

        .toast-content {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          gap: 10px;
        }

        .toast-icon {
          font-size: 18px;
        }

        .toast-message {
          font-weight: 500;
          font-size: 14px;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @media (max-width: 768px) {
          .container {
            padding: 15px;
          }

          .register-header h1 {
            font-size: 1.8rem;
          }

          .register-form-container {
            grid-template-columns: 1fr;
            gap: 20px;
            padding: 20px;
          }

          .register-info {
            order: -1;
          }
        }

        @media (max-width: 480px) {
          .register-header {
            padding: 30px 15px;
          }

          .register-form-container {
            padding: 15px;
          }

          .form-input {
            font-size: 16px;
          }

          .btn {
            padding: 16px 20px;
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
}

export default Register;
