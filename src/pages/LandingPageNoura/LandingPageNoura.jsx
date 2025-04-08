
// import React from "react";
// import { Box, Typography, Link } from "@mui/material";
// import Header3 from "../../components/Header3/Header3";
// import HeroSection from "../../components/HeroSection/HeroSection";
// import Feature from "../../components/Feature/Feature";
// import phoneImage from "../../assets/phone.png";
// import FeatureCard from "../../components/FeatureCard";
// import { LuArrowLeftRight } from "react-icons/lu";
// import TestimonialCard from "../../components/TestimonialCard";
// import news1 from "../../assets/news1.png";
// import news2 from "../../assets/news2.png";
// import news3 from "../../assets/news3.png";
// import FAQAccordion from "../../components/FAQAccordion/FAQAccordion";
// import Footer2 from "../../components/Footer2/Footer2";

// const LandingPageNoura = () => {
//   console.log("LandingPageNoura loaded");

//   const faqs = [
//     {
//       question: "How long until we deliver your first blog post?",
//       answer:
//         "Really boy law country she unable her sister. Feet you off its like like sea...",
//     },
//     {
//       question: "What are the benefits of using Swipe Scout?",
//       answer:
//         "Swipe Scout helps you find opportunities faster with AI-powered recommendations...",
//     },
//     {
//       question: "Is Swipe Scout available on mobile?",
//       answer: "Yes! Our app is available for both Android and iOS devices...",
//     },
//   ];

//   return (
//     <Box
//       sx={{
//         background: "linear-gradient(to right, #1a032a, #003366)",
//         color: "#5D9BCF",
//         fontFamily: "'Poppins', sans-serif",
//         margin: 0,
//         padding: 0,
//       }}
//     >
//       <Header3 />
//       <HeroSection />

//       <Box>
//         <Typography
//           variant="h2"
//           sx={{
//             color: "#5D9BCF",
//             textAlign: "center",
//             fontSize: "2.5rem",
//             fontWeight: "bold",
//             margin: "50px 0",
//           }}
//         >
//           What Makes Swipe Scout Unique?
//         </Typography>
//         <Box
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             gap: { xs: "40px", md: "80px" },
//             maxWidth: "1200px",
//             margin: "auto",
//             flexDirection: { xs: "column", md: "row" },
//             textAlign: { xs: "center", md: "left" },
//           }}
//         >
//           <Box
//             sx={{
//               "& img": {
//                 width: "100%",
//                 maxWidth: { xs: "280px", md: "350px" },
//                 transform: { xs: "rotate(0deg)", md: "rotate(-10deg)" },
//                 transition: "transform 0.3s ease-in-out",
//                 "&:hover": {
//                   transform: { xs: "rotate(0deg)", md: "rotate(-5deg) scale(1.05)" },
//                 },
//               },
//             }}
//           >
//             <Box component="img" src={phoneImage} alt="App Preview" />
//           </Box>
//           <Box
//             sx={{
//               maxWidth: { xs: "100%", md: "500px" },
//               display: "flex",
//               flexDirection: "column",
//               gap: "5px",
//             }}
//           >
//             <Feature
//               title="Video Resumes"
//               description="Arcu At Dictum Sapien, Mollis. Volutpatte Sit Id Accumsan, Ultricies. In Ultricies Maecenas Etiam Mauris Etiam Odio. Duis Tristique Lacus."
//             />
//             <Feature
//               sx={{ ml: { md: "60px" } }}
//               title="Swipe Feature"
//               description="Arcu At Dictum Sapien, Mollis. Volutpatte Sit Id Accumsan, Ultricies. In Ultricies Maecenas Etiam Mauris Etiam Odio. Duis Tristique Lacus."
//             />
//           </Box>
//         </Box>
//       </Box>

