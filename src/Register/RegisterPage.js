import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import doctorImage from "../icons/docotor4.png";
import { Link } from "react-router-dom";
import { useRegisterUserMutation } from "../features/api/authApi";
import { useSelector } from "react-redux";

const RegisterPage = () => {

  const { doctor: doctorData } = useSelector((state) => state.docAuth);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });
    const navigate = useNavigate();

  useEffect(() => {
  if (doctorData) {
      alert("You are already logged in as a doctor");
      navigate("/doctordashboard");
    }
  }, [doctorData, navigate]);



  
  const [registerUser, { isLoading, error }] = useRegisterUserMutation();


  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await registerUser(formData).unwrap();
      console.log("Registration response:", response);
      if (response && response.message === "User registered successfully!") {
       alert("Registration successful! Redirecting to login page...");
       navigate("/login");
      }
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="image-section">
          <img src={doctorImage} alt="Doctor" className="doctor-image-1" />
          
          <Link to="/doctorregister" className="register-button">
  Register as Doctor ↗
</Link>

        </div>

        <div className="form-section">
          <h2>Create an account</h2>
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
                {passwordVisible ? "🙈" : "👁️"}
              </span>
            </div>
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

export default RegisterPage;
