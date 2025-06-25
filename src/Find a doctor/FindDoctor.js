import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./FindDoctor.css";
import filter from "../icons/Filter.svg";
import doctor2 from "../icons/doctor3.png";
import starr from "../icons/Star 3.svg";
import chevronleft from "../icons/chevron-left.svg";
import searchIcon from "../icons/search.svg";
import { useSelector } from "react-redux";

const FindDoctor = () => {
  const navigate = useNavigate();
   const {user:userData} = useSelector((state) => state.auth);
   const {doctor:doctorData} = useSelector((state) => state.docAuth);
  console.log("Doctor Data:", doctorData);
  console.log("User Data:", userData);

  useEffect(() => {
    if (doctorData) {
      alert("Doctor cannot access this page");
      navigate("/doctordashboard");
    }
    else if (!userData) {
      navigate("/userlogin");
    }
  }, [doctorData, userData, navigate]);

  // State for doctors data
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [doctorsPerPage] = useState(6);
  
  // State for search and filtering
  const [searchTerm, setSearchTerm] = useState("");
  const [doctorType, setDoctorType] = useState("all");
  
  // State for more advanced filters
  const [filters, setFilters] = useState({
    type: "",
    location: "",
    gender: "",
    rating: "",
    availability: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    },
  });



  // Fetch doctors from API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        // Add a simple request timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await fetch("https://backend-df5y.onrender.com/api/v1/doctors/allDisplay", {
          signal: controller.signal,
          // Add credentials if your API requires authentication
          credentials: 'include'
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Fetched Doctors:", data);
        
        if (!data || !data.doctors || !Array.isArray(data.doctors)) {
          console.warn("API returned unexpected data structure:", data);
          throw new Error("Unexpected data format from API");
        }
        
        // Transform the API data to match our expected format
        const transformedDoctors = data.doctors.map(doctor => ({
          id: doctor._id,
          name: `Dr. ${doctor.firstName} ${doctor.lastName}`,
          specialty: doctor.specialization || "General Physician",
          location: doctor.address || "Location not provided",
          experience: doctor.experience || "Experience not provided",
          consultationFee: doctor.consultationFee || 2000,
          rating: doctor.rating || 4.5,
          availableNow: Math.random() > 0.5, // Random availability for demonstration
          profilePhoto: doctor.profilePhoto,
          phone: doctor.phone || "Not provided",
          gender: doctor.Gender || doctor.gender || "Not specified" // Add gender field
        }));
        
        setDoctors(transformedDoctors);
      } catch (err) {
        // Ignore abort errors as they're expected when component unmounts
        if (err.name === 'AbortError') {
          console.log('Fetch aborted');
          return;
        }
        
        console.error("Error fetching doctors:", err);
        setError(err.message);
        
        // Fallback to mock data if API fails
        const mockDoctors = [
          {
            id: 1,
            name: "Dr. Nida Ali",
            specialty: "General Practitioner",
            location: "Lahore, Punjab",
            experience: "10 years in practice",
            consultationFee: 3000,
            rating: 4.9,
            availableNow: true,
            phone: "+92 300 1234567",
            gender: "Female"
          },
          {
            id: 2,
            name: "Dr. Ayesha Khan",
            specialty: "Cardiologist",
            location: "Karachi, Sindh",
            experience: "12 years in practice",
            consultationFee: 5000,
            rating: 4.8,
            availableNow: false,
            phone: "+92 300 7654321",
            gender: "Female"
          },
          {
            id: 3,
            name: "Dr. Asim Raza",
            specialty: "Neurologist",
            location: "Islamabad, Capital Territory",
            experience: "8 years in practice",
            consultationFee: 4000,
            rating: 4.7,
            availableNow: true,
            phone: "+92 300 1122334",
            gender: "Male"
          },
          {
            id: 4,
            name: "Dr. Sana Tariq",
            specialty: "Dermatologist",
            location: "Rawalpindi, Punjab",
            experience: "7 years in practice",
            consultationFee: 3500,
            rating: 4.6,
            availableNow: true,
            phone: "+92 300 5566778",
            gender: "Female"
          },
          {
            id: 5,
            name: "Dr. Faisal Ahmed",
            specialty: "Orthopedic Surgeon",
            location: "Faisalabad, Punjab",
            experience: "15 years in practice",
            consultationFee: 6000,
            rating: 4.9,
            availableNow: false,
            phone: "+92 300 9988776",
            gender: "Male"
          },
          {
            id: 6,
            name: "Dr. Sara Malik",
            specialty: "Pediatrician",
            location: "Multan, Punjab",
            experience: "5 years in practice",
            consultationFee: 2000,
            rating: 4.5,
            availableNow: true,
            phone: "+92 300 1324354",
            gender: "Female"
          },
        ];
        
        console.log("Using mock data as fallback");
        setDoctors(mockDoctors);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
    
    // Clean up function for when component unmounts
    return () => {
      console.log("FindDoctor component unmounted");
    };
  }, []);

  // Handle doctor card click
  const handleDoctorClick = (doctorId) => {
    navigate(`/pop/${doctorId}`);
  };
  
  

  // Reset to first page when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, doctorType, filters]);

  // Filter doctors based on search term, doctor type, and other filters
  const filteredDoctors = doctors.filter((doctor) => {
    // Basic search filter
    const fullName = doctor.name.toLowerCase();
    const specialization = doctor.specialty.toLowerCase();
    const matchesSearch = !searchTerm || 
                          fullName.includes(searchTerm.toLowerCase()) || 
                          specialization.includes(searchTerm.toLowerCase());
    
    // Doctor type filter
    const matchesType = doctorType === "all" || 
                        doctor.specialty.toLowerCase() === doctorType.toLowerCase();
    
    // More advanced filters with case-insensitive gender matching
    const matchesGender = !filters.gender || doctor.gender.toLowerCase() === filters.gender.toLowerCase();
    const matchesMoreFilters = 
      (!filters.type || doctor.specialty.includes(filters.type)) &&
      (!filters.location || doctor.location.toLowerCase().includes(filters.location.toLowerCase())) &&
      matchesGender &&
      (!filters.rating || doctor.rating >= parseFloat(filters.rating));
    
    // Debug logging
    if (filters.gender) {
      console.log(`Doctor: ${doctor.name}, Gender: "${doctor.gender}", Filter: "${filters.gender}", Matches: ${matchesGender}`);
    }
    
    return matchesSearch && matchesType && matchesMoreFilters;
  });

  // Calculate pagination
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

  // Pagination function
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="find-doctor-container">
      <div className="find-doctor-header">
        <h1>Find Your Doctor</h1>
        <p>Browse our list of qualified medical professionals and book your appointment.</p>
      </div>

      {/* Search container */}
      <div style={{justifyContent:'center',display:'flex'}}>
        <div className="search-container1">
          <select 
            className="doctor-dropdown"
            value={doctorType}
            onChange={(e) => setDoctorType(e.target.value)}
          >
            <option value="all">All Doctors</option>
            <option value="General Practitioner">General Practitioner</option>
            <option value="Cardiologist">Cardiologist</option>
            <option value="Neurologist">Neurologist</option>
            <option value="Dermatologist">Dermatologist</option>
            <option value="Orthopedic Surgeon">Orthopedic Surgeon</option>
            <option value="Pediatrician">Pediatrician</option>
          </select>
          <img src={searchIcon} alt="Search Icon" className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search the best doctor"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Main content area with filters and doctor list */}
      <div className="filtersection-doctorlist">
        {/* Filters Section */}
        <div className="filters-section">
          <div className="filterheading">
            <h2>Filters</h2>
            <img src={filter} alt="filter funnel" className="filter-icon" />
          </div>

          <form>
            <label>
              Type of Doctor:
              <select
                name="type"
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              >
                <option value="">Select</option>
                <option value="General Practitioner">General Practitioner</option>
                <option value="Cardiologist">Cardiologist</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Dermatologist">Dermatologist</option>
              </select>
            </label>

            <label>
              Location:
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                placeholder="Enter location"
              />
            </label>

            <label>
              Gender:
              <select
                name="gender"
                value={filters.gender}
                onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </label>

            <label>
              Rating:
              <select
                name="rating"
                value={filters.rating}
                onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
              >
                <option value="">Select</option>
                <option value="4">4+</option>
                <option value="4.5">4.5+</option>
              </select>
            </label>

            <h3>Availability:</h3>
            <div className="availability-container">
              {[
                "monday",
                "tuesday",
                "wednesday",
                "thursday",
                "friday",
                "saturday",
                "sunday",
              ].map((day) => (
                <label key={day}>
                  {day.charAt(0).toUpperCase() + day.slice(1)}:
                  <input
                    type="checkbox"
                    className="checkboxx"
                    name={day}
                    checked={filters.availability[day]}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        availability: {
                          ...filters.availability,
                          [day]: e.target.checked,
                        },
                      })
                    }
                  />
                </label>
              ))}
            </div>
          </form>
        </div>

        {/* Doctors List Section */}
        <div className="doctors-list">
          {loading ? (
            <div className="loading-message">Loading doctors...</div>
          ) : error && doctors.length === 0 ? (
            <div className="error-message">
              {error}. Please check your connection or try again later.
            </div>
          ) : currentDoctors.length === 0 ? (
            <div className="no-doctors-found">No doctors match your search criteria.</div>
          ) : (
            currentDoctors.map((doctor) => (
              <div 
                key={doctor.id} 
                className="doctor-card"
              >
                <div className="doctor-card-header">
                  <div className="doctor-main">
                    <div style={{ display: "flex", gap: "8px" }}>
                      <img
                        src={doctor.profilePhoto || doctor2}
                        alt={`${doctor.name} profile`}
                        className="doctor-image"
                        onError={(e) => {e.target.src = doctor2; e.target.onerror = null;}}
                      />
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                        }}
                      >
                        <h3
                          style={{
                            margin: 0,
                            fontSize: "20px",
                            marginBottom: "8px",
                          }}
                        >
                          {doctor.name}
                        </h3>
                        <span
                          style={{ margin: 0, fontSize: "16px", fontWeight: 550 }}
                        >
                          {doctor.specialty}
                        </span>
                        <p className="doctor-phone">📞 {doctor.phone}</p>
                      </div>
                    </div>

                    <div className="doctor-rating">
                      <img src={starr} alt="star"/>
                      <span>{doctor.rating}</span>
                    </div>
                  </div>
                  <div className="doctor-info">
                    <p>
                      Location:
                      <br />
                      <span className="info-value">{doctor.location}</span>
                    </p>
                    <p>
                      Experience:
                      <br />
                      <span className="info-value">{doctor.experience}</span>
                    </p>
                    <div className="consultation-row">
                      <p>
                        Consultation Fee:{" "}
                        <span className="info-value">
                          PK {doctor.consultationFee}
                        </span>
                      </p>
                      {doctor.availableNow && (
                        <span className="available-now">Available Now</span>
                      )}
                    </div>
                  </div>
                </div>
                <button 
                  className="book-appointment-button"
                  onClick={() => {handleDoctorClick(doctor.id)}}
                >
                  Book Appointment
                  <img src={chevronleft} alt='chevron' />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pagination Section */}
      {!loading && filteredDoctors.length > doctorsPerPage && (
        <div className="pagination-container">
          <button
            onClick={() => paginate(currentPage - 1)}
            className="pagination-button"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {Array.from(
            { length: Math.ceil(filteredDoctors.length / doctorsPerPage) },
            (_, i) => (
              <button
                key={i + 1}
                className={`pagination-number ${
                  currentPage === i + 1 ? "active" : ""
                }`}
                onClick={() => paginate(i + 1)}
              >
                {i + 1}
              </button>
            )
          )}
          <button
            onClick={() => paginate(currentPage + 1)}
            className="pagination-button"
            disabled={currentPage === Math.ceil(filteredDoctors.length / doctorsPerPage)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default FindDoctor;