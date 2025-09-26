import React, { useState, useEffect } from 'react';
import { User, Edit, Save, X, MapPin, Phone, Mail, Calendar, Building, Globe, Shield, Activity, Clock, Eye, EyeOff } from 'lucide-react';
import './ProfilePage.css'; // Import the CSS file

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [editableData, setEditableData] = useState({});

  // Get authentication data
  const getAuthData = () => {
    try {
      const loginData = JSON.parse(sessionStorage.getItem('userLogin') || '{}');
      return {
        token: loginData.token,
        profileId: loginData.user?.profile_id
      };
    } catch {
      return { token: null, profileId: null };
    }
  };

  // Fetch profile data
  const fetchProfile = async () => {
    const { token } = getAuthData();
    
    if (!token) {
      setError('Tidak ada token autentikasi. Silakan login kembali.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://v2.jkt48connect.com/api/dashboard/profiles/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok && data.status) {
        setProfile(data.data);
        setEditableData({
          username: data.data.username || '',
          email: data.data.email || '',
          full_name: data.data.full_name || '',
          alamat: data.data.alamat || '',
          nomor_hp: data.data.nomor_hp || '',
          date_of_birth: data.data.date_of_birth || '',
          gender: data.data.gender || '',
          city: data.data.city || '',
          province: data.data.province || '',
          postal_code: data.data.postal_code || '',
          country: data.data.country || 'Indonesia',
          bio: data.data.bio || '',
          occupation: data.data.occupation || '',
          company: data.data.company || '',
          website: data.data.website || ''
        });
      } else {
        setError(data.message || 'Gagal memuat data profil');
      }
    } catch (error) {
      console.error('Fetch profile error:', error);
      setError('Terjadi kesalahan saat memuat profil');
    } finally {
      setLoading(false);
    }
  };

  // Update profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const { token, profileId } = getAuthData();

    if (!token || !profileId) {
      setError('Tidak ada token autentikasi. Silakan login kembali.');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`https://v2.jkt48connect.com/api/dashboard/profiles/${profileId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editableData)
      });

      const data = await response.json();

      if (response.ok && data.status) {
        setProfile(data.data);
        setSuccess('Profil berhasil diperbarui');
        setEditing(false);
      } else {
        setError(data.message || 'Gagal memperbarui profil');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      setError('Terjadi kesalahan saat memperbarui profil');
    } finally {
      setSaving(false);
    }
  };

  // Change password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    const { token, profileId } = getAuthData();

    if (!token || !profileId) {
      setError('Tidak ada token autentikasi. Silakan login kembali.');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Konfirmasi password tidak cocok');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Password baru minimal 6 karakter');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`https://v2.jkt48connect.com/api/dashboard/profiles/${profileId}/change-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();

      if (response.ok && data.status) {
        setSuccess('Password berhasil diubah');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setError(data.message || 'Gagal mengubah password');
      }
    } catch (error) {
      console.error('Change password error:', error);
      setError('Terjadi kesalahan saat mengubah password');
    } finally {
      setSaving(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Get member status badge class
  const getMemberStatusClass = (status) => {
    switch (status) {
      case 'premium': return 'badge badge-premium';
      case 'vip': return 'badge badge-vip';
      case 'basic': return 'badge badge-basic';
      default: return 'badge badge-basic';
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Memuat profil...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="error-container">
        <div className="error-content">
          <div className="error-icon">⚠️</div>
          <h2 className="error-title">Profil Tidak Ditemukan</h2>
          <p className="error-message">{error || 'Gagal memuat data profil'}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn btn-primary"
          >
            Muat Ulang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-wrapper">
        {/* Header */}
        <div className="profile-header">
          <div className="profile-header-content">
            <div className="profile-header-info">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div className="profile-avatar">
                  {profile.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="profile-details">
                  <h1>{profile.full_name}</h1>
                  <p className="profile-username">@{profile.username}</p>
                  <div className="profile-badges">
                    <span className={getMemberStatusClass(profile.status_member)}>
                      {profile.status_member?.toUpperCase() || 'BASIC'}
                    </span>
                    {profile.is_verified && (
                      <span className="badge badge-verified">
                        <Shield style={{ width: '12px', height: '12px' }} />
                        Terverifikasi
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setEditing(!editing)}
                className="edit-button"
                disabled={saving}
              >
                {editing ? <X style={{ width: '16px', height: '16px' }} /> : <Edit style={{ width: '16px', height: '16px' }} />}
                <span>{editing ? 'Batal' : 'Edit Profil'}</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="profile-tabs">
            <div className="tabs-list">
              <button
                onClick={() => setActiveTab('profile')}
                className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
              >
                <User style={{ width: '16px', height: '16px' }} />
                Profil
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`tab-button ${activeTab === 'security' ? 'active' : ''}`}
              >
                <Shield style={{ width: '16px', height: '16px' }} />
                Keamanan
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`tab-button ${activeTab === 'activity' ? 'active' : ''}`}
              >
                <Activity style={{ width: '16px', height: '16px' }} />
                Aktivitas
              </button>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="alert alert-error">
            <X style={{ width: '20px', height: '20px' }} />
            <div className="alert-content">
              <p className="alert-message">{error}</p>
            </div>
            <button
              onClick={() => setError('')}
              className="alert-close"
            >
              <X style={{ width: '16px', height: '16px' }} />
            </button>
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <div style={{ width: '20px', height: '20px' }}>✓</div>
            <div className="alert-content">
              <p className="alert-message">{success}</p>
            </div>
            <button
              onClick={() => setSuccess('')}
              className="alert-close"
            >
              <X style={{ width: '16px', height: '16px' }} />
            </button>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'profile' && (
          <div className={`profile-content ${!editing ? 'two-column' : ''}`}>
            {/* Main Profile Info */}
            <div>
              <div className="profile-card">
                <h2>Informasi Pribadi</h2>
                
                {editing ? (
                  <form onSubmit={handleUpdateProfile} className="profile-form">
                    <div className="form-grid two-column">
                      <div className="form-group">
                        <label className="form-label">Username</label>
                        <input
                          type="text"
                          name="username"
                          value={editableData.username}
                          onChange={handleInputChange}
                          className="form-input"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={editableData.email}
                          onChange={handleInputChange}
                          className="form-input"
                          required
                        />
                      </div>

                      <div className="form-group full-width">
                        <label className="form-label">Nama Lengkap</label>
                        <input
                          type="text"
                          name="full_name"
                          value={editableData.full_name}
                          onChange={handleInputChange}
                          className="form-input"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Nomor HP</label>
                        <input
                          type="tel"
                          name="nomor_hp"
                          value={editableData.nomor_hp}
                          onChange={handleInputChange}
                          className="form-input"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Tanggal Lahir</label>
                        <input
                          type="date"
                          name="date_of_birth"
                          value={editableData.date_of_birth}
                          onChange={handleInputChange}
                          className="form-input"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Jenis Kelamin</label>
                        <select
                          name="gender"
                          value={editableData.gender}
                          onChange={handleInputChange}
                          className="form-input form-select"
                        >
                          <option value="">Pilih jenis kelamin</option>
                          <option value="male">Laki-laki</option>
                          <option value="female">Perempuan</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Kota</label>
                        <input
                          type="text"
                          name="city"
                          value={editableData.city}
                          onChange={handleInputChange}
                          className="form-input"
                        />
                      </div>

                      <div className="form-group full-width">
                        <label className="form-label">Alamat</label>
                        <textarea
                          name="alamat"
                          value={editableData.alamat}
                          onChange={handleInputChange}
                          rows={3}
                          className="form-input form-textarea"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Provinsi</label>
                        <input
                          type="text"
                          name="province"
                          value={editableData.province}
                          onChange={handleInputChange}
                          className="form-input"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Kode Pos</label>
                        <input
                          type="text"
                          name="postal_code"
                          value={editableData.postal_code}
                          onChange={handleInputChange}
                          className="form-input"
                        />
                      </div>

                      <div className="form-group full-width">
                        <label className="form-label">Bio</label>
                        <textarea
                          name="bio"
                          value={editableData.bio}
                          onChange={handleInputChange}
                          rows={3}
                          className="form-input form-textarea"
                          placeholder="Ceritakan sedikit tentang diri Anda..."
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Pekerjaan</label>
                        <input
                          type="text"
                          name="occupation"
                          value={editableData.occupation}
                          onChange={handleInputChange}
                          className="form-input"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Perusahaan</label>
                        <input
                          type="text"
                          name="company"
                          value={editableData.company}
                          onChange={handleInputChange}
                          className="form-input"
                        />
                      </div>

                      <div className="form-group full-width">
                        <label className="form-label">Website</label>
                        <input
                          type="url"
                          name="website"
                          value={editableData.website}
                          onChange={handleInputChange}
                          className="form-input"
                          placeholder="https://"
                        />
                      </div>
                    </div>

                    <div className="form-actions">
                      <button
                        type="button"
                        onClick={() => setEditing(false)}
                        className="btn btn-secondary"
                        disabled={saving}
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={saving}
                      >
                        {saving ? (
                          <div className="loading-spinner" style={{ width: '16px', height: '16px', margin: '0' }}></div>
                        ) : (
                          <Save style={{ width: '16px', height: '16px' }} />
                        )}
                        <span>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <div>
                    <div className="profile-info-grid">
                      <div className="profile-info-item">
                        <User className="profile-info-icon" />
                        <div className="profile-info-content">
                          <p>Username</p>
                          <p>{profile.username}</p>
                        </div>
                      </div>

                      <div className="profile-info-item">
                        <Mail className="profile-info-icon" />
                        <div className="profile-info-content">
                          <p>Email</p>
                          <p>{profile.email}</p>
                          {profile.email_verified && (
                            <span className="profile-info-verified">✓ Terverifikasi</span>
                          )}
                        </div>
                      </div>

                      <div className="profile-info-item">
                        <Phone className="profile-info-icon" />
                        <div className="profile-info-content">
                          <p>Nomor HP</p>
                          <p>{profile.nomor_hp}</p>
                          {profile.phone_verified && (
                            <span className="profile-info-verified">✓ Terverifikasi</span>
                          )}
                        </div>
                      </div>

                      <div className="profile-info-item">
                        <Calendar className="profile-info-icon" />
                        <div className="profile-info-content">
                          <p>Tanggal Lahir</p>
                          <p>{formatDate(profile.date_of_birth)}</p>
                        </div>
                      </div>

                      <div className="profile-info-item full-width">
                        <MapPin className="profile-info-icon" />
                        <div className="profile-info-content">
                          <p>Alamat</p>
                          <p>
                            {profile.alamat}
                            {profile.city && `, ${profile.city}`}
                            {profile.province && `, ${profile.province}`}
                          </p>
                        </div>
                      </div>

                      {profile.occupation && (
                        <div className="profile-info-item">
                          <Building className="profile-info-icon" />
                          <div className="profile-info-content">
                            <p>Pekerjaan</p>
                            <p>{profile.occupation}</p>
                            {profile.company && (
                              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>di {profile.company}</p>
                            )}
                          </div>
                        </div>
                      )}

                      {profile.website && (
                        <div className="profile-info-item">
                          <Globe className="profile-info-icon" />
                          <div className="profile-info-content">
                            <p>Website</p>
                            <a 
                              href={profile.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="profile-info-link"
                            >
                              {profile.website}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>

                    {profile.bio && (
                      <div className="profile-bio">
                        <p>Bio</p>
                        <p>{profile.bio}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Profile Stats - Only show in view mode */}
            {!editing && (
              <div className="sidebar-cards">
                <div className="profile-card">
                  <h3>Status Akun</h3>
                  <div className="status-list">
                    <div className="status-item">
                      <span>Status Member</span>
                      <span className={getMemberStatusClass(profile.status_member)}>
                        {profile.status_member?.toUpperCase() || 'BASIC'}
                      </span>
                    </div>
                    <div className="status-item">
                      <span>Tipe Akun</span>
                      <span>{profile.account_type}</span>
                    </div>
                    <div className="status-item">
                      <span>Status Aktif</span>
                      <span className={`badge ${profile.is_active ? 'badge-verified' : 'badge-basic'}`}>
                        {profile.is_active ? 'Aktif' : 'Tidak Aktif'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="profile-card">
                  <h3>Aktivitas</h3>
                  <div className="status-list">
                    <div className="profile-info-item">
                      <Clock className="profile-info-icon" />
                      <div className="profile-info-content">
                        <p>Login Terakhir</p>
                        <p>{formatDate(profile.last_login)}</p>
                      </div>
                    </div>
                    <div className="profile-info-item">
                      <Activity className="profile-info-icon" />
                      <div className="profile-info-content">
                        <p>Total Login</p>
                        <p>{profile.login_count || 0} kali</p>
                      </div>
                    </div>
                    <div className="profile-info-item">
                      <Calendar className="profile-info-icon" />
                      <div className="profile-info-content">
                        <p>Bergabung</p>
                        <p>{formatDate(profile.created_at)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'security' && (
          <div style={{ maxWidth: '32rem' }}>
            <div className="profile-card">
              <h2>Ubah Password</h2>
              
              <form onSubmit={handleChangePassword} className="profile-form">
                <div className="form-group">
                  <label className="form-label">Password Saat Ini</label>
                  <div className="password-input-container">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="form-input"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="password-toggle"
                    >
                      {showPassword ? (
                        <EyeOff style={{ width: '16px', height: '16px' }} />
                      ) : (
                        <Eye style={{ width: '16px', height: '16px' }} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Password Baru</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="form-input"
                    minLength={6}
                    required
                  />
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>Minimal 6 karakter</p>
                </div>

                <div className="form-group">
                  <label className="form-label">Konfirmasi Password Baru</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="form-input"
                    minLength={6}
                    required
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                  >
                    {saving ? (
                      <div className="loading-spinner" style={{ width: '16px', height: '16px', margin: '0' }}></div>
                    ) : (
                      <Shield style={{ width: '16px', height: '16px' }} />
                    )}
                    <span>{saving ? 'Mengubah...' : 'Ubah Password'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Security Status */}
            <div className="profile-card" style={{ marginTop: '1.5rem' }}>
              <h3>Status Keamanan</h3>
              <div className="security-status-list">
                <div className="security-status-item">
                  <div className="security-status-info">
                    <Mail style={{ width: '20px', height: '20px', color: '#9ca3af' }} />
                    <div className="security-status-details">
                      <p>Verifikasi Email</p>
                      <p>Email Anda {profile.email_verified ? 'sudah' : 'belum'} diverifikasi</p>
                    </div>
                  </div>
                  <span className={`badge ${profile.email_verified ? 'badge-verified' : 'badge-premium'}`}>
                    {profile.email_verified ? 'Terverifikasi' : 'Belum Verifikasi'}
                  </span>
                </div>

                <div className="security-status-item">
                  <div className="security-status-info">
                    <Phone style={{ width: '20px', height: '20px', color: '#9ca3af' }} />
                    <div className="security-status-details">
                      <p>Verifikasi Nomor HP</p>
                      <p>Nomor HP Anda {profile.phone_verified ? 'sudah' : 'belum'} diverifikasi</p>
                    </div>
                  </div>
                  <span className={`badge ${profile.phone_verified ? 'badge-verified' : 'badge-premium'}`}>
                    {profile.phone_verified ? 'Terverifikasi' : 'Belum Verifikasi'}
                  </span>
                </div>

                <div className="security-status-item">
                  <div className="security-status-info">
                    <Shield style={{ width: '20px', height: '20px', color: '#9ca3af' }} />
                    <div className="security-status-details">
                      <p>Akun Terverifikasi</p>
                      <p>Status verifikasi akun keseluruhan</p>
                    </div>
                  </div>
                  <span className={`badge ${profile.is_verified ? 'badge-verified' : 'badge-basic'}`}>
                    {profile.is_verified ? 'Terverifikasi' : 'Belum Verifikasi'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="profile-card">
            <h2>Aktivitas Akun</h2>
            
            <div className="activity-stats">
              <div className="activity-stat-card blue">
                <div className="activity-stat-info">
                  <p>Total Login</p>
                  <p>{profile.login_count || 0}</p>
                </div>
                <Activity className="activity-stat-icon" />
              </div>

              <div className="activity-stat-card green">
                <div className="activity-stat-info">
                  <p>Login Terakhir</p>
                  <p style={{ fontSize: '1.125rem' }}>
                    {profile.last_login ? formatDate(profile.last_login) : 'Belum pernah'}
                  </p>
                </div>
                <Clock className="activity-stat-icon" />
              </div>

              <div className="activity-stat-card purple">
                <div className="activity-stat-info">
                  <p>Bergabung</p>
                  <p style={{ fontSize: '1.125rem' }}>{formatDate(profile.created_at)}</p>
                </div>
                <Calendar className="activity-stat-icon" />
              </div>
            </div>

            <div className="activity-history">
              <h3>Riwayat Aktivitas</h3>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon-container green">
                    <User className="activity-icon" />
                  </div>
                  <div className="activity-content">
                    <p>Akun dibuat</p>
                    <p>{formatDate(profile.created_at)}</p>
                  </div>
                </div>

                {profile.last_login && (
                  <div className="activity-item">
                    <div className="activity-icon-container blue">
                      <Activity className="activity-icon" />
                    </div>
                    <div className="activity-content">
                      <p>Login terakhir</p>
                      <p>{formatDate(profile.last_login)}</p>
                    </div>
                  </div>
                )}

                {profile.updated_at !== profile.created_at && (
                  <div className="activity-item">
                    <div className="activity-icon-container yellow">
                      <Edit className="activity-icon" />
                    </div>
                    <div className="activity-content">
                      <p>Profil diperbarui</p>
                      <p>{formatDate(profile.updated_at)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
