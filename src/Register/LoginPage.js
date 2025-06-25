import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';
import doctorImage from '../icons/docotor4.png';
import { useLoginUserMutation } from '../features/api/authApi';
import { useSelector } from 'react-redux';

const LoginPage = () => {

  const { doctor: doctorData } = useSelector((state) => state.docAuth);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();
  const [loginUser, { isLoading, error }] = useLoginUserMutation();

  useEffect(() => {
   if (doctorData) {
      alert('You are already logged in as a doctor');
      navigate('/doctordashboard');
    }
  }, [doctorData, navigate]);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(formData).unwrap();
      if (response) {
        alert('Logged in successfully');
        navigate('/talktoai');
      
      }
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="image-section">
          <img src={doctorImage} alt="Doctor" className="doctor-image-1" />
      
          <Link to="/doctorlogin" className="register-button">
            Login as Doctor ↗
          </Link>
        </div>

        <div className="form-section">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              className="input-field"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <div className="password-container">
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                type={passwordVisible ? 'text' : 'password'}
                id="password"
                placeholder="Password"
                className="input-field"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span
                className="password-toggle"
                onClick={togglePasswordVisibility}
                aria-label={passwordVisible ? 'Hide password' : 'Show password'}
              >
                {passwordVisible ? '🙈' : '👁️'}
              </span>
            </div>
            <button className="create-account-button" type="submit" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          {error && (
            <p className="error-message">
              {error.data?.message || 'Login failed. Please check your credentials.'}
            </p>
          )}

          <div className="alreadyaccount">
            <h4>
              Don't have an account? <Link to="/register">Register here</Link>
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;