import { Link } from 'react-router-dom';
import './Navigationbar.css'; 


const Navbar = () => {
  return <div>
      <nav className="navbar">
 
        <Link to="/auth-page">Login Page</Link>
        <Link to="/video-feed">Video Feed</Link>
        <Link to="/Employer-explore-sidebar">Job Seekers Videos Style</Link>
        <Link to="/Employer-explore">Job Seekers Videos_Search</Link>
        <Link to="/Job-seeker-explore">Employers Videos_Search</Link>
        <Link to="/Settings-page">Settings Page_Need Editing</Link>
      </nav>
      <hr />
      <nav className="navbar">
      
        <Link to="/register-form">Register Form</Link>
        <Link to="/login-form">Login Form</Link>
        <Link to="/dashboard-jobseeker">Dashboard Jobseeker1</Link>
        <Link to="/job-search">Search Jobs</Link>
        <Link to="/candidate-profile">Candidate Profile</Link>
        <Link to="/job-posting">Job Posting Form</Link>
        <Link to="/video-upload">Upload Video Resume</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/inbox">Inbox</Link>
        <Link to="/feed-page">Feed Page_oldStyle</Link>
      </nav>
      <nav className="navbar">
        <Link to="/dashboard">Job Seeker Dashboard2</Link>
        <Link to="/employer-dashboard">Employer Dashboard</Link>
        <Link to="/candidate-search">Search for a Job Seeker</Link>
        <Link to="/post-job">Post Job2</Link>
        <Link to="/job/1">Job Details</Link> {/* example ID */}
     
        <Link to="/admin-dashboard">Admin Dashboard</Link>

      </nav>
      <hr />
      <div>
      <h3>OthPages: </h3>
      <nav className="navbar">
        <Link to="/">Landing Page Noura</Link>
        <Link to="/view-login">Temp Login Page</Link>
        <Link to="/login">Login Page</Link>
        <Link to="/about">About Page</Link>
        <Link to="/FAQs">FAQs Page</Link>
        <Link to="/unauthorized">Unauthorized Page</Link>
        <Link to="/feed">Video Feed (New)</Link>
        <Link to="/chat">Chat</Link>
        <Link to="/settings">Settings (New)</Link>
        <Link to="/job-seeker/dashboard">Job Seeker Dashboard (New)</Link>
        <Link to="/job-videos">Job Videos</Link>
        <Link to="/employer/dashboard">Employer Dashboard (New)</Link>
        <Link to="/company-videos">Company Videos</Link>
        <Link to="/MyApplications-page">My Applications</Link>
        <Link to="/PagesNavigation">Landing Page (Old)</Link>
      </nav>
      <hr />
    </div>
    </div>;
};

   
export default Navbar;