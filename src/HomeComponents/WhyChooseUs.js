import React from "react";
import ailogo from "../icons/ailogo.png";
import homesample from "../icons/homesample.svg";
import doctorkit from "../icons/doctorkit.png";
import uparrow from "../icons/arrow-up-left.svg";
import "../HomeComponents/WhyChooseUs.css"

const whyChooseUs = [
  {
    icon: ailogo,
    title: "AI Doctor Recommendations",
    description: "AI-powered recommendations to match you with the best specialists for your needs.",
  },
  {
    icon: homesample,
    title: "Home Sample Collection",
    description: "Convenient lab test services with samples collected directly from your home.At your door steps",
  },
  {
    icon: doctorkit,
    title: ["Secure",<br></br>, "Consultations"],
    description: "Private and encrypted online consultations to keep your health data secure.",
  },
];

const WhyChooseUs = () => {
  return (
    <div className="why">
      <span style={{ color: "#49ADCA" }}>About</span>
      <h1>Why You Choose Us</h1>
      <div className="cards-container">
        {whyChooseUs.map((item, index) => (
          <div className="card" key={index}>
            <img src={item.icon} alt={item.title} />
            <h2>{item.title}</h2>
            <p>{item.description}</p>
            <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
              <button className="aboutarrow" style={{ borderRadius: "30px" }}>
                <img src={uparrow} alt="Arrow" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyChooseUs;
