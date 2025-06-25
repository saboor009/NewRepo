import React from "react";
import ai from "../icons/ai.svg";
import finddoctor from "../icons/finddoctor.svg";
import lab from "../icons/lab.svg";
import medicence from "../icons/medicence.svg";
import uparrow from "../icons/arrow-up-left.svg";
import "../HomeComponents/ServicesSection.css";

const services = [
  {
    icon: ai,
    title: "Get AI Medical Assistant",
    description:
      "Assess your symptoms instantly with our AI Medical Assistant and get personalized health recommendations, anytime, anywhere.",
  },
  {
    icon: finddoctor,
    title: "Find a Doctor",
    description:
      "Connect with top specialists for expert consultations, available at your convenience. At your door steps.",
  },
  {
    icon: lab,
    title: "Lab Test Booking",
    description:
      "Book lab tests online with home sample collection for your convenience. Get fast and reliable results delivered directly to you.",
  },
  {
    icon: medicence,
    title: "Order Medicines",
    description:
      "Order your medicines online and enjoy fast, hassle-free delivery. Stay stocked with essentials, right at your doorstep.",
  },
];

const ServicesSection = () => {
  return (
    <div className="services-container">
      <span style={{ color: "#49ADCA" }}>Services</span>
      <h1>Our Services</h1>
      <div className="services-grid">
        {services.map((service, index) => (
          <div className="service-card" key={index}>
            <div style={{ display: "flex", flexDirection: "row", marginTop: "10px" }}>
              <img src={service.icon} alt={service.title} style={{ height: "80px", width: "80px", marginRight: "20px" }} />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "24px", fontWeight: "bold" }}>{service.title}</span>
                <p>{service.description}</p>
              </div>
            </div>
            <div style={{ justifyContent: "flex-end", display: "flex", marginTop: "24px" }}>
              <button className="get-started">
                Get Started <img src={uparrow} alt="Arrow" style={{ marginLeft: "12px" }} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesSection;