//       <Box sx={{ background: "#ffffff",paddingTop: "1px"}}>
//       <Box
//   sx={{
//     maxWidth: "1200px",
//     margin: "30px auto",
//     display: "flex",
//     justifyContent: "space-between",
//     flexWrap: "wrap", // يسمح للعناصر بالانتقال إلى سطر جديد على الشاشات الصغيرة
//     gap: { xs: "20px", md: "30px" }, // تقليل المسافة على الشاشات الصغيرة
//   }}
// >
//   <FeatureCard
//     sx={{
//       flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 20px)", md: "1 1 calc(33.333% - 20px)" }, // 100% على xs، 50% على sm، 33.33% على md
//       maxWidth: { xs: "100%", sm: "calc(50% - 20px)", md: "calc(33.333% - 20px)" }, // ضبط الحد الأقصى للعرض
//       minWidth: 0, // إزالة الحد الأدنى للسماح بالمرونة
//     }}
//     icon={<LuArrowLeftRight />}
//     title="Stuff"
//     description="Lorem ipsum dolor sit amet consectetur. Egestas egestas eu eleifend laoreet fringilla egestas tincidunt mauris."
//   />
//   <FeatureCard
//     sx={{
//       flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 20px)", md: "1 1 calc(33.333% - 20px)" },
//       maxWidth: { xs: "100%", sm: "calc(50% - 20px)", md: "calc(33.333% - 20px)" },
//       minWidth: 0,
//     }}
//     icon={<LuArrowLeftRight />}
//     title="Stuff"
//     description="Lorem ipsum dolor sit amet consectetur. Egestas egestas eu eleifend laoreet fringilla egestas tincidunt mauris."
//   />
//   <FeatureCard
//     sx={{
//       flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 20px)", md: "1 1 calc(33.333% - 20px)" },
//       maxWidth: { xs: "100%", sm: "calc(50% - 20px)", md: "calc(33.333% - 20px)" },
//       minWidth: 0,
//     }}
//     icon={<LuArrowLeftRight />}
//     title="Stuff"
//     description="Lorem ipsum dolor sit amet consectetur. Egestas egestas eu eleifend laoreet fringilla egestas tincidunt mauris."
//   />
// </Box>

//         <Typography
//           variant="h2"
//           sx={{
//             color: "black",
//             textAlign: "center",
//             fontSize: "2.5rem",
//             fontWeight: "bold",
//             margin: "50px 0",
//           }}
//         >
//           SwipeScout News
//         </Typography>
//         <Typography
//           variant="body1"
//           sx={{ textAlign: "center", color: "black", mb: "20px" }}
//         >
//           Here’s the latest news about SwipeScout.
//         </Typography>

//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             gap: "30px",
//             flexWrap: "wrap",
//             margin: "50px",
//           }}
//         >
//           <TestimonialCard
//             name="The Snap Pixel: How It Works and How to Install"
//             role="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra nunc ante velit vitae. Est tellus vitae, nullam lobortis enim."
//             testimonial="Read more"
//             image={news1}
//           />
//           <TestimonialCard
//             name="The Snap Pixel: How It Works and How to Install"
//             role="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra nunc ante velit vitae. Est tellus vitae, nullam lobortis enim."
//             testimonial="Read more"
//             image={news2}
//           />
//           <TestimonialCard
//             name="The Snap Pixel: How It Works and How to Install"
//             role="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra nunc ante velit vitae. Est tellus vitae, nullam lobortis enim."
//             testimonial="Read more"
//             image={news3}
//           />
//         </Box>
//         <Link
//           href="#"
//           sx={{
//             textAlign: "center",
//             textDecoration: "underline",
//             display: "block",
//             color: "#003366",
//             mb: "20px",
//           }}
//         >
//           Older News
//         </Link>
//       </Box>

