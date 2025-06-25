import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./LoginPage.css";
import pateint from '../icons/pateintt.png';
import { useRegisterDoctorMutation } from "../features/api/docAuthApi";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const DoctorRegisterPage = () => {
    const navigate = useNavigate();
  const { user: userData } = useSelector((state) => state.auth);

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    address: "", // Added
    Age: "", // Added
    Gender: "", // Added
    profilePhoto: null,
    degreeDocument: null, // Added for PDF file
    specialization: "General Physician", // Default selection
    licenseNumber: "",
  });
  
    useEffect(() => {
      if (userData){
        alert("You are already logged in as a patient");
        navigate('/talktoai');
      }
     
    }, [userData,navigate]);


 
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profilePhoto: e.target.files[0] });
  };

  // Separate handler for license document
  const handleLicenseFileChange = (e) => {
    setFormData({ ...formData, degreeDocument: e.target.files[0] });
  };

  const [registerDoctor, { isLoading, error }] = useRegisterDoctorMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData for file uploads
    const submitData = new FormData();
    
    // Append all form fields
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== "") {
        submitData.append(key, formData[key]);
      }
    });

    try {
      const response = await registerDoctor(submitData).unwrap();
      if (response && response.success === true) {
        alert("Doctor registered successfully");
        navigate("/doctorlogin");
      }
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="image-section">
          <img src={pateint} alt="Doctor" className="patient" />
          
          <button className="register-button" onClick={() => navigate("/register")}>
            Register as Patient ↗
          </button>
        </div>

        <div className="form-section">
          <h2>Create a Doctor Account</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <input
                type="text"
                placeholder="First Name"
                className="input-field"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                className="input-field"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
            
            <textarea 
              className="input-field" 
              placeholder="Enter address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            ></textarea>
        
            <input 
              className="input-field" 
              type="number" 
              placeholder="Enter age"
              name="Age"
              value={formData.age}
              onChange={handleChange}
              required
            />
        
            <select 
              className="input-field"
              name="Gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
        
            <input
              type="email"
              placeholder="Email"
              className="input-field"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              placeholder="Phone No."
              className="input-field"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <div className="password-container">
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Password"
                className="input-field"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span className="password-toggle" onClick={togglePasswordVisibility}>
                {passwordVisible ? "🙈" : "👁"}
              </span>
            </div>

            {/* Specialization Dropdown */}
            <select
              name="specialization"
              className="input-field"
              value={formData.specialization}
              onChange={handleChange}
              required
            >
              <option value="General Physician">General Physician</option>
              <option value="Cardiologist">Cardiologist</option>
              <option value="Dermatologist">Dermatologist</option>
              <option value="Neurologist">Neurologist</option>
              <option value="Orthopedic Surgeon">Orthopedic Surgeon</option>
              <option value="Pediatrician">Pediatrician</option>
              <option value="Psychiatrist">Psychiatrist</option>
              <option value="Radiologist">Radiologist</option>
              <option value="Urologist">Urologist</option>
            </select>

            <input
              type="text"
              placeholder="License Number"
              className="input-field"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              required
            />

            <input
              type="file"
              accept="image/*"
              name="profilePhoto"
              className="input-field"
              onChange={handleFileChange}
              required
              placeholder="Upload Profile Photo"
            />

            <input
              type="file"
              accept="application/pdf"
              name="degreeDocument"
              className="input-field"
              onChange={handleLicenseFileChange}
              required
              placeholder="Upload Degree Document"
            />

            <button className="create-account-button" type="submit" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account"}
            </button>
          </form>
          {error && <p className="error-message">{error.data?.message || "Registration failed"}</p>}

          <div className="alreadyaccount">
            <h4>
              Already have an account? <Link to="/login">Login here</Link>
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorRegisterPage;