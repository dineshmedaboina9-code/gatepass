import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import '../styles/dashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('requests');
  const [requests, setRequests] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [action, setAction] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'pending') {
        const response = await api.get('/requests/admin/pending-approval');
        setRequests(response.data.requests);
      } else if (activeTab === 'approved') {
        // Fetch admin-approved requests ready for generation
        const response = await api.get('/requests/admin/approved');
        setRequests(response.data.requests);
      } else if (activeTab === 'analytics') {
        const response = await api.get('/reports/analytics');
        setAnalytics(response.data.analytics);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Auto-refresh every 5 seconds to show real-time updates when gate passes are used
    const interval = setInterval(fetchData, 5000);
    
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleApprove = async () => {
    try {
      await api.put(`/requests/${selectedRequest.id}/admin-approve`, {
        remarks
      });
      setRemarks('');
      setAction(null);
      setSelectedRequest(null);
      fetchData();
    } catch (err) {
      console.error('Error approving request:', err);
    }
  };

  const handleReject = async () => {
    try {
      await api.put(`/requests/${selectedRequest.id}/admin-reject`, {
        remarks
      });
      setRemarks('');
      setAction(null);
      setSelectedRequest(null);
      fetchData();
    } catch (err) {
      console.error('Error rejecting request:', err);
    }
  };

  const handleGeneratePass = async () => {
    try {
      setGenerating(true);
      await api.post(`/gate-passes/${selectedRequest.id}/generate`);
      setSuccessMessage('Gate pass generated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      setSelectedRequest(null);
      setAction(null);
      fetchData();
    } catch (err) {
      console.error('Error generating pass:', err);
      alert('Error generating pass: ' + (err.response?.data?.message || err.message));
    } finally {
      setGenerating(false);
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

  return (
    <div className="dashboard">
      <nav className="navbar">
        <h1>Gate Pass Management System - Admin</h1>
        <div className="user-info">
          <span>{user?.firstName} {user?.lastName}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </nav>

      <div className="dashboard-container">
        {successMessage && (
          <div className="success-banner">
            {successMessage}
          </div>
        )}
        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending Admin Approval
          </button>
          <button
            className={`tab-btn ${activeTab === 'approved' ? 'active' : ''}`}
            onClick={() => setActiveTab('approved')}
          >
            Ready for QR Generation
          </button>
          <button
            className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics & Reports
          </button>
        </div>

        {(activeTab === 'pending' || activeTab === 'approved') && (
          <div className="tab-content">
            {loading ? (
              <p>Loading...</p>
            ) : requests.length === 0 ? (
              <p>No requests found</p>
            ) : (
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Department</th>
                      <th>Destination</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map(req => (
                      <tr key={req.id}>
                        <td>{req.student?.firstName} {req.student?.lastName}</td>
                        <td>{req.department}</td>
                        <td>{req.destination}</td>
                        <td>{req.status}</td>
                        <td>
                          {activeTab === 'pending' && req.status === 'hod_approved' && (
                            <>
                              <button
                                className="action-btn approve"
                                onClick={() => {
                                  setSelectedRequest(req);
                                  setAction('approve');
                                }}
                              >
                                Approve
                              </button>
                              <button
                                className="action-btn reject"
                                onClick={() => {
                                  setSelectedRequest(req);
                                  setAction('reject');
                                }}
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {activeTab === 'approved' && req.status === 'admin_approved' && (
                            <button
                              className="action-btn generate"
                              onClick={() => {
                                setSelectedRequest(req);
                                setAction('generate');
                              }}
                            >
                              Generate Pass & QR
                            </button>
                          )}
                          <button
                            className="action-btn details"
                            onClick={() => setSelectedRequest(req)}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="tab-content">
            {loading ? (
              <p>Loading...</p>
            ) : analytics ? (
              <div className="analytics-grid">
                <div className="stat-card">
                  <h4>Total Requests</h4>
                  <p className="stat-value">{analytics.total}</p>
                </div>
                <div className="stat-card">
                  <h4>Pending</h4>
                  <p className="stat-value">{analytics.pending}</p>
                </div>
                <div className="stat-card">
                  <h4>HoD Approved</h4>
                  <p className="stat-value">{analytics.hodApproved}</p>
                </div>
                <div className="stat-card">
                  <h4>HoD Rejected</h4>
                  <p className="stat-value">{analytics.hodRejected}</p>
                </div>
                <div className="stat-card">
                  <h4>Admin Approved</h4>
                  <p className="stat-value">{analytics.adminApproved}</p>
                </div>
                <div className="stat-card">
                  <h4>Admin Rejected</h4>
                  <p className="stat-value">{analytics.adminRejected}</p>
                </div>
                <div className="stat-card">
                  <h4>Issued</h4>
                  <p className="stat-value">{analytics.issued}</p>
                </div>
                <div className="stat-card">
                  <h4>Used</h4>
                  <p className="stat-value">{analytics.used}</p>
                </div>
              </div>
            ) : (
              <p>No analytics data available</p>
            )}
          </div>
        )}

        {selectedRequest && action && (
          <div className="modal">
            <div className="modal-content">
              <h3>{action === 'approve' ? 'Approve Request' : action === 'reject' ? 'Reject Request' : 'Generate Gate Pass'}</h3>
              {action === 'generate' ? (
                <>
                  <div className="details-container">
                    <p>Are you sure you want to generate a gate pass for this request?</p>
                    <div className="detail-row">
                      <label>Student:</label>
                      <p>{selectedRequest.student?.firstName} {selectedRequest.student?.lastName}</p>
                    </div>
                    <div className="detail-row">
                      <label>Destination:</label>
                      <p>{selectedRequest.destination}</p>
                    </div>
                    <div className="detail-row">
                      <label>Out Time:</label>
                      <p>{new Date(selectedRequest.outTime).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="modal-actions">
                    <button
                      className="primary-btn"
                      onClick={handleGeneratePass}
                      disabled={generating}
                    >
                      {generating ? 'Generating...' : 'Generate Pass'}
                    </button>
                    <button
                      className="secondary-btn"
                      onClick={() => {
                        setAction(null);
                        setRemarks('');
                      }}
                      disabled={generating}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label>Remarks (Optional)</label>
                    <textarea
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="Enter your remarks..."
                    />
                  </div>
                  <div className="modal-actions">
                    <button
                      className="primary-btn"
                      onClick={action === 'approve' ? handleApprove : handleReject}
                    >
                      {action === 'approve' ? 'Approve' : 'Reject'}
                    </button>
                    <button
                      className="secondary-btn"
                      onClick={() => {
                        setAction(null);
                        setRemarks('');
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {selectedRequest && !action && (
          <div className="modal">
            <div className="modal-content">
              <h3>Request Details</h3>
              <div className="details-container">
                <div className="detail-row">
                  <label>Student Name:</label>
                  <p>{selectedRequest.student?.firstName} {selectedRequest.student?.lastName}</p>
                </div>
                <div className="detail-row">
                  <label>Email:</label>
                  <p>{selectedRequest.student?.email}</p>
                </div>
                <div className="detail-row">
                  <label>Department:</label>
                  <p>{selectedRequest.department}</p>
                </div>
                <div className="detail-row">
                  <label>Destination:</label>
                  <p>{selectedRequest.destination}</p>
                </div>
                <div className="detail-row">
                  <label>Reason:</label>
                  <p>{selectedRequest.reason}</p>
                </div>
                <div className="detail-row">
                  <label>Out Time:</label>
                  <p>{new Date(selectedRequest.outTime).toLocaleString()}</p>
                </div>
                <div className="detail-row">
                  <label>In Time:</label>
                  <p>{selectedRequest.inTime ? new Date(selectedRequest.inTime).toLocaleString() : 'Not specified'}</p>
                </div>
                <div className="detail-row">
                  <label>Status:</label>
                  <p>{selectedRequest.status}</p>
                </div>
                {selectedRequest.hodRemarks && (
                  <div className="detail-row">
                    <label>HoD Remarks:</label>
                    <p>{selectedRequest.hodRemarks}</p>
                  </div>
                )}
              </div>
              <div className="modal-actions">
                {selectedRequest.status === 'hod_approved' && (
                  <>
                    <button
                      className="primary-btn approve"
                      onClick={() => setAction('approve')}
                    >
                      Approve
                    </button>
                    <button
                      className="primary-btn reject"
                      onClick={() => setAction('reject')}
                    >
                      Reject
                    </button>
                  </>
                )}
                <button
                  className="secondary-btn"
                  onClick={() => setSelectedRequest(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
