import { Link } from 'react-router-dom';
import './Navbar.css'; // optional for styling
import { Container } from 'lucide-react';

const Navbar = () => {
  return <div>
      <nav className="navbar">
        <Link to="/">Landing</Link>
        {/* <Link to="/login">Login</Link>
      <Link to="/signup">Signup</Link>
      <Link to="/Home2">Home2</Link>
      <Link to="/explore-jobs">Explore Jobs</Link>
      <Link to="/my-applications">My Applications</Link>
      <Link to="/profile">Profile</Link> */}
        <Link to="/auth-page">Login Page</Link>
        <Link to="/video-feed">Video Feed</Link>
        <Link to="/Employer-explore">Job Seekers Videos</Link>
        <Link to="/Job-seeker-explore">Employers Videos</Link>
        <Link to="/Employer-explore-sidebar">Job Seekers Videos Style2</Link>
        <Link to="/Settings-page">Settings Page</Link>
      </nav>
      <nav className="navbar">
        <Link to="/dashboard">Job Seeker Dashboard</Link>
        <Link to="/employer-dashboard">Employer Dashboard</Link>
        <Link to="/candidate-search">Search for a Job Seeker</Link>
        <Link to="/post-job">Post Job</Link>
        <Link to="/job/1">Job Details</Link> {/* example ID */}
        <Link to="/search">Search for Jobs</Link>
        <Link to="/admin-dashboard">Admin Dashboard</Link>
        {/* <Link to="/auth-page2">Auth Page 2</Link> */}
      </nav>
    </div>;
};



export default Navbar;
