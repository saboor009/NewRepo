import React, { useState, useEffect } from 'react';
import { FaUserMd, FaCalendarAlt, FaUserInjured, FaComments, FaUser } from 'react-icons/fa';
import './DoctorDashboard.css';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import socket from "../Appointments/socket";
import Dashboardtwo from './Dashboardtwo';
import { useUpdateDoctorMutation } from '../features/api/docAuthApi';

function DoctorDashboard() {
  const [updateDoctor,{data:updatedDoctorData,isError:updateError,isLoading:updateLoading}] = useUpdateDoctorMutation();
  const navigate = useNavigate();
  const { doctor: doctorData } = useSelector((state) => state.docAuth);
  const { user: userData } = useSelector((state) => state.auth); // Add this line to get user data

  const [activeTab, setActiveTab] = useState("Appointments");
  const [showCallDialog, setShowCallDialog] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Add new state for file uploads
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [degreeDocumentFile, setDegreeDocumentFile] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Prevent patients from accessing doctor dashboard
  useEffect(() => {
    if (userData) {
      alert("Patients cannot access the doctor dashboard");
      navigate("/"); // or navigate to patient dashboard
    }
    else if (!doctorData) {
      alert("Please login as a doctor to access this page");
      navigate("/doctorlogin");
    }
  }, [doctorData, userData, navigate]);

  // Add state for editable fields
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    email: '',
    phone: '',
    specialization: '',
    licenseNumber: '',
    address: ''
  });

  // Initialize form when editing starts
  useEffect(() => {
    if (isEditing && doctorData) {
      setEditForm({
        firstName: doctorData.firstName || '',
        lastName: doctorData.lastName || '',
        age: doctorData.Age || '',
        gender: doctorData.Gender || '',
        email: doctorData.email || '',
        phone: doctorData.phone || '',
        specialization: doctorData.specialization || '',
        licenseNumber: doctorData.licenseNumber || '',
        address: doctorData.address || ''
      });
    }
  }, [isEditing, doctorData]);

  // 🔔 Incoming call listener
  useEffect(() => {
    socket.on("incoming-call", ({ from }) => {
      setIncomingCall({ from });
      setShowCallDialog(true);
    });

    return () => socket.off("incoming-call");
  }, []);

  // 📞 Accept the call
  const acceptCall = () => {
    if (!doctorData || !doctorData._id) return;
    socket.emit("call-accepted", { from: doctorData._id, to: incomingCall.from });
    navigate("/video-call");
  };

  const handleAppointmentClick = (appointment) => setSelectedAppointment(appointment);

  // Handle profile photo selection
  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhotoFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setPreviewPhoto(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Handle degree document selection
  const handleDegreeDocumentChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDegreeDocumentFile(file);
    }
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Save doctor data with file uploads
  const handleSaveDoctorData = async () => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      
   
      Object.keys(editForm).forEach(key => {
        formData.append(key, editForm[key]);
      });
      
      // Add files if selected
      if (profilePhotoFile) {
        formData.append('profilePhoto', profilePhotoFile);
      }
      if (degreeDocumentFile) {
        formData.append('degreeDocument', degreeDocumentFile);
      }

      // Make API call to update doctor profile
      const response = await updateDoctor(formData).unwrap();
      console.log('Profile update response:', response);
      if (response.success) {
        alert('Profile updated successfully');
        setIsEditing(false);
        // Optionally, refresh doctor data or redirect
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    } finally {
      setIsUploading(false);
    }
  };

  
  const renderContent = () => {
    switch (activeTab) {
      case 'Appointments':
        return (
          <div className="section">
            <h2>Upcoming Appointments</h2>
            <div className="appointments-list">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="appointment-card" onClick={() => handleAppointmentClick(appointment)}>
                  <h3>{appointment.patientName}</h3>
                  <p><strong>Reason:</strong> {appointment.reason}</p>
                  <p><strong>Time:</strong> {appointment.time}</p>
                </div>
              ))}
            </div>
            {selectedAppointment && (
              <div className="patient-details">
                <h3>Patient Details</h3>
                <p><strong>Name:</strong> {selectedAppointment.patientName}</p>
                <p><strong>Age:</strong> {selectedAppointment.details.age}</p>
                <p><strong>Gender:</strong> {selectedAppointment.details.gender}</p>
                <p><strong>Medical History:</strong> {selectedAppointment.details.history}</p>
                <div className="consultation-notes">
                  <h4>Consultation Notes</h4>
                  <textarea placeholder="Enter consultation notes here..." className="notes-input"></textarea>
                  <button className="save-btn" onClick={() => alert('Notes saved')}>Save Notes</button>
                </div>
              </div>
            )}
          </div>
        );
      case 'Patients':
        return (
          <div className="section">
            <h2>Patient List</h2>
            <div className="patients-list">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="patient-card">
                  <h3>{appointment.patientName}</h3>
                  <p><strong>Age:</strong> {appointment.details.age}</p>
                  <p><strong>Gender:</strong> {appointment.details.gender}</p>
                  <p><strong>Last Visit:</strong> {appointment.time}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'Messages':
        return (
          <div className="section">
            <h2>Messages</h2>
            <div className="messages-list">
              <div className="message-card">
                <h3>Shabna Firdos</h3>
                <p>Hi Doctor, I have a question about my prescription.</p>
                <p><strong>Time:</strong> 10:15 AM</p>
              </div>
              <div className="message-card">
                <h3>Ali Khan</h3>
                <p>Can we reschedule my appointment?</p>
                <p><strong>Time:</strong> 11:30 AM</p>
              </div>
            </div>
          </div>
        );
      case 'Profile':
        return (
          <div className="section">
            <h2>Doctor Profile</h2>
            <div className="profile-container">
              {/* Profile Photo Section */}
              <div className="profile-photo-section">
                <div className="profile-photo">
                  <img 
                    src={previewPhoto || doctorData?.profilePhoto || '/default-doctor.png'} 
                    alt="Doctor Profile" 
                    className="profile-image"
                  />
                  {isEditing && (
                    <div className="photo-upload-overlay">
                      <input
                        type="file"
                        id="profilePhoto"
                        accept="image/*"
                        onChange={handleProfilePhotoChange}
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="profilePhoto" className="upload-btn">
                        📷 Change Photo
                      </label>
                    </div>
                  )}
                </div>
                <h3>{doctorData?.firstName} {doctorData?.lastName}</h3>
                <p className="specialization">{doctorData?.specialization}</p>
              </div>

              {/* Profile Details Section */}
              <div className="profile-details">
                {isEditing ? (
                  <div className="edit-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label>First Name:</label>
                        <input 
                          type="text" 
                          value={editForm.firstName} 
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          placeholder="Enter first name"
                        />
                      </div>
                      <div className="form-group">
                        <label>Last Name:</label>
                        <input 
                          type="text" 
                          value={editForm.lastName} 
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          placeholder="Enter last name"
                        />
                      </div>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label>Age:</label>
                        <input 
                          type="number" 
                          value={editForm.age} 
                          onChange={(e) => handleInputChange('age', e.target.value)}
                          placeholder="Enter age"
                        />
                      </div>
                      <div className="form-group">
                        <label>Gender:</label>
                        <select 
                          value={editForm.gender} 
                          onChange={(e) => handleInputChange('gender', e.target.value)}
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Email:</label>
                      <input 
                        type="email" 
                        value={editForm.email} 
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Enter email"
                      />
                    </div>

                    <div className="form-group">
                      <label>Phone:</label>
                      <input 
                        type="tel" 
                        value={editForm.phone} 
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Enter phone number"
                      />
                    </div>

                    <div className="form-group">
                      <label>Specialization:</label>
                      <input 
                        type="text" 
                        value={editForm.specialization} 
                        onChange={(e) => handleInputChange('specialization', e.target.value)}
                        placeholder="Enter specialization"
                      />
                    </div>

                    <div className="form-group">
                      <label>License Number:</label>
                      <input 
                        type="text" 
                        value={editForm.licenseNumber} 
                        onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                        placeholder="Enter license number"
                      />
                    </div>

                    <div className="form-group">
                      <label>Address:</label>
                      <textarea 
                        value={editForm.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="Enter address"
                        rows="3"
                      />
                    </div>

                    {/* File Upload Section */}
                    <div className="file-upload-section">
                      <h4>Update Documents</h4>
                      
                      <div className="form-group">
                        <label>Profile Photo:</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePhotoChange}
                          className="file-input"
                        />
                        {profilePhotoFile && (
                          <p className="file-selected">Selected: {profilePhotoFile.name}</p>
                        )}
                      </div>

                      <div className="form-group">
                        <label>Degree Document:</label>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleDegreeDocumentChange}
                          className="file-input"
                        />
                        {degreeDocumentFile && (
                          <p className="file-selected">Selected: {degreeDocumentFile.name}</p>
                        )}
                      </div>
                    </div>

                    <div className="button-group">
                      <button 
                        className="save-btn" 
                        onClick={handleSaveDoctorData}
                        disabled={isUploading}
                      >
                        {isUploading ? 'Updating...' : 'Save Changes'}
                      </button>
                      <button 
                        className="cancel-btn" 
                        onClick={() => {
                          setIsEditing(false);
                          setProfilePhotoFile(null);
                          setDegreeDocumentFile(null);
                          setPreviewPhoto(null);
                        }}
                        disabled={isUploading}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="profile-info">
                    <div className="info-grid">
                      <div className="info-card">
                        <h4>Personal Information</h4>
                        <div className="info-item">
                          <span className="label">Full Name:</span>
                          <span className="value">{doctorData?.firstName} {doctorData?.lastName}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Age:</span>
                          <span className="value">{doctorData?.Age} years</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Gender:</span>
                          <span className="value">{doctorData?.Gender}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Address:</span>
                          <span className="value">{doctorData?.address}</span>
                        </div>
                      </div>

                      <div className="info-card">
                        <h4>Contact Information</h4>
                        <div className="info-item">
                          <span className="label">Email:</span>
                          <span className="value">{doctorData?.email}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Phone:</span>
                          <span className="value">{doctorData?.phone}</span>
                        </div>
                      </div>

                      <div className="info-card">
                        <h4>Professional Information</h4>
                        <div className="info-item">
                          <span className="label">Specialization:</span>
                          <span className="value">{doctorData?.specialization}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">License Number:</span>
                          <span className="value">{doctorData?.licenseNumber}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Member Since:</span>
                          <span className="value">{new Date(doctorData?.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="info-card">
                        <h4>Documents</h4>
                        <div className="info-item">
                          <span className="label">Degree Document:</span>
                          <a 
                            href={doctorData?.degreeDocument} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="document-link"
                          >
                            📄 View Certificate
                          </a>
                        </div>
                      </div>
                    </div>

                    <button className="edit-btn" onClick={() => setIsEditing(true)}>
                      ✏️ Edit Profile
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      default:
        return <Dashboardtwo />;
    }
  };

  // Add the appointments state that was missing
  const [appointments] = useState([
    { 
      id: 1, 
      patientName: 'Sadiabano', 
      reason: 'Stomach pain', 
      time: '10:00 AM', 
      details: { 
        age: 25, 
        gender: 'Female', 
        history: 'No significant history' 
      } 
    },
    { 
      id: 2, 
      patientName: 'Shabna Firdos', 
      reason: 'Stomach pain', 
      time: '11:00 AM', 
      details: { 
        age: 30, 
        gender: 'Female', 
        history: 'Hypertension' 
      } 
    },
    { 
      id: 3, 
      patientName: 'Ali Khan', 
      reason: 'Headache', 
      time: '12:00 PM', 
      details: { 
        age: 40, 
        gender: 'Male', 
        history: 'Migraine' 
      } 
    }
  ]);

  return (
    <div className="doctor-dashboard">
      <nav className="sidebar">
        <div className="sidebar-header">
          <h2>Doctor Dashboard</h2>
        </div>
        <ul className="nav-links">
          <li>
            <button 
              className={activeTab === 'Appointments' ? 'active' : ''} 
              onClick={() => setActiveTab('Appointments')}
            >
              <FaCalendarAlt /> Appointments
            </button>
          </li>
          <li>
            <button 
              className={activeTab === 'Patients' ? 'active' : ''} 
              onClick={() => setActiveTab('Patients')}
            >
              <FaUserInjured /> Patients
            </button>
          </li>
          <li>
            <button 
              className={activeTab === 'Messages' ? 'active' : ''} 
              onClick={() => setActiveTab('Messages')}
            >
              <FaComments /> Messages
            </button>
          </li>
          <li>
            <button 
              className={activeTab === 'Profile' ? 'active' : ''} 
              onClick={() => setActiveTab('Profile')}
            >
              <FaUser /> Profile
            </button>
          </li>
        </ul>
      </nav>

      <main className="main-content">
        <header className="header">
          <h1>Welcome, Dr. {doctorData?.firstName} {doctorData?.lastName}</h1>
          <button className="logout-btn" onClick={() => navigate('/login')}>
            Logout
          </button>
        </header>
        {renderContent()}
      </main>

      {/* Incoming Call Dialog */}
      {showCallDialog && (
        <div className="call-dialog-overlay">
          <div className="call-dialog">
            <h3>📞 Incoming Call</h3>
            <p>Patient is calling you for consultation</p>
            <div className="call-actions">
              <button className="accept-btn" onClick={acceptCall}>
                Accept
              </button>
              <button className="decline-btn" onClick={() => setShowCallDialog(false)}>
                Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorDashboard;
