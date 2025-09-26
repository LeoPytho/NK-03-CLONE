import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const navigate = useNavigate();

  // Check if user is already registered
  useEffect(() => {
    const checkRegistration = () => {
      try {
        const registrationData = JSON.parse(sessionStorage.getItem('userRegistration') || 'null');
        if (registrationData && registrationData.isRegistered) {
          // User already registered, redirect to home
          navigate('/');
        }
      } catch (error) {
        console.error('Error checking registration status:', error);
      }
    };

    checkRegistration();
  }, [navigate]);

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
    console.log('Validating form with data:', formData); // Debug log
    
    if (!formData.username.trim()) {
      showToast('Username harus diisi', 'error');
      return false;
    }

    if (formData.username.length < 3) {
      showToast('Username minimal 3 karakter', 'error');
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

    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    console.log('Form submitted with data:', formData); // Debug log
    
    if (!validateForm()) {
      console.log('Form validation failed'); // Debug log
      return;
    }

    setLoading(true);
    console.log('Starting registration process...'); // Debug log

    try {
      const requestBody = {
        username: formData.username.trim(),
        password: formData.password
      };
      
      console.log('Sending request to API with:', requestBody); // Debug log

      const response = await fetch('https://v2.jkt48connect.com/api/dashboard/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Response status:', response.status); // Debug log
      console.log('Response headers:', response.headers); // Debug log

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server response is not JSON');
      }

      const data = await response.json();
      console.log('Response data:', data); // Debug log

      if (response.ok) {
        // Check for different success indicators
        if (data.status === true || data.success === true || response.status === 200 || response.status === 201) {
          // Registration successful
          const registrationData = {
            isRegistered: true,
            username: formData.username.trim(),
            registeredAt: new Date().toISOString(),
            userData: data.data || data.user || {}
          };

          // Store registration data in sessionStorage
          sessionStorage.setItem('userRegistration', JSON.stringify(registrationData));
          
          showToast('Registrasi berhasil! Mengalihkan ke halaman utama...', 'success');
          
          // Redirect to home page after 2 seconds
          setTimeout(() => {
            navigate('/');
          }, 2000);

        } else {
          // Registration failed
          const errorMessage = data.message || data.error || 'Registrasi gagal. Silakan coba lagi.';
          showToast(errorMessage, 'error');
        }
      } else {
        // HTTP error status
        const errorMessage = data.message || data.error || `HTTP Error: ${response.status}`;
        showToast(errorMessage, 'error');
        console.error('HTTP Error:', response.status, errorMessage);
      }

    } catch (error) {
      console.error('Registration error details:', error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        showToast('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.', 'error');
      } else if (error.message.includes('JSON')) {
        showToast('Server memberikan respons yang tidak valid.', 'error');
      } else {
        showToast('Terjadi kesalahan: ' + error.message, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      username: '',
      password: '',
      confirmPassword: ''
    });
    console.log('Form reset'); // Debug log
  };

  // Debug: Log form data changes
  useEffect(() => {
    console.log('Form data changed:', formData);
  }, [formData]);

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
          <form onSubmit={handleRegister} className="register-form" noValidate>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Masukkan username"
                className="form-input"
                disabled={loading}
                autoComplete="username"
              />
              <small className="form-hint">Minimal 3 karakter</small>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Masukkan password"
                className="form-input"
                disabled={loading}
                autoComplete="new-password"
              />
              <small className="form-hint">Minimal 6 karakter</small>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Konfirmasi Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Ulangi password"
                className="form-input"
                disabled={loading}
                autoComplete="new-password"
              />
              <small className="form-hint">Harus sama dengan password di atas</small>
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

            {/* Debug info - remove in production */}
            <div style={{ marginTop: '20px', padding: '10px', background: '#f0f0f0', borderRadius: '4px', fontSize: '12px' }}>
              <strong>Debug Info:</strong>
              <div>Username: "{formData.username}" (length: {formData.username.length})</div>
              <div>Password: {"*".repeat(formData.password.length)} (length: {formData.password.length})</div>
              <div>Confirm Password: {"*".repeat(formData.confirmPassword.length)} (length: {formData.confirmPassword.length})</div>
              <div>Loading: {loading ? 'Yes' : 'No'}</div>
            </div>
          </form>

          <div className="register-info">
            <div className="info-card">
              <h3>Informasi Registrasi</h3>
              <ul className="info-list">
                <li>Username harus unik dan minimal 3 karakter</li>
                <li>Password harus minimal 6 karakter</li>
                <li>Pastikan konfirmasi password sesuai</li>
                <li>Data akan disimpan dengan aman</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .container {
          max-width: 800px;
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
          gap: 20px;
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
        }

        .form-input:focus {
          outline: none;
          border-color: #ff6b6b;
          background: white;
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(255, 107, 107, 0.2);
        }

        .form-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
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
