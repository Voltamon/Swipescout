import { Link } from 'react-router-dom';
import './Navbar.css'; // optional for styling

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/">Landing</Link>
      <Link to="/login">Login</Link>
      <Link to="/signup">Signup</Link>
      <Link to="/Home2">Home2</Link>
      <Link to="/explore-jobs">Explore Jobs</Link>
      <Link to="/my-applications">My Applications</Link>
      <Link to="/profile">Profile</Link>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/search">Search</Link>
      <Link to="/job/1">Job Details</Link> {/* example ID */}
      <Link to="/employer-dashboard">Employer Dashboard</Link>
      <Link to="/post-job">Post Job</Link>
      <Link to="/candidate-search">Candidate Search</Link>
      <Link to="/auth-page">Auth Page</Link>
      <Link to="/auth-page2">Auth Page 2</Link>
    </nav>
  );
};

export default Navbar;
