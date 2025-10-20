// import React, { useContext, useState  } from 'react';
// import { IoIosAdd, IoIosRemove } from "react-icons/io";
// import "./FAQAccordion.css";

// const FAQAccordion = ({ faqs }) => {
//   const [openIndex, setOpenIndex] = useState(null);

//   const toggleFAQ = (index) => {
//     setOpenIndex(openIndex === index ? null : index);
//   };

//   return (
//     <div className="accordion-container">
//       {faqs.map((faq, index) => (
//         <div
//           key={index}
//           className="accordion-item"
//           onClick={() => toggleFAQ(index)}
//         >
//           <div className="question">
//             {faq.question}
//             {openIndex === index ? (
//               <IoIosRemove size={20} />
//             ) : (
//               <IoIosAdd size={20} />
//             )}
//           </div>
//           {openIndex === index && <div className="answer">{faq.answer}</div>}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default FAQAccordion;


import React, { useContext, useState  } from 'react';
import { Box, Typography, Collapse } from "@mui/material";
import { IoIosAdd, IoIosRemove } from "react-icons/io";

const FAQAccordion = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '600px', margin: '20px auto' }}>
      {faqs.map((faq, index) => (
        <Box
          key={index}
          sx={{
            background: '#5D9BCF',
            color: '#021024',
            borderRadius: '10px',
            marginBottom: '10px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
            padding: '15px',
            cursor: 'pointer',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              background: '#003366',
            },
          }}
          onClick={() => toggleFAQ(index)}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {faq.question}
            </Typography>
            {openIndex === index ? (
              <IoIosRemove size={20} />
            ) : (
              <IoIosAdd size={20} />
            )}
          </Box>
          <Collapse in={openIndex === index}>
            <Typography variant="body2" sx={{ marginTop: '10px', color: '#f3e8ff' }}>
              {faq.answer}
            </Typography>
          </Collapse>
        </Box>
      ))}
    </Box>
  );
};

export default FAQAccordion;
