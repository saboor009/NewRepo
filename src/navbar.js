
import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import userIcon from './icons/usericon.png'; // Path to user icon
import cross from './icons/cross.png'; 
import logo from './icons/logo.svg';
import {  useLogoutMutation} from './features/api/authApi';
import { useLogoutDoctorMutation } from './features/api/docAuthApi';
import { useSelector, useDispatch } from 'react-redux';
import { logout as userLogout } from './features/authSlice';
import { logout as doctorLogout } from './features/docAuthSlice';


const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);


  const {user:userData} = useSelector((state) => state.auth);
  const {doctor:doctorData} = useSelector((state) => state.docAuth);

  // Logout functionality for patient user
  const [logout ,{ data: logoutData, error: logoutError }] = useLogoutMutation();
  
  // Logout functionality for doctor
  const [logoutDoctor, { data: logoutDoctorData, error: logoutDoctorError }] = useLogoutDoctorMutation();

  // Handle logout responses
  useEffect(() => {
    console.log('Logout data changed:', logoutData);
    console.log('Logout error changed:', logoutError);
    
    if (logoutData) {
      dispatch(userLogout());
      console.log('Navigating to login due to successful logout');
      navigate('/login');
    }
    if (logoutError) {
      console.error('Logout Error:', logoutError);
      console.error('Logout Error details:', JSON.stringify(logoutError, null, 2));
      
      // For logout errors, still redirect to login page
      // This is user-friendly behavior
      console.log('Redirecting to login despite logout error');
      navigate('/login');
    }
  }, [logoutData, logoutError, navigate, dispatch]);

  useEffect(() => {
    if (logoutDoctorData) {
        dispatch(doctorLogout());
      navigate('/login'); // example redirect after logout
    }
    if (logoutDoctorError) {
        dispatch(doctorLogout());
      console.error('Logout Error:', logoutDoctorError);
    }
  }, [logoutDoctorData, logoutDoctorError, navigate,dispatch]);
  // Menu toggling functions
  const toggleMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };
  
  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleUserLogout = async () => {
    try {
      console.log('Starting user logout...');
      const result = await logout();
      console.log('Logout result:', result);
      
      // Check if logout was successful
      if (result.error) {
        console.error('Logout failed:', result.error);
        console.error('Error details:', JSON.stringify(result.error, null, 2));
        
        // For logout, even if API fails, clear local state and redirect
        // This is common practice since the user wants to logout regardless
        console.log('Forcing logout despite API error');
        navigate('/login');
      } else {
        console.log('Logout successful');
        // The useEffect should handle navigation automatically
      }
    } catch (error) {
      console.error('Logout error:', error);
      console.error('Error stack:', error.stack);
       dispatch(userLogout()); // Force logout state
      // Force logout on any error
      console.log('Forcing logout due to exception');
      navigate('/login');
    }
  };
  
  const handleDoctorLogout = async () => {
    await logoutDoctor();
    
  };

  // Determine which type of user is logged in and ensure we have data
  const isDoctorLoggedIn = !!( doctorData && doctorData.firstName);
  const isUserLoggedIn = !!(userData && userData.firstName);

  // Extract the name values if available
  const doctorName = isDoctorLoggedIn ? 
    `${doctorData.firstName} ${doctorData.lastName}` : '';
  
  const userName = isUserLoggedIn ? 
    `${userData.firstName} ${userData.lastName}` : '';

  const renderAuthContent = () => {
    if (isDoctorLoggedIn) {
      return (
        <div className="user-profile">
          <div className="user-name">{doctorName}</div>
          <div className="logout-btn" onClick={handleDoctorLogout}>LogoutDoctor</div>
        </div>
      );
    } else if (isUserLoggedIn) {
      return (
        <div className="user-profile">
          <div className="user-name">{userName}</div>
          <div className="logout-btn" onClick={handleUserLogout}>LogoutUser</div>
        </div>
      );
    } else {
      return (
        <Link to="/register" style={{ textDecoration: "none" }}>
          <div className="login">
            <img src={userIcon} alt="User Icon" className="usericon" />
            <div className="login-text">
              <span className="login-prompt">Login or Register</span>
              <span className="account-type">Patient Account</span>
            </div>
          </div>
        </Link>
      );
    }
  };

  // Add this useEffect to debug state changes
  useEffect(() => {
    console.log('User data:', userData);
    console.log('Is user logged in:', isUserLoggedIn);
  }, [userData, isUserLoggedIn]);

  return (
    <nav className="navbar">
      <div className="top-row">
        <div className="logo">
          <img src={logo} alt="Company Logo" />
        </div>
        <div className="header">
          {renderAuthContent()}
        </div>
      </div>

      <hr className="divider desktop-divider" />

      <div className="bottom-row">
        <ul className="nav-links">
          {!isDoctorLoggedIn && (
            <li><Link to="/">Home</Link></li>
          )}
          
          {isDoctorLoggedIn && (
            <li><Link to="/doctordashboard">Dashboard</Link></li>
          )}
          
          {isUserLoggedIn && (
            <>
              <li><Link to="/appointments">Appointments</Link></li>
              <li><Link to="/FindDoctor">Find a Doctor</Link></li>
            </>
          )}
          
          <li><Link to="/talktoai">Talk to AI</Link></li>
          <li><Link to="/contactus">Contact Us</Link></li>
          <li><Link to="/aboutus">About Us</Link></li>
        </ul>
      </div>

      {/* Mobile Navigation */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-evenly' }}>
        <div className="mobile-nav">
          <div className="logo">
            <img src={logo} alt="Company Logo" />
          </div>
          <div className="hamburger" onClick={toggleMenu} style={{ fontSize: '24px', fontWeight: 'bold' }}>
            &#9776;
          </div>
        </div>

        <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-menu-header">
            <div className="menu-logo">MEDEASE</div>
            <div className="close-btn-div">
              <img src={cross} alt="Close Menu" onClick={closeMenu} />
            </div>
          </div>
          <ul className="nav-links">
            <li>
              <div className="header">
                {renderAuthContent()}
              </div>
            </li>
            
            {!isDoctorLoggedIn && (
              <li><Link to="/">Home</Link></li>
            )}
            
            {isDoctorLoggedIn && (
              <li><Link to="/doctordashboard">Dashboard</Link></li>
            )}
            
            {isUserLoggedIn && (
              <>
                <li><Link to="/appointments">Appointments</Link></li>
                <li><Link to="/FindDoctor">Find a Doctor</Link></li>
              </>
            )}
            
            <li><Link to="/talktoai">Talk to AI</Link></li>
            <li><Link to="/contactus">Contact Us</Link></li>
            <li><Link to="/aboutus">About Us</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;