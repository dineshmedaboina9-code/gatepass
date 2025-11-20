import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import '../styles/dashboard.css';

const HoDDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [action, setAction] = useState(null);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchPendingRequests = async () => {
    try {
      const response = await api.get(`/requests/department/${user?.department}`);
      setRequests(response.data.requests);
    } catch (err) {
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingRequests();
    // Auto-refresh every 5 seconds to show real-time updates when gate passes are used
    const interval = setInterval(fetchPendingRequests, 5000);
    
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApprove = async () => {
    try {
      await api.put(`/requests/${selectedRequest.id}/hod-approve`, {
        remarks
      });
      setRemarks('');
      setAction(null);
      setSelectedRequest(null);
      fetchPendingRequests();
    } catch (err) {
      console.error('Error approving request:', err);
    }
  };

  const handleReject = async () => {
    try {
      await api.put(`/requests/${selectedRequest.id}/hod-reject`, {
        remarks
      });
      setRemarks('');
      setAction(null);
      setSelectedRequest(null);
      fetchPendingRequests();
    } catch (err) {
      console.error('Error rejecting request:', err);
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
        <h1>Gate Pass Management System - HoD</h1>
        <div className="user-info">
          <span>{user?.firstName} {user?.lastName} ({user?.department})</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </nav>

      <div className="dashboard-container">
        <h2>Pending Requests for Approval</h2>
        
        {loading ? (
          <p>Loading...</p>
        ) : requests.length === 0 ? (
          <p>No pending requests</p>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Email</th>
                  <th>Destination</th>
                  <th>Reason</th>
                  <th>Out Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(req => (
                  <tr key={req.id}>
                    <td>{req.student?.firstName} {req.student?.lastName}</td>
                    <td>{req.student?.email}</td>
                    <td>{req.destination}</td>
                    <td>{req.reason}</td>
                    <td>{new Date(req.outTime).toLocaleString()}</td>
                    <td>
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

        {selectedRequest && action && (
          <div className="modal">
            <div className="modal-content">
              <h3>{action === 'approve' ? 'Approve Request' : 'Reject Request'}</h3>
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
              </div>
              <div className="modal-actions">
                {selectedRequest.status === 'pending' && (
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

export default HoDDashboard;