//       <Typography
//         variant="h2"
//         sx={{
//           color: "#5D9BCF",
//           textAlign: "center",
//           fontSize: "2.5rem",
//           fontWeight: "bold",
//           margin: "50px 0",
//         }}
//       >
//         Frequently Ask Questions
//       </Typography>
//       <Box
//         sx={{
//           display: "grid",
//           gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
//           gap: "20px",
//           maxWidth: "1200px",
//           margin: "0 auto 50px",
//         }}
//       >
//         {faqs.map((faq, index) => (
//           <React.Fragment key={index}>
//             <FAQAccordion faqs={[faq]} />
//             {index % 2 === 0 && index + 1 < faqs.length && (
//               <FAQAccordion faqs={[faqs[index + 1]]} />
//             )}
//           </React.Fragment>
//         ))}
//       </Box>

//       <Footer2 />
//     </Box>
//   );
// };

// export default LandingPageNoura;




import React from "react"
import { Box, Typography, Link } from "@mui/material"
import Header3 from "../../components/Header3/Header3"
import HeroSection from "../../components/HeroSection/HeroSection"
import Feature from "../../components/Feature/Feature"
import phoneImage from "../../assets/phone.png"
import FeatureCard from "../../components/FeatureCard"
import { LuArrowLeftRight } from "react-icons/lu"
import TestimonialCard from "../../components/TestimonialCard"
import news1 from "../../assets/news1.png"
import news2 from "../../assets/news2.png"
import news3 from "../../assets/news3.png"
import FAQAccordion from "../../components/FAQAccordion/FAQAccordion"
import Footer2 from "../../components/Footer2/Footer2"

