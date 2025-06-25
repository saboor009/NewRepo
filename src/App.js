import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Components
import Home from './home';
import Navbar from './navbar';
import ChatComponent from './ChatComponents/ChatComponent'; // Ensure correct path
import { Upcoming } from './Appointments/upcoming';
import FindDoctor from './Find a doctor/FindDoctor';
import ContactUs from './Contactus/contactus';
import AboutUs from './About us/AboutUs';
import LoginPage from './Register/LoginPage';
import RegisterPage from './Register/RegisterPage';
import DoctorRegisterPage from './Register/DoctorRegistration';
import DoctorDashboard from './DoctorDashboard/DoctorDashboard';
import DoctorLoginPage from './Register/DocotorLogin';
import Bookingpopup from './Bookingpopup/Bookingpopup';
import VideoCall from './Appointments/VideoCall';




function App() {
  return (
    <Router>
      <div>
        <Navbar /> {/* Navbar always displayed */}
        <Routes>
          {/* Main Home Route */}
          <Route path="/" element={<Home />} />

          {/* ChatComponent Route */}
          <Route path="/talktoai" element={<ChatComponent />} />


          {/* Appointments Route */}
          <Route path="/appointments" element={<Upcoming />} />

          {/* Find a Doctor Route */}
          <Route path="/FindDoctor" element={<FindDoctor />} />

          {/* Contact Us Route */}
          <Route path="/contactus" element={<ContactUs />} />

          {/* About Us Route */}
          <Route path="/doctordashboard" element={<DoctorDashboard />} />
        
          <Route path="/doctorregister" element={<DoctorRegisterPage />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/login" element={<LoginPage />} /> {/* Login Page */}
          <Route path="/doctorlogin" element={<DoctorLoginPage />} />
         
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/pop/:doctorId" element={<Bookingpopup />} />
          <Route path="/video-call" element={<VideoCall />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
