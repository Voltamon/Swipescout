import React from "react";
import Header2 from "../components/Header2";
import JobCard from "../components/JobCard";

const appliedJobs = [
  {
    company: "Google",
    title: "Senior UX Designer",
    location: "Remote",
    salary: "120K-$150K",
    posted: "2 days ago",
    status: "Applied"
  },
  {
    company: "Microsoft",
    title: "Frontend Developer",
    location: "Seattle, WA",
    salary: "$110K-$130K",
    posted: "1 day ago",
    status: "Under Review"
  }
  // Add more applied jobs as needed
];

const MyApplications = () => {
  return (
    <div>
      <header2 />
      <h2 style={{ textAlign: "center", margin: "20px 0" }}>My Applications</h2>
      <div className="job-listings">
        {appliedJobs.map((job, index) =>
          <div key={index} className="job-card">
            <h3>
              {job.title}
            </h3>
            <p>
              {job.company} - {job.location}
            </p>
            <p>
              {job.salary} • Posted {job.posted}
            </p>
            <p>
              <strong>Status:</strong> {job.status}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
