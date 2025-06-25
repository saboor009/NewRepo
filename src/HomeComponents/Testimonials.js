
import React, { useRef } from "react";
import "./Testimonials.css"; // Import CSS for styling
import star from "../icons/star.svg";

const testimonials = [
  {
    title: "I had a great check-up at Medicare health Service.",
    description:
      "I have been a patient at your Medicare health service over a year now, and I must say that I am extremely satisfied with the level.",
    author: "Jhon Drake",
    rating: 5,
  },
  {
    title: "I had a great check-up at Medicare health Service.",
    description:
      "I have been a patient at your Medicare health service over a year now, and I must say that I am extremely satisfied with the level.",
    author: "Jhon Drake",
    rating: 5,
  },
  {
    title: "I had a great check-up at Medicare health Service.",
    description:
      "I have been a patient at your Medicare health service over a year now, and I must say that I am extremely satisfied with the level.",
    author: "Jhon Drake",
    rating: 5,
  },
  {
    title: "I had a great check-up at Medicare health Service.",
    description:
      "I have been a patient at your Medicare health service over a year now, and I must say that I am extremely satisfied with the level.",
    author: "Jhon Drake",
    rating: 5,
  },
  {
    title: "I had a great check-up at Medicare health Service.",
    description:
      "I have been a patient at your Medicare health service over a year now, and I must say that I am extremely satisfied with the level.",
    author: "Jhon Drake",
    rating: 5,
  },
  {
    title: "I had a great check-up at Medicare health Service.",
    description:
      "I have been a patient at your Medicare health service over a year now, and I must say that I am extremely satisfied with the level.",
    author: "Jhon Drake",
    rating: 4,
  },
];

const Testimonials = () => {
    const scrollRef = useRef(null);
  
    const handleNextScroll = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({ left: 300, behavior: "smooth" }); // Adjust the scroll distance (300px) as needed
      }
    };
  
    return (
      <div className="testimonials-container">
        <div className="header">
          <span style={{ color: "#49ADCA" }}>Testimonials</span>
          <h1>What our Customers say</h1>
          <div className="reviews">
            <div className="reviewunder">
            <span className="stars">
              {Array.from({ length: 5 }).map((_, index) => (
                <img key={index} src={star} alt="star" className="star-icon" />
              ))}
            </span>
            <span  className="turspilot">
              200 Reviews on <span style={{ color: "#49ADCA", fontSize: "24px" }}>★</span> Trustpilot
            </span>
            </div>
            <button className="next-button" onClick={handleNextScroll}>Next  →</button>
          </div>
      
          
        </div>
        <div className="testimonials-scroll" ref={scrollRef}>
          {testimonials.map((testimonial, index) => (
            <div className="testimonial-card" key={index}>
              <h2>{testimonial.title}</h2>
              <p>{testimonial.description}</p>
              <span className="stars">
                {Array.from({ length: testimonial.rating }).map((_, idx) => (
                  <img key={idx} src={star} alt="star" className="star-small-icon" />
                ))}
              </span>
              <h3>{testimonial.author}</h3>
            </div>
          ))}
        </div>  
      </div>
    );
  };
  
  export default Testimonials;