const LandingPageNoura = () => {
  console.log("LandingPageNoura loaded")

  const faqs = [
    {
      question: "How long until we deliver your first blog post?",
      answer: "Really boy law country she unable her sister. Feet you off its like like sea...",
    },
    {
      question: "What are the benefits of using Swipe Scout?",
      answer: "Swipe Scout helps you find opportunities faster with AI-powered recommendations...",
    },
    {
      question: "Is Swipe Scout available on mobile?",
      answer: "Yes! Our app is available for both Android and iOS devices...",
    },
  ]

  return (
    <Box
      sx={{
        background: "linear-gradient(to right, #1a032a, #003366)",
        color: "#5D9BCF",
        fontFamily: "'Poppins', sans-serif",
        margin: 0,
        padding: 0,
      }}
    >
      <Header3 />
      <HeroSection />

      <Box>
        <Typography
          variant="h2"
          sx={{
            color: "#5D9BCF",
            textAlign: "center",
            fontSize: "2.5rem",
            fontWeight: "bold",
            margin: "50px 0",
          }}
        >
          What Makes Swipe Scout Unique?
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: { xs: "40px", md: "80px" },
            maxWidth: "1200px",
            margin: "auto",
            flexDirection: { xs: "column", md: "row" },
            textAlign: { xs: "center", md: "left" },
          }}
        >
          <Box
            sx={{
              "& img": {
                width: "100%",
                maxWidth: { xs: "280px", md: "350px" },
                transform: { xs: "rotate(0deg)", md: "rotate(-10deg)" },
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                  transform: { xs: "rotate(0deg)", md: "rotate(-5deg) scale(1.05)" },
                },
              },
            }}
          >
            <Box component="img" src={phoneImage} alt="App Preview" />
          </Box>
          <Box
            sx={{
              maxWidth: { xs: "100%", md: "500px" },
              display: "flex",
              flexDirection: "column",
              gap: "5px",
            }}
          >
            <Feature
              title="Video Resumes"
              description="Arcu At Dictum Sapien, Mollis. Volutpatte Sit Id Accumsan, Ultricies. In Ultricies Maecenas Etiam Mauris Etiam Odio. Duis Tristique Lacus."
            />
            <Feature
              sx={{ ml: { md: "60px" } }}
              title="Swipe Feature"
              description="Arcu At Dictum Sapien, Mollis. Volutpatte Sit Id Accumsan, Ultricies. In Ultricies Maecenas Etiam Mauris Etiam Odio. Duis Tristique Lacus."
            />
          </Box>
        </Box>
      </Box>

      <Box sx={{ background: "#ffffff", padding: "60px 20px" }}>
        <Box
          sx={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: { xs: "30px", md: "40px" },
          }}
        >
          <FeatureCard
            sx={{
              flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 20px)", md: "1 1 calc(33.333% - 30px)" },
              maxWidth: { xs: "100%", sm: "calc(50% - 20px)", md: "calc(33.333% - 30px)" },
              minWidth: { xs: "280px", sm: "320px" },
              margin: "0",
            }}
            icon={<LuArrowLeftRight />}
            title="Stuff"
            description="Lorem ipsum dolor sit amet consectetur. Egestas egestas eu eleifend laoreet fringilla egestas tincidunt mauris."
          />
          <FeatureCard
            sx={{
              flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 20px)", md: "1 1 calc(33.333% - 30px)" },
              maxWidth: { xs: "100%", sm: "calc(50% - 20px)", md: "calc(33.333% - 30px)" },
              minWidth: { xs: "280px", sm: "320px" },
              margin: "0",
            }}
            icon={<LuArrowLeftRight />}
            title="Stuff"
            description="Lorem ipsum dolor sit amet consectetur. Egestas egestas eu eleifend laoreet fringilla egestas tincidunt mauris."
          />
          <FeatureCard
            sx={{
              flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 20px)", md: "1 1 calc(33.333% - 30px)" },
              maxWidth: { xs: "100%", sm: "calc(50% - 20px)", md: "calc(33.333% - 30px)" },
              minWidth: { xs: "280px", sm: "320px" },
              margin: "0",
            }}
            icon={<LuArrowLeftRight />}
            title="Stuff"
            description="Lorem ipsum dolor sit amet consectetur. Egestas egestas eu eleifend laoreet fringilla egestas tincidunt mauris."
          />
        </Box>
      

      <Typography
        variant="h2"
        sx={{
          color: "black",
          textAlign: "center",
          fontSize: "2.5rem",
          fontWeight: "bold",
          margin: "50px 0",
        }}
      >
        SwipeScout News
      </Typography>
      <Typography variant="body1" sx={{ textAlign: "center", color: "black", mb: "20px" }}>
        Here’s the latest news about SwipeScout.
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: "30px",
          flexWrap: "wrap",
          margin: "50px",
        }}
      >
        <TestimonialCard
          name="The Snap Pixel: How It Works and How to Install"
          role="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra nunc ante velit vitae. Est tellus vitae, nullam lobortis enim."
          testimonial="Read more"
          image={news1}
        />
        <TestimonialCard
          name="The Snap Pixel: How It Works and How to Install"
          role="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra nunc ante velit vitae. Est tellus vitae, nullam lobortis enim."
          testimonial="Read more"
          image={news2}
        />
        <TestimonialCard
          name="The Snap Pixel: How It Works and How to Install"
          role="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra nunc ante velit vitae. Est tellus vitae, nullam lobortis enim."
          testimonial="Read more"
          image={news3}
        />
      </Box>
      <Link
        href="#"
        sx={{
          textAlign: "center",
          textDecoration: "underline",
          display: "block",
          color: "#003366",
          mb: "20px",
        }}
      >
        Older News
      </Link>
      </Box>
      

      <Typography
        variant="h2"
        sx={{
          color: "#5D9BCF",
          textAlign: "center",
          fontSize: "2.5rem",
          fontWeight: "bold",
          margin: "50px 0",
        }}
      >
        Frequently Ask Questions
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
          gap: "20px",
          maxWidth: "1200px",
          margin: "0 auto 50px",
        }}
      >
        {faqs.map((faq, index) => (
          <React.Fragment key={index}>
            <FAQAccordion faqs={[faq]} />
            {index % 2 === 0 && index + 1 < faqs.length && <FAQAccordion faqs={[faqs[index + 1]]} />}
          </React.Fragment>
        ))}
      </Box>

      <Footer2 />
    </Box>
  )
}

export default LandingPageNoura

