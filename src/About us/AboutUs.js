import React from "react";
import "./AboutUs.css";
import heath from "../icons/Healthy lifestyle-cuate.svg";
import calender from "../icons/calendar.svg";
import mangament from "../icons/management.svg";
import lab from "../icons/lab2.svg";

const AboutUs = () => {
  return (
    <div className="about-us">
      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-content">
          <h1>Welcome to <span className="highlight">MedEase</span></h1>
          <p>
            Your one-stop platform for seamless healthcare solutions. From booking appointments to managing lab tests and medical records, we've got you covered.
          </p>
          <button className="cta-button">Discover More</button>
        </div>
        <div className="hero-image">
          <img src={heath} alt="Healthcare illustration"  />
        </div>
      </header>

      {/* Mission Section */}
      <section className="mission-section">
        <h2>Our Mission</h2>
        <p>
          To revolutionize healthcare by bridging the gap between patients and providers. We believe in a future where healthcare is easy, accessible, and stress-free.
        </p>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>What Makes Us Special</h2>
        <div className="features-grid">
          <div className="feature-card">
            <img src={calender} alt="Appointment Booking" className="feature-icons"/>
            <h3>Instant Appointments</h3>
            <p>Book consultations with leading healthcare professionals in just a few clicks.</p>
          </div>
          <div className="feature-card">
            <img src={mangament} alt="Record Management"  className="feature-icons" />
            <h3>Digital Health Records</h3>
            <p>Access your medical history anytime, anywhere, securely stored on our platform.</p>
          </div>
          <div className="feature-card">
            <img src={lab} alt="Lab Tests" className="feature-icons" />
            <h3>Lab Test Bookings</h3>
            <p>Conveniently book lab tests and receive results directly through your account.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2>What Our Users Say</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <p>"HealthCareConnect has made managing my health so much easier. The appointment booking system is a lifesaver!"</p>
            <h4>- Sarah W.</h4>
          </div>
          <div className="testimonial-card">
            <p>"The lab services are quick and reliable. I love having all my results in one place."</p>
            <h4>- James L.</h4>
          </div>
          <div className="testimonial-card">
            <p>"The digital records feature has been a game-changer for me. No more worrying about misplaced files!"</p>
            <h4>- Emily R.</h4>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <h2>Ready to Simplify Your Healthcare Journey?</h2>
        <p>Join thousands of happy users who trust HealthCareConnect for their healthcare needs.</p>
        <button className="cta-button">Get Started Today</button>
      </section>

      {/* Footer */}
      <footer className="about-footer">
        <p>© 2024 MedEase. Designed for better health management.</p>
      </footer>
    </div>
  );
};

export default AboutUs;
