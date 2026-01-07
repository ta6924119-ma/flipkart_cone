import React from "react";
import { Link } from "react-router-dom";


const Header = () => {
  return (
    <header className="header">
      <nav className="navbar">
      <Link to="/" className="logo">
          <div className="logo-container">
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTh-sxPuP9khTI1ai6V-KM2aEJmLlJN-6QEet2ou-p3WA&s" 
              alt="App Logo" 
            />
          
          </div>
        </Link>
       
        <div className="nav-left">
          <Link to="/Home" className="nav-link">Home</Link>
          <Link to="/about" className="nav-link">About</Link>
        </div>

        
        <div className="nav-right">
          <Link to="/LoginPage" className="btn login-btn">LogIn</Link>
          <Link to="/RegisterPage" className="btn signup-btn">Signup</Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
