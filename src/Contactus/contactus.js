import React, { useState } from "react";
import "./ContactUs.css";
import email from "../icons/email.svg";
import map from "../icons/map.svg";
import phone from "../icons/phone.svg";
import contactuss from "../icons/Contact us-amico.svg"



const ContactUs = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for contacting us!");
    // You can add form submission logic here
  };

  return (
    <div className="contact-us">
      <div className="contact-form-container">
        <section className="contact-form">
          <div className="container1">
            <h1>Let's Chat, Reach Out to Us</h1>
            <p>
              Have questions or feedback? We're here to help. Send us a message,
              and we'll respond within 24 hours.
            </p>
            <form onSubmit={handleSubmit}>
             
              <div className="form-group">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Email address"
                />
              </div>
              <div className="form-group">
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Leave us a message"
                />
              </div>
              <button type="submit" className="submit-btn">
                Send Message
              </button>
            </form>
          </div>
        </section>
        <section className="contact-details">
          <div className="container1 ">
          
            <h2>Contact Information</h2>
            <div style={{display:'flex'}} className="conttt">
            
            <div className="contact-info">
              <div className="email">
              <img src={email} alt="email" />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginLeft: "8px",
                  }}
                >
                  <p style={{ margin: 0,fontSize:'24px' }}>Email</p>
                  <p style={{ margin: 0 }}>info@xpertflow.com 
                  </p>
                </div>
                
              </div>
              <div className="phone">
              <img src={phone} alt="phone" />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginLeft: "8px",
                  }}
                >
                  <p style={{ margin: 0,fontSize:'24px' }}>Phone</p>
                  <p style={{ margin: 0 }}>+92-51 889 6991
                  </p>
                </div>
              </div>
              <div className="location">
              <img src={map} alt="map" />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginLeft: "8px",
                  }}
                >
                  <p style={{ margin: 0,fontSize:'24px' }}>Location</p>
                  <p style={{ margin: 0 }}>
                  Headquarters:  XpertFlow, 39 Prince George's Park, BLK14/GSA, #12-37, S118431, Singapore.
                  </p>
                </div>
              </div>
            </div>
            <img src={contactuss} alt="landscape" style={{height:'300px',width:'100%'}}/>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ContactUs;
