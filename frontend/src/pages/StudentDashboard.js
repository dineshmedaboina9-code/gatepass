import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import '../styles/dashboard.css';

const StudentDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [gatePasses, setGatePasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('status');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [formData, setFormData] = useState({
    reason: '',
    destination: '',
    outTime: '',
    inTime: ''
  });
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
    // Auto-refresh every 5 seconds to show real-time status updates
    const interval = setInterval(fetchRequests, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await api.get('/requests');
      setRequests(response.data.requests);
      
      // Fetch gate passes
      const passesResponse = await api.get('/gate-passes');
      setGatePasses(passesResponse.data.gatePasses);
    } catch (err) {
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    try {
      await api.post('/requests', formData);
      setFormData({ reason: '', destination: '', outTime: '', inTime: '' });
      setShowRequestForm(false);
      fetchRequests();
    } catch (err) {
      console.error('Error submitting request:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const getStatusBadge = (status) => {
    const statusClass = `status-badge status-${status.replace('_', '-')}`;
    return <span className={statusClass}>{status.replace('_', ' ').toUpperCase()}</span>;
  };

  return (
    <div className="dashboard">
      <nav className="navbar">
        <h1>Gate Pass Management System - Student</h1>
        <div className="user-info">
          <span>{user?.firstName} {user?.lastName}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </nav>

      <div className="dashboard-container">
        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === 'status' ? 'active' : ''}`}
            onClick={() => setActiveTab('status')}
          >
            Request Status
          </button>
          <button
            className={`tab-btn ${activeTab === 'passes' ? 'active' : ''}`}
            onClick={() => setActiveTab('passes')}
          >
            View QR Code
          </button>
        </div>

        {activeTab === 'status' && (
          <div className="tab-content">
            <div className="action-bar">
              <button
                className="primary-btn"
                onClick={() => setShowRequestForm(!showRequestForm)}
              >
                Request Gate Pass
              </button>
            </div>

            {showRequestForm && (
              <div className="form-card">
                <h3>Submit New Request</h3>
                <form onSubmit={handleSubmitRequest}>
                  <div className="form-group">
                    <label>Reason</label>
                    <textarea
                      name="reason"
                      value={formData.reason}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Destination</label>
                    <input
                      type="text"
                      name="destination"
                      value={formData.destination}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Out Time</label>
                      <input
                        type="datetime-local"
                        name="outTime"
                        value={formData.outTime}
                        onChange={handleFormChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>In Time</label>
                      <input
                        type="datetime-local"
                        name="inTime"
                        value={formData.inTime}
                        onChange={handleFormChange}
                      />
                    </div>
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="primary-btn">Submit Request</button>
                    <button
                      type="button"
                      className="secondary-btn"
                      onClick={() => setShowRequestForm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="requests-list">
              <h3>Your Requests</h3>
              {loading ? (
                <p>Loading...</p>
              ) : requests.length === 0 ? (
                <p>No requests yet</p>
              ) : (
                <div className="table-responsive">
                  <table>
                    <thead>
                      <tr>
                        <th>Destination</th>
                        <th>Reason</th>
                        <th>Out Time</th>
                        <th>Status</th>
                        <th>Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map(req => (
                        <tr key={req.id}>
                          <td>{req.destination}</td>
                          <td>{req.reason}</td>
                          <td>{new Date(req.outTime).toLocaleString()}</td>
                          <td>{getStatusBadge(req.status)}</td>
                          <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'passes' && (
          <div className="tab-content">
            <div className="qr-code-section">
              <h3>Your Approved Gate Passes</h3>
              {loading ? (
                <p>Loading...</p>
              ) : gatePasses.length === 0 ? (
                <p>No approved gate passes yet. Once your request is approved by Admin, your QR code will appear here.</p>
              ) : (
                <div className="passes-grid">
                  {gatePasses.map(pass => (
                    <div key={pass.id} className="pass-card">
                      <div className="pass-info">
                        <div className="detail-row">
                          <label>Pass Code:</label>
                          <p>{pass.passCode}</p>
                        </div>
                        <div className="detail-row">
                          <label>Destination:</label>
                          <p>{pass.request?.destination || 'N/A'}</p>
                        </div>
                        <div className="detail-row">
                          <label>Reason:</label>
                          <p>{pass.request?.reason || 'N/A'}</p>
                        </div>
                        <div className="detail-row">
                          <label>Out Time:</label>
                          <p>{pass.request?.outTime ? new Date(pass.request.outTime).toLocaleString() : 'N/A'}</p>
                        </div>
                        <div className="detail-row">
                          <label>Valid Until:</label>
                          <p>{new Date(pass.validUntil).toLocaleString()}</p>
                        </div>
                        <div className="detail-row">
                          <label>Status:</label>
                          <p>{pass.isUsed ? '✓ Used' : '⏳ Pending'}</p>
                        </div>
                      </div>
                      <div className="qr-code-display">
                        <p style={{marginBottom: '10px', fontSize: '14px'}}>Scan for gate entry:</p>
                        <img src={pass.qrCode} alt="QR Code" style={{maxWidth: '200px'}} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
