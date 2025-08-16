import React from "react";
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
  },
  {
    company: "Apple",
    title: "iOS Developer",
    location: "Cupertino, CA",
    salary: "$140K-$170K",
    posted: "4 days ago"
  }
  // Add more jobs as needed
];

const ExploreJobs = () => {
  return (
    <div>
     
      <SearchBar />
      <div className="job-listings">
        {jobs.map((job, index) => <JobCard key={index} job={job} />)}
      </div>
    </div>
  );
};

export default ExploreJobs;
