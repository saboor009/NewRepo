
import React, { useEffect, useState } from 'react';
import './Pop.css';
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from 'react-redux';
import { useGetDocDetailQuery } from '../features/api/docAuthApi';
import { useCreateAppointmentMutation } from '../features/api/appointmentApi';

const Bookingpopup = () => {
    const navigate = useNavigate();
    const {user:userData} = useSelector((state) => state.auth);
    const {doctor:doctorData} = useSelector((state) => state.docAuth);
    console.log("Doctor Data:", doctorData);
    console.log("User Data:", userData);

    const params = useParams();
    const doctorId = params.doctorId;

    // Keep the query at component level - this is the right approach
    const { data: docDetail, error: docDetailError, isLoading } = useGetDocDetailQuery(doctorId);
    console.log("Doctor Detail:", docDetail);

    // State for selected date and time
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");

    const [createAppointment, { isLoading: isCreating, error: createError , data: appointmentData}] = useCreateAppointmentMutation();

    useEffect(() => {
        if (doctorData) {
            alert("Doctor cannot access this page");
            navigate("/doctordashboard");
        }
        else if (!userData) {
            navigate("/userlogin");
        }
    }, [doctorData, userData, navigate]);

    const closepopup = () => {
        navigate('/FindDoctor');
    };

    // Generate available dates (next 30 days, excluding Sundays)
    const getAvailableDates = () => {
        const dates = [];
        const today = new Date();
        
        for (let i = 0; i < 30; i++) {
            const date = new Date();
            date.setDate(today.getDate() + i);
            
            // Skip Sundays (0 = Sunday in JavaScript's getDay())
            if (date.getDay() !== 0) {
                dates.push({
                    value: date.toISOString().split('T')[0],
                    label: date.toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                    })
                });
            }
        }
        
        return dates;
    };

    const handleAppointmentCreation = async () => {
        if (!selectedDate || !selectedTime) {
            alert("Please select both date and time.");
            return;
        }
        const appointmentData = {
            doctorId: docDetail.doctor._id,
            userId: userData._id,
            doctorName: `${docDetail.doctor.firstName} ${docDetail.doctor.lastName}`,
            userName: `${userData.firstName} ${userData.lastName}`,
            date: selectedDate,
            time: selectedTime,
            consultationFee: docDetail.doctor.specialization === "Cardiologist" ? 2000 : 1500,
        };
        console.log("Appointment Data:", appointmentData);
        try {
            const response = await createAppointment(appointmentData).unwrap();
            console.log("Appointment Created:", response);
            alert("Appointment created successfully!");
            navigate('/appointments');
        } catch (error) {
            console.error("Error creating appointment:", error);
            alert("Failed to create appointment. Please try again.");
        }

       
    }


    // Generate time slots between 11 AM and 4 PM in 30-minute intervals
    const getTimeSlots = () => {
        const slots = [];
        const start = 11; // 11 AM
        const end = 16;   // 4 PM (16:00)
        
        for (let hour = start; hour < end; hour++) {
            for (let minutes = 0; minutes < 60; minutes += 30) {
                // Skip 4:30 PM since office hours end at 4 PM
                if (hour === 16 && minutes === 30) continue;
                
                const timeString = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                
                // Format for display (12-hour format with AM/PM)
                let displayHour = hour;
                if (displayHour > 12) {
                    displayHour = displayHour - 12;
                }
                const period = hour >= 12 ? 'PM' : 'AM';
                const displayTime = `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`;
                
                slots.push({
                    value: timeString,
                    label: displayTime
                });
            }
        }
        
        return slots;
    };

    // Handle date selection
    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
        // Reset time when date changes
        setSelectedTime("");
    };

    // Handle time selection
    const handleTimeChange = (e) => {
        setSelectedTime(e.target.value);
    };

    // Handle loading state
    if (isLoading) {
        return <div className="loading-container">Loading doctor details...</div>;
    }

    // Handle error state
    if (docDetailError || !docDetail) {
        return <div className="error-container">
            <h2>Error loading doctor details</h2>
            <button onClick={closepopup}>Go Back</button>
        </div>;
    }

    // Get the available time slots
    const availableTimeSlots = getTimeSlots();

    return (
        <div className="pop">
            <div className="booking-popup">
                <div className="booking-header">
                    <div className="booking-info">
                        <div className='image-pop'>
                            {docDetail?.doctor?.profilePhoto ? (
                                <img 
                                    src={docDetail.doctor.profilePhoto}
                                    alt={`Dr. ${docDetail.doctor.firstName} ${docDetail.doctor.lastName}`}
                                    onError={(e) => {
                                        e.target.src = '/default-doctor-avatar.png'; // fallback image
                                    }}
                                />
                            ) : (
                                <div className="no-image-placeholder">
                                    <span>No Image</span>
                                </div>
                            )}
                        </div>
                        <div>
                            <h1>{docDetail.doctor.firstName} {docDetail.doctor.lastName}</h1>
                            <h3>{docDetail.doctor.specialization}</h3>
                        </div>
                    </div>
                    <p className="cross-button" onClick={closepopup}>✕</p>
                </div>

                <h4 className="section-title">Laboratory Overview</h4>

                <div className="info-boxes">

                    <div className='info-box'>
                        <h5>Contact Information:</h5>
                        <p>{docDetail.doctor.phone}</p>
                        <p>{docDetail.doctor.email}</p>
                    </div>

                    <div className='info-box'>
                        <h5>Hours of Operation</h5>
                        <p>Mon-Sat,</p>
                        <p>11 AM - 4 PM</p>
                    </div>
                </div>

               
                <div className="select-row">
                    <div className='selects'>
                        <h4>Select Date:</h4>
                        <select 
                            value={selectedDate} 
                            onChange={handleDateChange}
                        >
                            <option value="">Select Date</option>
                            {getAvailableDates().map((date, index) => (
                                <option key={index} value={date.value}>
                                    {date.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='selects'>
                        <h4>Select Time:</h4>
                        <select 
                            value={selectedTime} 
                            onChange={handleTimeChange}
                            disabled={!selectedDate}
                        >
                            <option value="">Select Time</option>
                            {availableTimeSlots.map((time, index) => (
                                <option key={index} value={time.value}>
                                    {time.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="priceinfo">
                    <div className="buttons">
                        <button onClick={handleAppointmentCreation}>Book Appointment</button>
                    </div>
                </div>
            </div>
            </div>
    );
};

export default Bookingpopup;