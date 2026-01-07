// noraml state flow of register.............................................................


// import React, { useState, useEffect} from 'react'
// import { FaEye, FaRegEyeSlash } from "react-icons/fa";
// import { Link, useNavigate } from 'react-router-dom';
// import Header from '../Header/Header';
// import AuthService from "../../Apis/AuthService/AuthService";

// export default function RegisterPage() {

//     const navigate = useNavigate();

//     const [name, setName] = useState("");
//     const [email, setEmail] = useState("");
//     const [otp, setOtp] = useState("");
//     const [password, setPassword] = useState("");
//     const [confirmPassword, setConfirmPassword] = useState("");
//     const [showPassword, setShowPassword] = useState(false);
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//     const [error, setError] = useState("");
//     const [success, setSuccess] = useState("");

//     const [loading, setLoading] = useState(false);
//     // const [otpSent, setOtpSent] = useState(false);

//   useEffect(()=>{
//     if(error){
//       const timer = setTimeout(()=>{
//         setError("");
//       },2000);

//     return () => clearTimeout(timer);
//     }
//    },[error]);



//    useEffect(()=>{
//     if(success){
//       const timer = setTimeout(()=>{
//         setSuccess("");

//       },2000);
//       return () => clearTimeout(timer);
//     }
//    },[success]);

//    useEffect(()=>{
//     handleOtp();
//    },[]);

//     const handleOtp = async () => {
//         // if (otp.length !== 4){
//         //     setError("Enter valid otp ")
//         // return;
//         // }

//         try {

//         setLoading(true);
//         const response = await AuthService.sendOtp({email});
//         if(!response.success){
//             setError(response.error || "Failed to send otp.");
//             return;
//         }
//         setSuccess("Otp sent successfully to your email.");

//         } catch (error) {
//             setError("Failed to sent otp. Please try again later.");
//         }finally{
//             setLoading(false);
//         }

//         };



//     const handleRegister = async (e) => {
//         e.preventDefault();
//         setError("");
//         setSuccess("");

//         if (!name || !email || !otp || !password || !confirmPassword) {
//             setError("All field are required")
//             return;
//         }

//         if (password !== confirmPassword) {
//             setError("Password do not  match! try again.")
//             return;
//         }
//         if (password.length < 6) {
//             setError("Password must be at least 6 characters long!")
//             return;
//         }


//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailRegex.test(email)) {
//             setError("Please enter a valid email address!");
//             return;
//         }

//         const newUser = {
//             name,
//             email,
//             otp,
//             password,
//             confirmPassword,
//             createdAt: new Date().toISOString()
//         };


//         try {
//             setLoading(true);

//             const response = await AuthService.register(newUser);

//             if (!response.success) {
//                 setError(response.error || " Registration faield")
//                 return;
//             }
//             setSuccess("Registration successful! Now you can login in...");

//             setName("");
//             setEmail("");
//             setPassword("");
//             setConfirmPassword("");
//             setOtp("");

//             setTimeout(() => {
//                 navigate('/LoginPage');
//             }, 2000);


//         } catch (error) {
//             setError("Registration failed! try after sometimes.")
//         } finally {
//             setLoading(false);
//         }

//     }



//     return (


//         <div className='main-register'>
//         {loading && <p>Loading...</p>}
//             <Header />
//             <div className='register-content'>
//                 <div className='text'>
//                     <h1>Register form</h1>
//                     <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3Mclb0NdAfReSwkqWDtxIh2Oc4vEyPMYzeg&s' alt='register'></img>
//                 </div>

//                 <div className='text-form'>

//                     {error && (
//                         <div className="error-message">
//                         <h1 style={{ color: 'red' }}></h1>
//                             {error}
//                         </div>
//                     )}

//                     {success && (
//                         <div className="success-message">
//                         <h1 style={{ color: 'green' }}>Success</h1>
//                             {success}
//                         </div>
//                     )}
//                     <form onSubmit={handleRegister}>

//                         <label>Name</label>
//                         <input
//                             type='text'
//                             value={name}
//                             placeholder='Enter your name...'
//                             onChange={(e) => setName(e.target.value)}
//                             required
//                         />

//                         <label>Email</label>
//                         <input
//                             type='email'
//                             value={email}
//                             placeholder='Enter your email...'
//                             onChange={(e) => setEmail(e.target.value)}
//                             required
//                         />


//                         <label>OTP</label>
//                         <div className='passeord-wrapper'>
//                             <input
//                                 type="text"
//                                 inputMode='numeric'
//                                 maxLength="6"
//                                 value={otp}
//                                 placeholder='Enter Otp..'
//                                 onChange={(e) => setOtp(e.target.value)}>
//                             </input>

