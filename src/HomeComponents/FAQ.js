import React, { useState } from "react";
import chevrondown from "../icons/chevron-down.svg";
import chevronup from "../icons/chevron-up.svg";
import "./FAQ.css";

const faqs = [
  {
    question: "How does the AI recommend doctors?",
    answer: "Our AI recommends doctors based on your health profile, preferences, and ratings from other users.",
  },
  {
    question: "How do I book a lab test?",
    answer: "You can book a lab test through our app or website by selecting the test, choosing a time slot, and confirming the appointment.",
  },
  {
    question: "Is my medical data secure?",
    answer: "Yes, your medical data is protected with advanced encryption and security protocols, ensuring your privacy and confidentiality at all times.",
  },
  {
    question: "What are the payment methods available?",
    answer: "We accept various payment methods including credit cards, debit cards, and online payment services for your convenience.",
  },
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState([]); // No FAQs expanded by default


  const toggleFAQ = (index) => {
    setActiveIndex((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="faq-container">
      <span style={{ color: "#49ADCA" }}>FAQ's</span>
      <h1>Got Questions?</h1>
      <div style={{ alignItems:'center',display:'flex',flexDirection:'column'}}>
      {faqs.map((faq, index) => (
        <div
          key={index}
          className={`faq-item ${activeIndex.includes(index) ? "active" : ""}`}
          onClick={() => toggleFAQ(index)}
        >
          <div className="faq-question">
            {faq.question}
            <img
              src={activeIndex.includes(index) ? chevronup : chevrondown}
              alt={activeIndex.includes(index) ? "Collapse" : "Expand"}
              className="faq-toggle-icon"
            />
          </div>
          {activeIndex.includes(index) && <div className="faq-answer">{faq.answer}</div>}
        </div>
      ))}
      </div>
    </div>
  );
};

export default FAQ;
