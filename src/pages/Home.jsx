import React from "react";
import Header2 from "../components/Header2";
import SearchBar from "../components/SearchBar";
import JobCard from "../components/JobCard";

const jobs = [
  {
    company: "Google",
    title: "Senior UX Designer",
    location: "Remote",
    salary: "120K-$150K",
    posted: "2 days ago"
  },
  {
    company: "Microsoft",
    title: "Frontend Developer",
    location: "Seattle, WA",
    salary: "$110K-$130K",
    posted: "1 day ago"
  },
  {
    company: "Amazon",
    title: "Product Manager",
    location: "New York, NY",
    salary: "$130K-$160K",
    posted: "3 days ago"
  }
  // Add more jobs as needed
];

const Home = () => {
  return (
    <div>
      <header2 />
      <SearchBar />
      <div className="job-listings">
        {jobs.map((job, index) => <JobCard key={index} job={job} />)}
      </div>
    </div>
  );
};

export default Home;
