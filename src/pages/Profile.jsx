import React, { useState, useEffect } from 'react';
import { User, Edit, Save, X, MapPin, Phone, Mail, Calendar, Building, Globe, Shield, Activity, Clock, Eye, EyeOff, Search } from 'lucide-react';
import './ProfilePage.css'; // Import the CSS file
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [searchMode, setSearchMode] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({
    searchType: 'username',
    searchValue: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [editableData, setEditableData] = useState({});

  const navigate = useNavigate();

  // Get data from localStorage
  const getStoredData = () => {
    try {
      // Check for successful registration data first
      const successfulReg = localStorage.getItem('successfulRegistration');
      if (successfulReg) {
        const regData = JSON.parse(successfulReg);
        return {
          username: regData.username,
          email: regData.email,
          full_name: regData.full_name
        };
      }

      // Check for current form data
      const formData = localStorage.getItem('registerFormData');
      if (formData) {
        const parsedData = JSON.parse(formData);
        return parsedData;
      }

      // Check session storage for login data
      const loginData = sessionStorage.getItem('userLogin');
      if (loginData) {
        const parsedLogin = JSON.parse(loginData);
        return {
          username: parsedLogin.user?.username,
          email: parsedLogin.user?.email,
          full_name: parsedLogin.user?.full_name
        };
      }

      return null;
    } catch (error) {
      console.error('Error getting stored data:', error);
      return null;
    }
  };

  // Fetch profile data using public API
  const fetchProfile = async (searchType, searchValue) => {
    setLoading(true);
    setError('');

    try {
      let url = '';
      
      // Construct URL based on search type
      switch (searchType) {
        case 'username':
          url = `https://v2.jkt48connect.com/api/profiles/public/profile/username/${encodeURIComponent(searchValue)}`;
          break;
        case 'email':
          url = `https://v2.jkt48connect.com/api/profiles/public/profile/email/${encodeURIComponent(searchValue)}`;
          break;
        case 'name':
          url = `https://v2.jkt48connect.com/api/profiles/public/profile/name/${encodeURIComponent(searchValue)}`;
          break;
        case 'phone':
          url = `https://v2.jkt48connect.com/api/profiles/public/profile/phone/${encodeURIComponent(searchValue)}`;
          break;
        case 'id':
          url = `https://v2.jkt48connect.com/api/profiles/public/profile/id/${encodeURIComponent(searchValue)}`;
          break;
        default:
          throw new Error('Invalid search type');
      }

      console.log('Fetching profile from:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log('API Response:', data);

      if (response.ok && data.status) {
        // Handle multiple results (for name search)
        if (Array.isArray(data.data)) {
          if (data.data.length > 0) {
            setProfile(data.data[0]); // Use first result
            setSuccess(`Found ${data.data.length} profile(s). Showing first result.`);
            setupEditableData(data.data[0]);
          } else {
            setError('No profiles found');
            setProfile(null);
          }
        } else {
          setProfile(data.data);
          setSuccess(data.message || 'Profile loaded successfully');
          setupEditableData(data.data);
        }
      } else {
        setError(data.message || 'Profile not found or not accessible');
        setProfile(null);
      }
    } catch (error) {
      console.error('Fetch profile error:', error);
      setError('Error loading profile: ' + error.message);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  // Setup editable data from profile
  const setupEditableData = (profileData) => {
    setEditableData({
      username: profileData.username || '',
      full_name: profileData.full_name || '',
      city: profileData.city || '',
      province: profileData.province || '',
      country: profileData.country || 'Indonesia',
      bio: profileData.bio || '',
      occupation: profileData.occupation || '',
      company: profileData.company || '',
      website: profileData.website || ''
    });
  };

  // Auto-load profile from localStorage on mount
  useEffect(() => {
    const storedData = getStoredData();
    console.log('Stored data found:', storedData);

    if (storedData) {
      // Try to load profile using stored username first, then email
      if (storedData.username) {
        fetchProfile('username', storedData.username);
      } else if (storedData.email) {
        fetchProfile('email', storedData.email);
      } else {
        setSearchMode(true);
        setLoading(false);
      }
    } else {
      // No stored data, show search mode
      setSearchMode(true);
      setLoading(false);
    }
  }, []);

  // Handle manual search
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchCriteria.searchValue.trim()) {
      setError('Please enter a search value');
      return;
    }

    fetchProfile(searchCriteria.searchType, searchCriteria.searchValue.trim());
    setSearchMode(false);
  };

  // Handle input changes for search
  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle input changes for editing
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle password change form
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Update profile (Note: This would require authentication in real implementation)
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('Profile update is not available in public mode. Please log in to update your profile.');
  };

  // Change password (Note: This would require authentication in real implementation)
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('Password change is not available in public mode. Please log in to change your password.');
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
      case 'gold': return 'badge badge-premium';
      case 'silver': return 'badge badge-basic';
      case 'basic': return 'badge badge-basic';
      default: return 'badge badge-basic';
    }
  };

  // Show search form if no profile loaded or in search mode
  if (searchMode || (!profile && !loading)) {
    return (
      <div className="profile-container">
        <div className="profile-wrapper">
          <div className="profile-header">
            <div className="profile-header-content">
              <h1>Find Profile</h1>
              <p>Search for a profile using different criteria</p>
            </div>
          </div>

          {error && (
            <div className="alert alert-error">
              <X style={{ width: '20px', height: '20px' }} />
              <div className="alert-content">
                <p className="alert-message">{error}</p>
              </div>
              <button onClick={() => setError('')} className="alert-close">
                <X style={{ width: '16px', height: '16px' }} />
              </button>
            </div>
          )}

          <div className="profile-card">
            <h2>Search Profile</h2>
            <form onSubmit={handleSearch} className="profile-form">
              <div className="form-group">
                <label className="form-label">Search By</label>
                <select
                  name="searchType"
                  value={searchCriteria.searchType}
                  onChange={handleSearchChange}
                  className="form-input form-select"
                >
                  <option value="username">Username</option>
                  <option value="email">Email</option>
                  <option value="name">Full Name</option>
                  <option value="phone">Phone Number</option>
                  <option value="id">Profile ID</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Search Value</label>
                <input
                  type="text"
                  name="searchValue"
                  value={searchCriteria.searchValue}
                  onChange={handleSearchChange}
                  placeholder={`Enter ${searchCriteria.searchType}...`}
                  className="form-input"
                  required
                />
                <small style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                  {searchCriteria.searchType === 'name' && 'Partial names are supported (e.g., "John" will find "John Doe")'}
                  {searchCriteria.searchType === 'username' && 'Enter exact username'}
                  {searchCriteria.searchType === 'email' && 'Enter exact email address'}
                  {searchCriteria.searchType === 'phone' && 'Enter exact phone number'}
                  {searchCriteria.searchType === 'id' && 'Enter exact profile ID'}
                </small>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  <Search style={{ width: '16px', height: '16px' }} />
                  <span>{loading ? 'Searching...' : 'Search Profile'}</span>
                </button>
              </div>
            </form>

            {/* Show stored data if available */}
            {(() => {
              const storedData = getStoredData();
              if (storedData) {
                return (
                  <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f3f4f6', borderRadius: '8px' }}>
                    <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem', color: '#374151' }}>Stored Data Available</h3>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      {storedData.username && <div>Username: {storedData.username}</div>}
                      {storedData.email && <div>Email: {storedData.email}</div>}
                      {storedData.full_name && <div>Name: {storedData.full_name}</div>}
                    </div>
                    <button
                      onClick={() => {
                        if (storedData.username) {
                          setSearchCriteria({
                            searchType: 'username',
                            searchValue: storedData.username
                          });
                        } else if (storedData.email) {
                          setSearchCriteria({
                            searchType: 'email',
                            searchValue: storedData.email
                          });
                        }
                      }}
                      className="btn btn-outline"
                      style={{ marginTop: '0.5rem', fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                    >
                      Use Stored Data
                    </button>
                  </div>
                );
              }
              return null;
            })()}
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="error-container">
        <div className="error-content">
          <div className="error-icon">⚠️</div>
          <h2 className="error-title">Profile Not Found</h2>
          <p className="error-message">{error || 'Failed to load profile data'}</p>
          <button 
            onClick={() => setSearchMode(true)} 
            className="btn btn-primary"
          >
            Search Again
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
                  <h1>{profile.full_name || profile.username}</h1>
                  <p className="profile-username">@{profile.username}</p>
                  <div className="profile-badges">
                    <span className={getMemberStatusClass(profile.status_member)}>
                      {profile.status_member?.toUpperCase() || 'BASIC'}
                    </span>
                    {profile.is_verified && (
                      <span className="badge badge-verified">
                        <Shield style={{ width: '12px', height: '12px' }} />
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => setSearchMode(true)}
                  className="btn btn-outline"
                  style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                >
                  <Search style={{ width: '16px', height: '16px' }} />
                  <span>Search Other</span>
                </button>
                <button
                  onClick={() => setEditing(!editing)}
                  className="edit-button"
                  disabled={true}
                  title="Profile editing requires login"
                >
                  <Edit style={{ width: '16px', height: '16px' }} />
                  <span>View Only</span>
                </button>
              </div>
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
                Profile
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`tab-button ${activeTab === 'activity' ? 'active' : ''}`}
              >
                <Activity style={{ width: '16px', height: '16px' }} />
                Activity
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
            <button onClick={() => setError('')} className="alert-close">
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
            <button onClick={() => setSuccess('')} className="alert-close">
              <X style={{ width: '16px', height: '16px' }} />
            </button>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'profile' && (
          <div className="profile-content two-column">
            {/* Main Profile Info */}
            <div>
              <div className="profile-card">
                <h2>Personal Information</h2>
                
                <div className="profile-info-grid">
                  <div className="profile-info-item">
                    <User className="profile-info-icon" />
                    <div className="profile-info-content">
                      <p>Username</p>
                      <p>{profile.username}</p>
                    </div>
                  </div>

                  <div className="profile-info-item">
                    <User className="profile-info-icon" />
                    <div className="profile-info-content">
                      <p>Full Name</p>
                      <p>{profile.full_name || '-'}</p>
                    </div>
                  </div>

                  <div className="profile-info-item full-width">
                    <MapPin className="profile-info-icon" />
                    <div className="profile-info-content">
                      <p>Location</p>
                      <p>
                        {profile.city && profile.province 
                          ? `${profile.city}, ${profile.province}`
                          : profile.city || profile.province || '-'}
                        {profile.country && profile.country !== 'Indonesia' && `, ${profile.country}`}
                      </p>
                    </div>
                  </div>

                  {profile.occupation && (
                    <div className="profile-info-item">
                      <Building className="profile-info-icon" />
                      <div className="profile-info-content">
                        <p>Occupation</p>
                        <p>{profile.occupation}</p>
                        {profile.company && (
                          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>at {profile.company}</p>
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
            </div>

            {/* Profile Stats */}
            <div className="sidebar-cards">
              <div className="profile-card">
                <h3>Account Status</h3>
                <div className="status-list">
                  <div className="status-item">
                    <span>Member Status</span>
                    <span className={getMemberStatusClass(profile.status_member)}>
                      {profile.status_member?.toUpperCase() || 'BASIC'}
                    </span>
                  </div>
                  <div className="status-item">
                    <span>Account Type</span>
                    <span>{profile.account_type || 'regular'}</span>
                  </div>
                  <div className="status-item">
                    <span>Status</span>
                    <span className={`badge ${profile.is_active ? 'badge-verified' : 'badge-basic'}`}>
                      {profile.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="status-item">
                    <span>Verified</span>
                    <span className={`badge ${profile.is_verified ? 'badge-verified' : 'badge-basic'}`}>
                      {profile.is_verified ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="profile-card">
                <h3>Profile Information</h3>
                <div className="status-list">
                  <div className="profile-info-item">
                    <Calendar className="profile-info-icon" />
                    <div className="profile-info-content">
                      <p>Joined</p>
                      <p>{formatDate(profile.created_at)}</p>
                    </div>
                  </div>
                  <div className="profile-info-item">
                    <Activity className="profile-info-icon" />
                    <div className="profile-info-content">
                      <p>Last Updated</p>
                      <p>{formatDate(profile.updated_at)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="profile-card">
                <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '8px', fontSize: '0.875rem', color: '#6b7280' }}>
                  <p style={{ marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>Public Profile</p>
                  <p>This is a public view of the profile. Some information may be hidden for privacy.</p>
                  <p style={{ marginTop: '0.5rem' }}>Profile ID: {profile.profile_id}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="profile-card">
            <h2>Account Activity</h2>
            
            <div className="activity-stats">
              <div className="activity-stat-card blue">
                <div className="activity-stat-info">
                  <p>Account Status</p>
                  <p>{profile.is_active ? 'Active' : 'Inactive'}</p>
                </div>
                <Activity className="activity-stat-icon" />
              </div>

              <div className="activity-stat-card green">
                <div className="activity-stat-info">
                  <p>Member Since</p>
                  <p style={{ fontSize: '1.125rem' }}>{formatDate(profile.created_at)}</p>
                </div>
                <Calendar className="activity-stat-icon" />
              </div>

              <div className="activity-stat-card purple">
                <div className="activity-stat-info">
                  <p>Last Updated</p>
                  <p style={{ fontSize: '1.125rem' }}>{formatDate(profile.updated_at)}</p>
                </div>
                <Clock className="activity-stat-icon" />
              </div>
            </div>

            <div className="activity-history">
              <h3>Profile Timeline</h3>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon-container green">
                    <User className="activity-icon" />
                  </div>
                  <div className="activity-content">
                    <p>Account created</p>
                    <p>{formatDate(profile.created_at)}</p>
                  </div>
                </div>

                {profile.updated_at !== profile.created_at && (
                  <div className="activity-item">
                    <div className="activity-icon-container blue">
                      <Edit className="activity-icon" />
                    </div>
                    <div className="activity-content">
                      <p>Profile updated</p>
                      <p>{formatDate(profile.updated_at)}</p>
                    </div>
                  </div>
                )}

                {profile.is_verified && (
                  <div className="activity-item">
                    <div className="activity-icon-container purple">
                      <Shield className="activity-icon" />
                    </div>
                    <div className="activity-content">
                      <p>Account verified</p>
                      <p>Profile has been verified</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div style={{ marginTop: '2rem', padding: '1rem', background: '#fef3c7', borderRadius: '8px', fontSize: '0.875rem' }}>
              <p style={{ marginBottom: '0.5rem', fontWeight: '600', color: '#92400e' }}>Limited Information</p>
              <p style={{ color: '#b45309' }}>This is a public view. Detailed activity logs require authentication.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
