
import React, { useState, useEffect } from "react";
import "./Upcoming.css";
import calender from '../icons/calender.svg';
import videocall from '../icons/videocall.png';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useGetDoctorAppointmentsQuery, useGetUserAppointmentsQuery } from "../features/api/appointmentApi";
import socket from './socket';
import DoctorImage from './DoctorImage';

export const Upcoming = () => {
    const [isUpcoming, setIsUpcoming] = useState(true);
    const { user: userData } = useSelector((state) => state.auth);
    const { doctor: doctorData } = useSelector((state) => state.docAuth);
    const [appointments, setAppointments] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const navigate = useNavigate();

    // Determine if user or doctor is logged in
    const isUser = !!userData;
    const isDoctor = !!doctorData;

    // Add periodic refresh to check appointment status every minute
    useEffect(() => {
        // Check every minute if any appointment needs to be moved
        const intervalId = setInterval(() => {
            // Force re-filtering by setting current date
            setCurrentDate(new Date());
        }, 60000); // 60000 ms = 1 minute
        
        // Clean up on component unmount
        return () => clearInterval(intervalId);
    }, []);

    // Fetch user appointments if a user is logged in
    const {
        data: userAppointmentsData,
        isLoading: userAppointmentsLoading,
        error: userAppointmentsError
    } = useGetUserAppointmentsQuery(userData?._id, { skip: !isUser });
    

    // Fetch doctor appointments if a doctor is logged in
    const {
        data: doctorAppointmentsData,
        isLoading: doctorAppointmentsLoading,
        error: doctorAppointmentsError
    } = useGetDoctorAppointmentsQuery(doctorData?._id, { skip: !isDoctor });

    
    // Check authentication and redirect if needed
    useEffect(() => {
        if (!userData && !doctorData) {
            navigate("/login");
        }
    }, [userData, doctorData, navigate]);

    // Register with socket server
    useEffect(() => {
        const userId = userData?._id || doctorData?._id;
        if (userId) {
            socket.emit("register", { userId });
            console.log("Registered with socket server:", userId);
        }

        return () => {
            // Clean up on component unmount
            if (userId) {
                console.log("Cleaning up socket connection");
            }
        };
    }, [userData, doctorData]);

    // Handle incoming calls
    useEffect(() => {
        const handleIncomingCall = ({ from }) => {
            console.log("Incoming call from:", from);
            const myId = doctorData?._id || userData?._id;
            const roomId = [from, myId].sort().join("-");

            const accept = window.confirm("You have an incoming video call. Accept?");
            if (accept) {
                socket.emit("accept-call", { to: from });
                navigate("/video-call", {
                    state: { roomId, isInitiator: false },
                });
            }
        };

        socket.on("incoming-call", handleIncomingCall);

        return () => {
            socket.off("incoming-call", handleIncomingCall);
        };
    }, [userData, doctorData, navigate]);

    // Handle accepted calls
    useEffect(() => {
        const handleCallAccepted = () => {
            console.log("Call accepted!");
            const myId = doctorData?._id || userData?._id;
            const partnerId = localStorage.getItem("partnerId");

            if (!partnerId) {
                alert("Missing partner ID!");
                return;
            }

            const roomId = [myId, partnerId].sort().join("-");

            navigate("/video-call", {
                state: { roomId, isInitiator: true },
            });
        };

        socket.on("call-accepted", handleCallAccepted);

        return () => {
            socket.off("call-accepted", handleCallAccepted);
        };
    }, [userData, doctorData, navigate]);

    // Process appointments data when it's available
    useEffect(() => {
        if (isUser && userAppointmentsData) {
            setAppointments(userAppointmentsData.appointments || []);
            console.log("User Appointments:", userAppointmentsData);
        } else if (isDoctor && doctorAppointmentsData) {
            setAppointments(doctorAppointmentsData.appointments || []);
            console.log("Doctor Appointments:", doctorAppointmentsData);
        }
    }, [isUser, isDoctor, userAppointmentsData, doctorAppointmentsData]);

    // Handle initiating a video call
    const handleVideoCall = (partnerId, appointmentId) => {
        console.log("Initiating call to:", partnerId);
        const fromId = doctorData?._id || userData?._id;

        if (!fromId) {
            alert("You must be logged in to make a call");
            return;
        }

        if (!partnerId) {
            alert("Cannot identify the call recipient");
            return;
        }

        // Store the partner ID for when the call is accepted
        localStorage.setItem("partnerId", partnerId);

        // FOR TESTING: Skip the socket call and directly navigate to the video call page
        const roomId = [fromId, partnerId].sort().join("-");
        navigate("/video-call", {
            state: { 
                roomId, 
                isInitiator: true,
                appointmentId // Pass the appointment ID
            },
        });

        // Comment out the socket call for testing
        // socket.emit("call-user", { from: fromId, to: partnerId });
        // alert("Calling... Please wait for the other party to accept.");
    };

    // Helper function to combine date and time
    const combineDateTime = (dateStr, timeStr) => {
        try {
            const dateParts = new Date(dateStr);
            const year = dateParts.getFullYear();
            const month = String(dateParts.getMonth() + 1).padStart(2, '0');
            const day = String(dateParts.getDate()).padStart(2, '0');
            
            // Format to YYYY-MM-DD
            const formattedDate = `${year}-${month}-${day}`;
            
            // Ensure time has seconds
            const formattedTime = timeStr.includes(':') && timeStr.split(':').length === 2
                ? `${timeStr}:00`
                : timeStr;
                
            // Create appointment date using ISO format
            const appointmentDateTime = new Date(`${formattedDate}T${formattedTime}`);
            
            // Check if date is valid
            if (isNaN(appointmentDateTime.getTime())) {
                console.error("Invalid date created from:", formattedDate, formattedTime);
                return new Date(0); // Return a date in the distant past as fallback
            }
            
            return appointmentDateTime;
        } catch (error) {
            console.error("Error combining date and time:", error);
            return new Date(0); // Return a date in the distant past as fallback
        }
    };

    // Filter upcoming and past appointments based on date and time with 15-minute threshold
    const upcomingAppointments = appointments.filter(appointment => {
        // Combine date and time into a single datetime for comparison
        const appointmentDateTime = combineDateTime(appointment.date, appointment.time);
        
        // Create a time threshold 15 minutes after appointment time
        const fifteenMinutesAfterAppointment = new Date(appointmentDateTime);
        fifteenMinutesAfterAppointment.setMinutes(fifteenMinutesAfterAppointment.getMinutes() + 15);
        
        // Show in upcoming if:
        // 1. Current time is before the appointment + 15 minutes AND
        // 2. The appointment is not marked as completed
        return currentDate < fifteenMinutesAfterAppointment && appointment.status !== 'completed';
    });

    const pastAppointments = appointments.filter(appointment => {
        // Combine date and time into a single datetime for comparison
        const appointmentDateTime = combineDateTime(appointment.date, appointment.time);
        
        // Create a time threshold 15 minutes after appointment time
        const fifteenMinutesAfterAppointment = new Date(appointmentDateTime);
        fifteenMinutesAfterAppointment.setMinutes(fifteenMinutesAfterAppointment.getMinutes() + 15);
        
        // Show in past if:
        // 1. Current time is after appointment + 15 minutes OR
        // 2. The appointment is marked as completed
        return currentDate >= fifteenMinutesAfterAppointment || appointment.status === 'completed';
    });

    // Format date for display
    const formatDateTime = (dateStr, timeStr) => {
        const date = new Date(dateStr);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', options);

        // Convert time from 24h to 12h format
        const [hours, minutes] = timeStr.split(':');
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 || 12;

        return `${formattedDate} - ${formattedHour}:${minutes} ${ampm}`;
    };

    // Check if appointment time is now or in the past (for enabling video call)
    const isVideoCallAvailable = (dateStr, timeStr) => {
        const now = new Date();
        
        // Debug current time
        console.log("Current time:", now);
        
        try {
            // Convert the date string to ensure proper format (YYYY-MM-DD)
            // First, parse the input date
            const dateParts = new Date(dateStr);
            const year = dateParts.getFullYear();
            const month = String(dateParts.getMonth() + 1).padStart(2, '0');
            const day = String(dateParts.getDate()).padStart(2, '0');
            
            // Format to YYYY-MM-DD
            const formattedDate = `${year}-${month}-${day}`;
            
            // Ensure time has seconds
            const formattedTime = timeStr.includes(':') && timeStr.split(':').length === 2
                ? `${timeStr}:00`
                : timeStr;
                
            console.log(`Appointment date-time: ${formattedDate}T${formattedTime}`);
            
            // Create appointment date using ISO format
            const appointmentDateTime = new Date(`${formattedDate}T${formattedTime}`);
            
            // Check if date is valid
            if (isNaN(appointmentDateTime.getTime())) {
                console.error("Invalid date created from:", formattedDate, formattedTime);
                return false;
            }
            
            console.log("Appointment datetime:", appointmentDateTime);

            // Allow calls up to 5 minutes before appointment and anytime after
            const fiveMinutesBeforeAppointment = new Date(appointmentDateTime);
            fiveMinutesBeforeAppointment.setMinutes(fiveMinutesBeforeAppointment.getMinutes() - 5);
            
            console.log("5 minutes before:", fiveMinutesBeforeAppointment);
            console.log("Is video available:", now >= fiveMinutesBeforeAppointment);
            
            return now >= fiveMinutesBeforeAppointment;
        } catch (error) {
            console.error("Error in isVideoCallAvailable:", error);
            return false; // Be safe and disable button if there's an error
        }
    };

    // Loading state
    if (userAppointmentsLoading || doctorAppointmentsLoading) {
        return <div className="loading-container">Loading appointments...</div>;
    }

    // Error state
    if (userAppointmentsError || doctorAppointmentsError) {
        return <div className="error-container">Error loading appointments</div>;
    }

    return (
        <div className="appointments-container">
            <div className="appointments-header">
                <h1 className="appointments-title">Appointments</h1>
                <div className="toggle-container">
                    <button
                        className={`toggle-button ${isUpcoming ? "active" : ""}`}
                        onClick={() => setIsUpcoming(true)}
                    >
                        Upcoming
                    </button>
                    <button
                        className={`toggle-button ${!isUpcoming ? "active" : ""}`}
                        onClick={() => setIsUpcoming(false)}
                    >
                        Past
                    </button>
                </div>
            </div>

            <div className="appointments-section">
                <h2 className="appointments-subtitle">
                    {isUpcoming ? "Upcoming Appointments" : "Past Appointments"}
                </h2>

                {isUpcoming ? (
                    // Upcoming Appointment Section
                    <>
                        {upcomingAppointments.length > 0 ? (
                            upcomingAppointments.map((appointment) => (
                                <div className="donotmakegloble" key={appointment._id}>
                                    <div className="appointment-details">
                                        <div className="detail-item">
                                            <span className="detail-label">Doctor's Name</span>
                                            <span className="detail-value">{appointment.doctorName}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Patient's Name</span>
                                            <span className="detail-value">{appointment.userName}</span>
                                        </div>

                                        <div className="detail-item">
                                            <span className="detail-label">Date and Time</span>
                                            <span className="detail-value">
                                                {formatDateTime(appointment.date, appointment.time)}
                                            </span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Consultation Fee</span>
                                            <span className="detail-value">
                                                PKR {appointment.consultationFee}
                                            </span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Appointment Status</span>
                                            <span className="status-badge">Confirmed</span>
                                        </div>
                                        <div className="button-group">
                                            <button className="add-calendar-button">
                                                <img
                                                    className="calender-icon"
                                                    alt="Calendar icon"
                                                    src={calender}
                                                />
                                                Add to Calendar
                                            </button>
                                            <button
                                                className="add-calendar-button videocall"
                                                disabled={!isVideoCallAvailable(appointment.date, appointment.time)}
                                                onClick={() => {
                                                    if (isVideoCallAvailable(appointment.date, appointment.time)) {
                                                        handleVideoCall(
                                                            isUser ? appointment.doctorId : appointment.userId,
                                                            appointment._id  // Pass the appointment ID
                                                        );
                                                    }
                                                }}
                                                style={{
                                                    opacity: isVideoCallAvailable(appointment.date, appointment.time) ? 1 : 0.5,
                                                    cursor: isVideoCallAvailable(appointment.date, appointment.time) ? 'pointer' : 'not-allowed'
                                                }}
                                            >
                                                <img className="calender-icon" alt="Video call" src={videocall} />
                                                Video Call
                                                {!isVideoCallAvailable(appointment.date, appointment.time) &&
                                                    <span className="tooltip">Available 5 minutes before appointment</span>
                                                }
                                            </button>
                                            <button className="cancel-button">Cancel</button>
                                        </div>
                                    </div>
                                    <div className="doctor-profile-1">
                                        <DoctorImage 
                                            doctorId={appointment.doctorId} 
                                            doctorName={appointment.doctorName}
                                            className="doctor-image-1"
                                        />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-appointments">No upcoming appointments found.</div>
                        )}
                    </>
                ) : (
                    // Past Appointment Section
                    <>
                        {pastAppointments.length > 0 ? (
                            pastAppointments.map((appointment) => (
                                <div className="appointment-card" key={appointment._id}>
                                    <div className="appointment-details">
                                        <div className="detail-item">
                                            <span className="detail-label">Doctor's Name</span>
                                            <span className="detail-value">{appointment.doctorName}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Patient's Name</span>
                                            <span className="detail-value">{appointment.userName}</span>
                                        </div>

                                        <div className="detail-item">
                                            <span className="detail-label">Date and Time</span>
                                            <span className="detail-value">
                                                {formatDateTime(appointment.date, appointment.time)}
                                            </span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Consultation Fee</span>
                                            <span className="detail-value">
                                                PKR {appointment.consultationFee}
                                            </span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Rating & Review</span>
                                            <span className="detail-value">
                                                {"★".repeat(4)}{" "}
                                                <span className="rating-text">(4/5)</span>
                                            </span>
                                        </div>
                                        <button className="view-details-button">View Details</button>
                                    </div>
                                    <div className="doctor-profile-1">
                                        <DoctorImage 
                                            doctorId={appointment.doctorId} 
                                            doctorName={appointment.doctorName}
                                            className="doctor-image-1 doctor-image-2"
                                        />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-appointments">No past appointments found.</div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};