import { Link } from 'react-router-dom';
import './Navbar.css'; // optional for styling
import { Container } from 'lucide-react';

const Navbar = () => {
  return <div>
      <nav className="navbar">
        {/* <Link to="/">Landing</Link>
        {/* <Link to="/login">Login</Link>
      <Link to="/signup">Signup</Link>
      <Link to="/Home2">Home2</Link>
      <Link to="/explore-jobs">Explore Jobs</Link>
      <Link to="/my-applications">My Applications</Link>
      <Link to="/profile">Profile</Link> */}
        <Link to="/auth-page">Login Page</Link>
        <Link to="/video-feed">Video Feed</Link>
        <Link to="/Employer-explore-sidebar">Job Seekers Videos Style</Link>
        <Link to="/Employer-explore">Job Seekers Videos_Search</Link>
        <Link to="/Job-seeker-explore">Employers Videos_Search</Link>
        <Link to="/Settings-page">Settings Page_Need Editing</Link>
      </nav>
      <hr />
      <nav className="navbar">
        {/* <Link to="/PagesNavigation">App Page</Link> */}//
        <Link to="/register-form">Register Form</Link>
        <Link to="/login-form">Login Form</Link>
        <Link to="/dashboard-jobseeker">Dashboard Jobseeker1</Link>
        <Link to="/job-search">Search Jobs</Link>
        <Link to="/candidate-profile">Candidate Profile</Link>
        <Link to="/job-posting">Job Posting Form</Link>
        <Link to="/video-resume-upload">Upload Video Resume</Link>
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
        {/*<Link to="/search">Search for Jobs</Link>*/}
        <Link to="/admin-dashboard">Admin Dashboard</Link>
        {/* <Link to="/auth-page2">Auth Page 2</Link> */}
      </nav>
      <hr />
    </div>;
};

   
export default Navbar;