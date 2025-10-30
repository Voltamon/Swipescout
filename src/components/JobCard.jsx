import React, { useContext } from "react";

const JobCard = ({ job }) => {
  return (
    <div className="job-card">
      <h3>
        {job.title}
      </h3>
      <p>
        {job.company} - {job.location}
      </p>
      <p>
        {job.salary} â€¢ Posted {job.posted}
      </p>
      <button>Apply Now</button>
      <button>Save</button>
    </div>
  );
};

export default JobCard;
