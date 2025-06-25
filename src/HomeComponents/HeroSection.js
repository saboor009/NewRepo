import React, { useState, useEffect } from 'react';
import debounce from 'lodash/debounce'; 
import doctor from '../icons/homedoctor.png';
import doctor2 from '../icons/doctor2.png';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for routing

const HeroSection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate(); // Hook for navigation
  
  useEffect(() => {
    const handleResize = debounce(() => {
      setIsMobile(window.innerWidth <= 768);
    }, 100); 

    setIsMobile(window.innerWidth <= 768); // Initial check for screen size
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleChatOpen = () => {
    navigate('/talktoai'); // Navigate to the /talktoai route
  };

  const handleFindDoctor = () => {
    navigate('/FindDoctor'); // Navigate to the /FindDoctor route
  };

  return (
    <div className="main">
      {isMobile ? (
        <MobileView onChatOpen={handleChatOpen} onFindDoctor={handleFindDoctor} />
      ) : (
        <DesktopView onChatOpen={handleChatOpen} onFindDoctor={handleFindDoctor} />
      )}
    </div>
  );
};

const MobileView = ({ onChatOpen, onFindDoctor }) => (
  <>
    <h1>Your One-Stop Solution for Medical Assistance.</h1>
    <p>
      AI-powered doctor recommendations, lab tests at your doorstep,
      and convenient online consultations.
    </p>
    <img src={doctor2} alt="Doctor" className="image-mobile" />
    <button className="primaryButton-mobile" onClick={onChatOpen}>
      Talk to AI
    </button>
    <button className="secondaryButton-mobile" onClick={onFindDoctor}>
      Find a Doctor Now
    </button>
  </>
);

const DesktopView = ({ onChatOpen, onFindDoctor }) => (
  <>
    <div className="content">
      <h1 className="heading">Your One-Stop Solution for Medical Assistance.</h1>
      <p className="subheading">
        AI-powered doctor recommendations, lab tests at your doorstep,
        and convenient online consultations.
      </p>
      <div className="buttons">
        <button className="primaryButton" onClick={onChatOpen}>
          Talk to AI
        </button>
        <button className="secondaryButton" onClick={onFindDoctor}>
          Find a Doctor Now
        </button>
      </div>
    </div>
    <img src={doctor} alt="Doctor" className="image" />
  </>
);

export default HeroSection;
