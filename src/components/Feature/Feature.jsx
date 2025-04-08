// import React from "react";

// const Feature = ({ title, description, style }) => {
//   return (
//     <div className="feature" style={style}>
//       <p className="advantage" style={{fontSize:'8px'}}>ADVANTAGES</p>
//       <p className="title" style={{fontSize:'18px'}}>{title}</p>
//       <p className="stuff">🔔 <strong>Some Stuff</strong></p>
//       <p>{description}</p>
//     </div>
//   );
// };

// export default Feature;


import React from "react";
import { Box, Typography } from "@mui/material";

// ====== Component ======

const Feature = ({ title, description, style }) => {
  return (
    <Box className="feature" style={style}>
      <Typography variant="body2" sx={{ fontSize: '8px', fontWeight: 'bold' }}>
        ADVANTAGES
      </Typography>
      <Typography variant="h6" sx={{ fontSize: '18px', fontWeight: 'bold' }}>
        {title}
      </Typography>
      <Typography variant="body2">
        🔔 <strong>Some Stuff</strong>
      </Typography>
      <Typography variant="body1">
        {description}
      </Typography>
    </Box>
  );
};

export default Feature;