//                             {/* <button 
//                             type='button' 
//                             className='otp-btn'
//                              onClick={handleOtp}
//                               disabled={loading || otpSent}
//                             >{loading ? 'Sending...' : otpSent ? "Otp sent" : "Sent Otp" }
//                             </button> */}

//                             <button 
//                             className='otp-btn' 
//                             onClick={handleOtp} >
//                             Send OTP
//                             </button>
//                         </div>


//                         <label>Password</label>
//                         <div className="password-wrapper">
//                             <input
//                                 type={showPassword ? "text" : "password"}
//                                 value={password}
//                                 placeholder='Enter password...'
//                                 onChange={(e) => setPassword(e.target.value)}
//                                 required
//                             />
//                             <span
//                                 className='show-btn'
//                                 onClick={() => setShowPassword(!showPassword)}
//                             >
//                                 {showPassword ? <FaRegEyeSlash /> : <FaEye />}
//                             </span>
//                         </div>

//                         <label>Confirm Password</label>
//                         <div className="password-wrapper">
//                             <input
//                                 type={showConfirmPassword ? "text" : "password"}
//                                 value={confirmPassword}
//                                 placeholder='Enter confirm password...'
//                                 onChange={(e) => setConfirmPassword(e.target.value)}
//                                 required
//                             />
//                             <span
//                                 className='show-btn'
//                                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                             >
//                                 {showConfirmPassword ? <FaRegEyeSlash /> : <FaEye />}
//                             </span>
//                         </div>

//                         <button className='ResButton'>
//                             Submit
//                         </button>
//                     </form>

//                     <div className="login-link">
//                         Already have an account?
//                         <Link to="/LoginPage">Login here</Link>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// };   







//..........................................................................................

// Hook form code for register
// import React, { useState } from "react";
// import { email, z } from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useMutation } from "@tanstack/react-query";
// import AuthService from "../../Apis/AuthService/AuthService";

// // Schemas (unchanged)
// const signupSchema = z.object({
//   name: z.string().min(5, "Enter name at least 4 character"),
//   email: z.string().email("Invalid email address"),
//   password: z.string().min(6, "Password must be at least 6 characters"),
//   confirmPassword: z.string(),
// }).refine((data) => data.password === data.confirmPassword, {
//   message: "Passwords don't match",
//   path: ["confirmPassword"],
// });

// const otpSchema = z.object({
//   otp: z.string().length(6, "OTP must be 6 digits"),
// });


// const signupUserAPI = async (data) => {
//   const res = await AuthService.register(data); 
//   return res.data;
// };

// const verifyOtpAPI = async (email) => {
//   const res = await AuthService.sendOtp(email); 
//   return res.data;
// };

// export default function AuthFlow() {
//   const [step, setStep] = useState("SIGNUP");
//   const [userEmail, setUserEmail] = useState("");

//   const signupForm = useForm({ resolver: zodResolver(signupSchema) });
//   const otpForm = useForm({ resolver: zodResolver(otpSchema) });

//   const signupMutation = useMutation({
//     mutationFn: signupUserAPI,
//     onSuccess: (data, variables) => {
//       setUserEmail(variables.email);
//       setStep("OTP");
//     },
//     onError: (error) => {

//       const msg = error.response?.data?.message || error.message || "Signup failed";
//       alert(msg);
//     },
//   });

//   const verifyMutation = useMutation({
//     mutationFn: verifyOtpAPI,
//     onSuccess: () => {
//       alert("Account Verified Successfully!");
//       window.location.href = "/LoginPage";
//     },
//     onError: (error) => {
//       const msg = error.response?.data?.message || error.message || "Invalid OTP";
//       alert(msg);
//     },
//   });

//   const onSignupSubmit = (data) => signupMutation.mutate(data);
//   const onOtpSubmit = (data) => verifyMutation.mutate({ ...data, email: userEmail });

//   return (
//     <div className="auth-container">
//       {step === "SIGNUP" ? (
//         <div className="auth-card">
//           <h2>Create Account</h2>
//           <form onSubmit={signupForm.handleSubmit(onSignupSubmit)}>
//             <div className="form-group">
//               <label>Name</label>
//               <input {...signupForm.register("name")} className="form-input" placeholder="Enter your name" />
//               <p className="error-text">{signupForm.formState.errors.name?.message}</p>
//             </div>

//             <div className="form-group">
//               <label>Email</label>
//               <input {...signupForm.register("email")} className="form-input" placeholder="Enter your email" />
//               <p className="error-text">{signupForm.formState.errors.email?.message}</p>
//             </div>

//             <div className="form-group">
//               <label>Password</label>
//               <input type="password" {...signupForm.register("password")} className="form-input" placeholder="Password" />
//               <p className="error-text">{signupForm.formState.errors.password?.message}</p>
//             </div>

