import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import '../styles/auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'student',
    department: '',
    registrationNumber: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const departments = ['CSE', 'IT', 'ECE', 'EEE', 'DS', 'CS'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Client-side validation for department
    if ((formData.role === 'student' || formData.role === 'hod') && !formData.department) {
      setError('Department is required for ' + (formData.role === 'student' ? 'students' : 'HOD'));
      setLoading(false);
      return;
    }

    // Clean up form data - only send registrationNumber for students
    const dataToSend = { ...formData };
    if (formData.role !== 'student') {
      delete dataToSend.registrationNumber;
    }

    try {
      await api.post('/auth/register', dataToSend);
      setFormData({
        email: '', password: '', firstName: '', lastName: '',
        role: 'student', department: '', registrationNumber: ''
      });
      navigate('/login', { state: { message: 'Registration successful! Please login.' } });
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Registration failed';
      const details = err.response?.data?.details;
      
      if (details && Array.isArray(details)) {
        const detailsStr = details.map(d => `${d.field}: ${d.message}`).join(', ');
        setError(`${errorMsg} - ${detailsStr}`);
      } else {
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <select name="role" value={formData.role} onChange={handleChange} required disabled>
              <option value="student">Student</option>
            </select>
            <small style={{ color: '#666', marginTop: '5px', display: 'block' }}>
              Only students can register. HoD and Admin accounts are created by administrators.
            </small>
          </div>

          <div className="form-group">
            <label>Department</label>
            <select name="department" value={formData.department} onChange={handleChange} required>
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {formData.role === 'student' && (
            <div className="form-group">
              <label>Registration Number</label>
              <input
                type="text"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="auth-links">
          <a href="/login">Already have an account? Login</a>
        </div>
      </div>
    </div>
  );
};

export default Register;
