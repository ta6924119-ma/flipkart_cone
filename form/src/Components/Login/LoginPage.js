import React, { useState ,useEffect} from "react";
import { FaEye, FaRegEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import AuthService from "../../Apis/AuthService/AuthService";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess]= useState("");
  const [loading , setLoading]= useState(false);

   useEffect(()=>{
    if(error){
      const timer = setTimeout(()=>{
        setError("");
      },2000);
      
    return () => clearTimeout(timer);
    }
   },[error]);



   useEffect(()=>{
    if(success){
      const timer = setTimeout(()=>{
        setSuccess("");

      },2000);
      return () => clearTimeout(timer);
    }
   },[success]);

   useEffect (()=>{
     handleLogin()
   },[]);

  const handleLogin =  async(e) => {
    e.preventDefault();
    

   
    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
      try {
        setLoading(true);
        const response = await AuthService.login({email, password});
     
        if(!response.success){
          setError(response.error || "Login failed. Please try again");
          return;
        }

        setSuccess("Login successful! Redirecting...");
        setTimeout(() => {
          navigate("/Home");
        }, 1500);
        
        
      } catch (error) {
        setError(error.message || "An unexpected error occurred. Please try again."); 
      } finally {
        setLoading(false);
        
      }
  };

  return (
    
    <div className="login-container">
    
    <Header/>
    
      <div>
      
        <div className="login-text">
          <h1>Login</h1>
          <img
            src="data:image/png;base64,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"
            alt="login"
          />
        </div>

        {error && <div className="error-message"> ❌{error}</div>}

        {success && <div className="success-message">{success}</div>}

        <form >
          <label>Email</label>
          <input
            type="email"
            value={email}
            placeholder="Enter email..."
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <div className="input-wrapper">
            <input
              type={show ? "text" : "password"}
              value={password}
              placeholder="Enter password..."
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="show-btn" onClick={() => setShow(!show)}>
              {show ? <FaRegEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button type="submit" onClick={handleLogin} className="login-button" disabled={loading}>
  {loading ? "Logging in..." : "Login"}
</button>


          <div className="register-link">
            Don't have an account?<Link to="/RegisterPage">Register Now</Link>
            
          </div>
        </form>
      </div>
    </div>
  );
}