//             <div className="form-group">
//               <label>Confirm Password</label>
//               <input type="password" {...signupForm.register("confirmPassword")} className="form-input" placeholder="Confirm Password" />
//               <p className="error-text">{signupForm.formState.errors.confirmPassword?.message}</p>
//             </div>

//             <button type="submit" disabled={signupMutation.isPending} className="submit-btn">
//               {signupMutation.isPending ? "Sending OTP..." : "Get OTP"}
//             </button>
//           </form>
//         </div>
//       ) : (
//         <div className="auth-card">
//           <h2>Verify OTP</h2>
//           <p className="info-text">OTP sent to: <strong>{userEmail}</strong></p>
//           <form onSubmit={otpForm.handleSubmit(onOtpSubmit)}>
//             <div className="form-group">
//               <label>Enter 6-digit OTP</label>
//               <input {...otpForm.register("otp")} placeholder="123456" className="form-input" />
//               <p className="error-text">{otpForm.formState.errors.otp?.message}</p>
//             </div>

//             <button type="submit" disabled={verifyMutation.isPending} className="submit-btn">
//               {verifyMutation.isPending ? "Verifying..." : "Verify & Sign Up"}
//             </button>

//             <button type="button" onClick={() => setStep("SIGNUP")} className="back-btn">
//               Go Back
//             </button>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// }



import React, { useState } from "react";
import AuthService from "../../Apis/AuthService/AuthService";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Header from "../Header/Header";

export default function AuthFlow() {
  const [step, setStep] = useState("SIGNUP");

 
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);


  const [signupErrors, setSignupErrors] = useState({});
  const [  otpError, setOtpError] = useState("");


  const [userEmail, setUserEmail] = useState("");


  const validateSignup = () => {
    const errors = {};
    if (name.trim().length < 5) errors.name = "Enter name at least 5 characters";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Invalid email address";
    if (password.length < 6) errors.password = "Password must be at least 6 characters";
    if (password !== confirmPassword) errors.confirmPassword = "Passwords do not match";
    return errors;
  };


  //sent otp function
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    const errors = validateSignup();
    setSignupErrors(errors);
    setSignupLoading(true);
    if (Object.keys(errors).length > 0) return;

    try {
      
      await AuthService.sendOtp({ name, email, password , confirmPassword});
      setUserEmail(email);
      setStep("OTP");
    } catch (error) {  
      alert(error.message || "Failed to send OTP");
    } finally {
      setSignupLoading(false);
    }
  };
  



  const handleregisterSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 4) {
      setOtpError("OTP must be 4 digits");
      return;
    }

    setOtpError("");
    setOtpLoading(true);

    try {
     
      const response = await AuthService.verifyAndRegister({ email: userEmail, otp });

      if(!response.success){
        alert("failed to register");
      }
      alert("Account created and verified successfully!");
      window.location.href = "/LoginPage";
    } catch (error) {
      alert(error.message || "Invalid or expired OTP");
    } finally { 
      setOtpLoading(false); 
    }
  };
   
  return (
    <div className="auth-container">
    <Header/>
      {step === "SIGNUP" ? (
        <div className="auth-card">
          <h2>Create Account</h2>
          <form onSubmit={handleSignupSubmit}>
            {/* Name */}
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {signupErrors.name && <p className="error-text">{signupErrors.name}</p>}
            </div>

            {/* Email */}
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {signupErrors.email && <p className="error-text">{signupErrors.email}</p>}
            </div>

            {/* Password */}
            <div className="form-group">
              <label>Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span className="show-btn" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {signupErrors.password && <p className="error-text">{signupErrors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label>Confirm Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <span className="show-btn" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {signupErrors.confirmPassword && <p className="error-text">{signupErrors.confirmPassword}</p>}
            </div>

            <button type="submit" disabled={signupLoading} className="submit-btn">
              {signupLoading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        </div>
      ) : (
        <div className="auth-card">
          <h2>Verify OTP</h2>
          <p className="info-text">OTP sent to: <strong>{userEmail}</strong></p>
          <form onSubmit={handleregisterSubmit}>
            <div className="form-group">
              <label>Enter 4-digit OTP</label>
              <input
                type="text"
                className="form-input"
                placeholder="1234.."
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                inputMode="numeric"
                maxLength={6}
              />
              {otpError && <p className="error-text">{otpError}</p>}
            </div>

            <button type="submit" disabled={otpLoading} className="submit-btn">
              {otpLoading ? "Verifying..." : "Verify & Register"}
            </button>

            <button
              type="button"
              onClick={() => setStep("SIGNUP")}
              className="back-btn"
            >
              Go Back
            </button>
          </form>
        </div>
      )}
    </div>
  );
}