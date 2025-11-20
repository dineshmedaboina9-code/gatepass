import React, { useState, useRef, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import '../styles/dashboard.css';

const GateKeeperPage = () => {
  const [scannedData, setScannedData] = useState('');
  const [requestInfo, setRequestInfo] = useState(null);
  const [entryStatus, setEntryStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [scannerMode, setScannerMode] = useState('manual'); // 'manual' or 'camera'
  const qrInputRef = useRef(null);
  const scannerRef = useRef(null);
  const html5QrcodeScanner = useRef(null);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      if (cameraActive) {
        stopCamera();
      }
      await api.post('/auth/logout');
      logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  useEffect(() => {
    return () => {
      if (cameraActive) {
        stopCamera();
      }
    };
  }, [cameraActive]);

  const startCamera = async () => {
    try {
      setError('');
      setCameraActive(true);
      setScannerMode('camera');

      html5QrcodeScanner.current = new Html5QrcodeScanner(
        'qr-scanner',
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1,
          rememberLastUsedCamera: true
        },
        false
      );

      html5QrcodeScanner.current.render(
        (decodedText) => {
          // Successfully decoded
          console.log('QR Scanned:', decodedText);
          setScannedData(decodedText);
          processQRData(decodedText);
          stopCamera();
        },
        (error) => {
          // Error while scanning - ignore as it's continuous scanning
          // console.log('Scanning error:', error);
        }
      );
    } catch (err) {
      setError('Failed to start camera. Make sure you have granted camera permissions.');
      setCameraActive(false);
      setScannerMode('manual');
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (html5QrcodeScanner.current) {
      html5QrcodeScanner.current
        .clear()
        .catch((err) => console.error('Error stopping scanner:', err));
      html5QrcodeScanner.current = null;
    }
    setCameraActive(false);
    setScannerMode('manual');
  };

  const toggleCamera = () => {
    if (cameraActive) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  const handleQRScan = async (e) => {
    const data = e.target.value.trim();
    if (data) {
      setScannedData(data);
      await processQRData(data);
      e.target.value = '';
    }
  };

  const processQRData = async (qrData) => {
    setLoading(true);
    setError('');
    setSuccess('');
    setRequestInfo(null);

    try {
      // QR data may contain a JSON payload (created when gate pass was generated)
      // which includes a passCode. Try to parse, otherwise assume the raw
      // scanned string is the passCode.
      let passCode = qrData;
      try {
        const parsed = JSON.parse(qrData);
        if (parsed && parsed.passCode) passCode = parsed.passCode;
      } catch (e) {
        // not JSON, keep qrData as passCode
      }

      // Use scan endpoint which accepts passCode and records the entry
      const response = await api.post('/gate-entries/scan', { passCode, gate: 'Main Gate' });

      if (response.data && response.data.entry) {
        // Prefer rich response fields (student/request) added by backend
        const { request: reqInfo, student } = response.data;
        setRequestInfo({
          destination: reqInfo?.destination,
          reason: reqInfo?.reason,
          outTime: reqInfo?.outTime,
          inTime: reqInfo?.inTime,
          student: student || null
        });
        setEntryStatus('verified');
        setSuccess('✓ Gate Pass Verified! Entry recorded.');
      } else {
        setError(response.data?.error || 'Invalid or expired gate pass');
        setEntryStatus('invalid');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to process QR code');
      setEntryStatus('error');
      console.error('QR Processing error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleManualEntry = async (e) => {
    e.preventDefault();
    if (!scannedData) {
      setError('Please enter or scan a QR code');
      return;
    }
    await processQRData(scannedData);
  };

  return (
    <div className="dashboard">
      <nav className="navbar">
        <h1>Gate Pass Management System - Gate Keeper</h1>
        <div className="user-info">
          <span>{user?.firstName} {user?.lastName}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </nav>

      <div className="dashboard-container">
        <div className="tab-content" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2>QR Code Scanner</h2>
          <p style={{ color: '#666', marginBottom: '2rem' }}>
            Scan the QR code from the student's approved gate pass or enter the gate pass ID manually.
          </p>

          {/* Mode Selection Buttons */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', justifyContent: 'center' }}>
            <button
              onClick={() => {
                if (cameraActive) stopCamera();
                setScannerMode('manual');
              }}
              style={{
                padding: '0.75rem 1.5rem',
                background: scannerMode === 'manual' ? '#007bff' : '#e0e0e0',
                color: scannerMode === 'manual' ? 'white' : '#333',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}
            >
              📝 Manual Entry
            </button>
            <button
              onClick={() => setScannerMode('camera')}
              style={{
                padding: '0.75rem 1.5rem',
                background: scannerMode === 'camera' ? '#007bff' : '#e0e0e0',
                color: scannerMode === 'camera' ? 'white' : '#333',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}
            >
              📷 Scan with Camera
            </button>
          </div>

          {/* Manual Entry Mode */}
          {scannerMode === 'manual' && (
            <form onSubmit={handleManualEntry} className="form-card">
              <div className="form-group">
                <label htmlFor="qr-input">QR Code / Gate Pass ID</label>
                <input
                  ref={qrInputRef}
                  id="qr-input"
                  type="text"
                  placeholder="Place cursor here and scan QR code..."
                  value={scannedData}
                  onChange={(e) => setScannedData(e.target.value)}
                  onBlur={handleQRScan}
                  disabled={loading}
                  style={{ fontSize: '1.1rem' }}
                  autoFocus
                />
                <small style={{ color: '#999', marginTop: '0.5rem', display: 'block' }}>
                  The field automatically processes the QR code scan when complete
                </small>
              </div>
              <button type="submit" className="primary-btn" disabled={loading}>
                {loading ? 'Processing...' : 'Verify Manually'}
              </button>
            </form>
          )}

          {/* Camera Mode */}
          {scannerMode === 'camera' && (
            <div style={{ marginBottom: '2rem' }}>
              <div
                id="qr-scanner"
                ref={scannerRef}
                style={{
                  width: '100%',
                  borderRadius: '5px',
                  overflow: 'hidden',
                  background: '#000',
                  marginBottom: '1rem'
                }}
              />
              {!cameraActive ? (
                <button
                  onClick={toggleCamera}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: 'bold'
                  }}
                >
                  🎥 Open Camera
                </button>
              ) : (
                <button
                  onClick={toggleCamera}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: 'bold'
                  }}
                >
                  ✕ Close Camera
                </button>
              )}
              <p style={{ color: '#666', textAlign: 'center', marginTop: '1rem' }}>
                {cameraActive ? 'Point camera at QR code to scan' : 'Click "Open Camera" to start scanning'}
              </p>
            </div>
          )}

          {error && (
            <div style={{
              background: '#fee',
              border: '1px solid #fcc',
              color: '#c33',
              padding: '1rem',
              borderRadius: '5px',
              marginTop: '1rem'
            }}>
              <strong>Error:</strong> {error}
            </div>
          )}

          {success && (
            <div style={{
              background: '#efe',
              border: '1px solid #cfc',
              color: '#3c3',
              padding: '1rem',
              borderRadius: '5px',
              marginTop: '1rem'
            }}>
              <strong>Success:</strong> {success}
            </div>
          )}

          {requestInfo && entryStatus === 'verified' && (
            <div className="details-container" style={{ marginTop: '2rem' }}>
              <h3>Gate Pass Information</h3>
              <div className="detail-row">
                <label>Student Name:</label>
                <p>{requestInfo.student?.firstName} {requestInfo.student?.lastName}</p>
              </div>
              <div className="detail-row">
                <label>Email:</label>
                <p>{requestInfo.student?.email}</p>
              </div>
              <div className="detail-row">
                <label>Destination:</label>
                <p>{requestInfo.destination}</p>
              </div>
              <div className="detail-row">
                <label>Reason:</label>
                <p>{requestInfo.reason}</p>
              </div>
              <div className="detail-row">
                <label>Out Time:</label>
                <p>{new Date(requestInfo.outTime).toLocaleString()}</p>
              </div>
              <div className="detail-row">
                <label>In Time:</label>
                <p>{requestInfo.inTime ? new Date(requestInfo.inTime).toLocaleString() : 'Not specified'}</p>
              </div>
              <div className="detail-row">
                <label>Status:</label>
                <p style={{ color: '#3c3', fontWeight: 'bold' }}>✓ APPROVED</p>
              </div>
            </div>
          )}

          {entryStatus === 'invalid' && (
            <div className="details-container" style={{ marginTop: '2rem', background: '#fee' }}>
              <h3>Invalid Gate Pass</h3>
              <p>This gate pass is either:</p>
              <ul>
                <li>Not approved by both HoD and Admin</li>
                <li>Already expired</li>
                <li>Invalid or tampered</li>
              </ul>
            </div>
          )}

          <div style={{ marginTop: '3rem', padding: '1.5rem', background: '#f0f0f0', borderRadius: '5px' }}>
            <h4>Instructions:</h4>
            <ol style={{ lineHeight: '1.8' }}>
              <li>Ask the student to show their gate pass QR code</li>
              <li>Position your barcode scanner or QR scanner device in front of the field above</li>
              <li>The system will automatically verify the pass and log the entry</li>
              <li>If approved, the student details will appear below</li>
              <li>Student can now proceed through the gate</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GateKeeperPage;
