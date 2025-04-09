import React, { useState } from "react";
import { IoIosAdd, IoIosRemove } from "react-icons/io";
import "./FAQAccordion.css";

const FAQAccordion = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="accordion-container">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="accordion-item"
          onClick={() => toggleFAQ(index)}
        >
          <div className="question">
            {faq.question}
            {openIndex === index ? (
              <IoIosRemove size={20} />
            ) : (
              <IoIosAdd size={20} />
            )}
          </div>
          {openIndex === index && <div className="answer">{faq.answer}</div>}
        </div>
      ))}
    </div>
  );
};

export default FAQAccordion;
