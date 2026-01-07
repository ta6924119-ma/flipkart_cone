// import React, { useState } from 'react'

// import AuthService from '../../Apis/AuthService/AuthService';

// export default function PracticCode() {
//     const [email, setEmail] = useState("");

//     const [success, setSuccess] = useState("");
//     const [name, setName] = useState("");
//     const [otp, setOtp] = useState("");
//     const [password, setPassword] = useState("");
//     const [error, setError] = useState("");
//     const [loading, setLoading] = useState(false);

//     const [confirmPassword, setConfirmPassword] = useState("");
//     const [otpSent, setOtpSent] = useState(false)


//     const handleSentOtp = async () => {
//         if (loading) return;
//         if (!email) {
//             setError("Enter your email to send OTP")
//             return;
//         }
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailRegex.test(email)) {
//             setError("Please enter a valid email address");
//             return;
//         }



//         try {

//             setLoading(true);

//             const response = await AuthService.sendOtp(email)

//             if (!response.success) {
//                 setError("failed to send OTP")
//                 return;
//             }
//             setError("")
//             setOtpSent(true)
//             setSuccess("OTP send  successfully to your email.")
//         } catch (error) {
//             setError(error.message || "Something went wrong try after sometimes.")
//             console.log(error.message);

//         } finally {
//             setLoading(false);
//         }

//     };


//     const handleSubmit = async (e) => {
//         if (loading) return;
//         e.preventDefault()

//         if (!email || !name || !otp || !password || !confirmPassword) {
//             setError("Fill all the Fileds are required.")
//             return;
//         }

//         if (password !== confirmPassword) {
//             setError("Password do not match")
//             return;
//         }

//         if (password.length < 6) {
//             setError("Password must be at least 6 character long")
//         }
//         try {

//             setLoading(true);

//             const response = await AuthService.register({
//                 email,
//                 name,
//                 otp,
//                 password,
//                 confirmPassword
//             })


//             if (!response.success) {
//                 setError(response.error || "Failed to register");
//                 return
//             }
//             setSuccess("Registration successfully")
//             console.log(response.message);

//             setTimeout(() => {
//                 window.location.href = "/LoginPage";
//             }, 2000)

//         } catch (error) {
//             setError(error.message || "Register failed due to server problem!")
//             console.log(error.message);

//         };
//     }
//     return (
//         <div className='main-conatiner'>
//             {error && <p style={{ color: "red" }}>{error}</p>}
//             {success && <p style={{ color: "green" }}>{success}</p>}


//             <form className='form-content' onSubmit={handleSubmit}>
//                 <input type='text' className="input-text" value={email} placeholder='Enter email..' onChange={(e) => setEmail(e.target.value)} required></input>

//                 <input type='text' value={name} className="input-text" placeholder='Enter name..' onChange={(e) => setName(e.target.value)} required></input>

//                 <input type='tel' value={otp} className="input-text" disabled={!otpSent} placeholder='Enter otp..' onChange={(e) => setOtp(e.target.value)} required></input>

//                 <button type="button" className='otp-btn' onClick={handleSentOtp} disabled={loading}>
//                     {loading || "SendOtp"}
//                 </button>

//                 <input type='password' value={password} className="input-text" placeholder='Enter password..' onChange={(e) => setPassword(e.target.value)} required></input>

//                 <input type='password' value={confirmPassword} className="input-text" placeholder='EnterconfirmPassword..' onChange={(e) => setConfirmPassword(e.target.value)} required></input>

//                 <button className='submit-btn' disabled={loading}
//                 > {loading ? "Submiting" : "Submit"}</button>

//             </form>
//         </div>
//     )
// }




// import React, { useState } from 'react'

// import AuthService from '../../Apis/AuthService/AuthService';

// export default function PracticCode() {

//     const [error, setError] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [success, setSuccess] = useState("");
//     const [step, setStep] = useState(1)
//     const [form, setForm] = useState({
//         name:"",
//         email:"",
//         otp:"",
//         password:"",
//         confirmPassword:"",

//     })

//     const handleChange = (e) => {
//         setForm({ ...form, [e.target.name]: e.target.value });
//         setError("");
//     };


//     const handleSendOtp = async () => {

//   if(loading)return;

//         if (!form.email) {
//             setError("Email is required to send OTP")
//             return;
//         }

//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailRegex.test(form.email)) {
//             setError("Please enter a valid email address");
//             return;
//         }

//         try {
//             setLoading(true);

//             const response = await AuthService.sendOtp(form.email);

//             if (!response.success) {
//                 setError("Failed to send OTP")
//                 return;
//             }
//             setSuccess("OTP send successfully to your email")
//             setStep(2)

//         } catch (error) {
//             setError(error.message || "Someting went wrong")

//         } finally {
//             setLoading(false)
//         }


//     };


//     const handleSubmit = async (e) => {
//         e.preventDefault();


//         if (!form.otp || !form.name || !form.password || !form.confirmPassword) {
//             setError("Fill all the fields.")
//             return;
//         }

//         if (form.password !== form.confirmPassword) {
//             setError("Password do not match")
//             return;
//         }

//         if (form.password.length < 6) {
//             setError("Password must be at least 6 character long")
//             return;
//         }

//         try {
//             if (loading) return;
//             setLoading(true);

//             const response = await AuthService.register(form)

//             if (!response.success) {
//                 setError("Failed to register")
//                 return;
//             }

//             setSuccess("Registration successfull ")
//             setTimeout(() => {
//                 window.location.href="/LoginPage"
//             }, 2000)

//         } catch (error) {
//             setError("Server error! try again")
//         } finally {
//             setLoading(false)
//         }

//     };


//     return (
//         <div className='main-conatiner'>
//             {error && <p style={{ color: "red" }}>{error}</p>}
//             {success && <p style={{ color: "green" }}>{success}</p>}
//             {step === 1 && (
//                 <>

//                     <input type='email' name='email' placeholder='Enter email..' value={form.email} onChange={handleChange} />



//                     <button type='button' className='otp-btn' onClick={handleSendOtp} disabled={loading}>
//                         {loading ? "Submiting" : "SendOtp"}
//                     </button>
//                 </>
//             )}



//             {step === 2 && (

//                 <>

//                     <form  className="form-name" onSubmit={handleSubmit}>

//                         <input name='otp' className='input-text' placeholder='Enter OTP..' value={form.otp} onChange={handleChange}></input>


//                         <input name='name' className='input-text'  placeholder='Enter name..' value={form.name} onChange={handleChange}></input>


//                         <input type='password' className='input-text'  name='password' placeholder='Enter password..' value={form.password} onChange={handleChange}></input>


//                         <input type="password" className='input-text'  name='coonfirmPassword' placeholder='Enter confirmPassword' value={form.confirmPassword} onChange={handleChange}></input>



//                         <button type='submit' className='register-btn' disabled={loading}>

//                             {loading ? "Submiting" : "SignUp"}
//                         </button>



//                         <button type='button' className='back-btn' onClick={() => setStep(1)}> change Email</button>
//                     </form>
//                 </>
//             )}

//         </div>
//     )
// }





// import React, { useState } from "react";
// import AuthService from "../../Apis/AuthService/AuthService";

// export default function RegisterWithOtp() {

//   const [step, setStep] = useState(1);
//   const [loading, setLoading] = useState(false);

//   const [form, setForm] = useState({
//     email: "",
//     name: "",
//     otp: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const [errors, setErrors] = useState({});
//   const [success, setSuccess] = useState("");


//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//     setErrors({ ...errors, [e.target.name]: "" });
//   };

//   const validateEmail = () => {
//     if (!form.email) return "Email is required";
//     const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!regex.test(form.email)) return "Invalid email address";
//     return null;
//   };


//   const handleSendOtp = async () => {
//     if (loading) return;

//     const emailError = validateEmail();
//     if (emailError) {
//       setErrors({ email: emailError });
//       return;
//     }

//     try {
//       setLoading(true);
//       setErrors({});
//       setSuccess("");

//       const res = await AuthService.sendOtp(form.email);

//       if (!res.success) {
//         setErrors({ email: "Failed to send OTP" });
//         return;
//       }

//       setStep(2);
//       setSuccess("OTP sent successfully");
//     } catch (err) {
//       setErrors({ email: "Server error. Try again." });
//     } finally {
//       setLoading(false);
//     }
//   };


//   const handleRegister = async (e) => {
//     e.preventDefault();
//     if (loading) return;

//     const newErrors = {};

//     if (!form.name) newErrors.name = "Name is required";
//     if (!form.otp) newErrors.otp = "OTP is required";
//     if (!form.password) newErrors.password = "Password is required";
//     if (form.password !== form.confirmPassword)
//       newErrors.confirmPassword = "Passwords do not match";

//     if (Object.keys(newErrors).length) {
//       setErrors(newErrors);
//       return;        
//     }

//     try {
//       setLoading(true);
//       setErrors({});
//       setSuccess("");

//       const res = await AuthService.register(form);

//       if (!res.success) {
//         setErrors({ form: res.error || "Registration failed" });
//         return;
//       }

//       setSuccess("Registration successful ");

//       setTimeout(() => {
//         window.location.href = "/login";
//       }, 2000);
//     } catch (err) {
//       setErrors({ form: "Server error. Try again." });
//     } finally {
//       setLoading(false);
//     }
//   };


//   return (
//     <div className="container">
//       <h2>Register with OTP</h2>

//       {success && <p style={{ color: "green" }}>{success}</p>}
//       {errors.form && <p style={{ color: "red" }}>{errors.form}</p>}


//       {step === 1 && (
//         <>
//           <input
//             name="email"
//             placeholder="Enter email"
//             value={form.email}
//             onChange={handleChange}
//           />
//           {errors.email && <p className="error">{errors.email}</p>}

//           <button onClick={handleSendOtp} disabled={loading}>
//             {loading ? "Sending..." : "Send OTP"}
//           </button>
//         </>
//       )}


//       {step === 2 && (
//         <form onSubmit={handleRegister}>
//           <input
//             name="name"
//             placeholder="Enter name"
//             value={form.name}
//             onChange={handleChange}
//           />
//           {errors.name && <p className="error">{errors.name}</p>}

//           <input
//             name="otp"
//             placeholder="Enter OTP"
//             value={form.otp}
//             onChange={handleChange}
//           />
//           {errors.otp && <p className="error">{errors.otp}</p>}

//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={form.password}
//             onChange={handleChange}
//           />
//           {errors.password && <p className="error">{errors.password}</p>}

//           <input
//             type="password"
//             name="confirmPassword"
//             placeholder="Confirm Password"
//             value={form.confirmPassword}
//             onChange={handleChange}
//           />
//           {errors.confirmPassword && (
//             <p className="error">{errors.confirmPassword}</p>
//           )}

//           <button type="submit" disabled={loading}>
//             {loading ? "Submitting..." : "Register"}
//           </button>

//           <button type="button" onClick={() => setStep(1)}>
//             Change Email
//           </button>
//         </form>
//       )}
//     </div>
//   );
// }



// practic flow of registr




// RegisterPage.jsx

// import React from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod'; 
// import { useMutation } from '@tanstack/react-query';
// import { useNavigate } from 'react-router-dom';
// import AuthService from '../../Apis/AuthService/AuthService';


// const registerSchema = z.object({
//   name: z.string().min(2, "Name must be at least 2 characters"),
//   email: z.string().email("Invalid email address"),
//   otp: z.string().length(6, "OTP must be 6 digits"),
//   password: z.string().min(6, "Password must be at least 6 characters"),
//   confirmPassword: z.string(),
// }).refine((data) => data.password === data.confirmPassword, {
//   message: "Passwords do not match",
//   path: ["confirmPassword"]
// });

// export default function RegisterPage() {
//   const navigate = useNavigate();

//   const sendOtpMutation = useMutation({
//     mutationFn: AuthService.sendOtp
//   });

//   const registerMutation = useMutation({
//     mutationFn: AuthService.register,
//     onSuccess: (data) => {
//       if (data?.success) {
//         alert("Registration successful!");
//         navigate('/Login');
//       }
//     },
//     onError: (error) => {
//       alert(error?.message || "Registration failed");
//     }
//   });

//   const {register,handleSubmit, formState: { errors, isSubmitting },watch,setError} = useForm({
//     resolver: zodResolver(registerSchema),
//     defaultValues: {
//       name: '',
//       email: '',
//       otp: '',
//       password: '',
//       confirmPassword: ''
//     }
//   });

//   const handleSendOtp = async (email) => {
//     if (!email) {
//       setError('email', { message: 'Email is required to send OTP' });
//       return;
//     }
//     try {
//       await sendOtpMutation.mutateAsync({ email });
//       alert('OTP sent successfully!');
//     } catch (err) {
//       setError('otp', { message: 'Failed to send OTP' });
//     }
//   };

//   const onSubmit = async (data) => {
//     try {
//       await registerMutation.mutateAsync(data);
//     } catch (err) {
//       if (err?.response?.data?.error === 'INVALID_OTP') {
//         setError('otp', { message: 'Invalid OTP' });
//       }
//     }
//   };

//   return (
//     <div className="register-form">
//       <h2>Register</h2>

//       {sendOtpMutation.isError && (
//         <div className="error">Failed to send OTP</div>
//       )}

//       <form onSubmit={handleSubmit(onSubmit)}>
//         <input {...register('name')} placeholder="Name" />
//         {errors.name && <p className="error">{errors.name.message}</p>}

//         <input {...register('email')} placeholder="Email" type="email" />
//         {errors.email && <p className="error">{errors.email.message}</p>}

//         <div>
//           <input {...register('otp')} placeholder="OTP" maxLength="6" />
//           <button
//             type="button"
//             onClick={() => handleSendOtp(watch('email'))}
//             disabled={sendOtpMutation.isPending}
//           >
//             {sendOtpMutation.isPending ? 'Sending...' : 'Send OTP'}
//           </button>
//         </div>
//         {errors.otp && <p className="error">{errors.otp.message}</p>}

//         <input {...register('password')} placeholder="Password" type="password" />
//         {errors.password && <p className="error">{errors.password.message}</p>}

//         <input {...register('confirmPassword')} placeholder="Confirm Password" type="password" />
//         {errors.confirmPassword && <p className="error">{errors.confirmPassword.message}</p>}

//         <button type="submit" disabled={isSubmitting || registerMutation.isPending}>
//           {registerMutation.isPending ? 'Registering...' : 'Register'}
//         </button>
//       </form>
//     </div>
//   );
// }











// import React, { useState } from "react";
// import { z } from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useMutation } from "@tanstack/react-query";

// // 1. SCHEMAS
// const signupSchema = z.object({
//   name:z.string().min(5,"Enter name at least 4 character"),
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

// // 2. API FUNCTIONS
// const signupUserAPI = async (data) => {
//   const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(data),
//   });
//   if (!res.ok) throw new Error("Signup failed");
//   return res.json();
// };

// const verifyOtpAPI = async (otpData) => {
//   const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(otpData),
//   });
//   if (!res.ok) throw new Error("Invalid OTP");
//   return res.json();
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
//     onError: (err) => alert(err.message),
//   });

//   const verifyMutation = useMutation({
//     mutationFn: verifyOtpAPI,
//     onSuccess: () => {
//       alert("Account Verified Successfully!");
//       window.location.href = "/LoginPage";
//     },
//     onError: (err) => alert(err.message),
//   });

//   const onSignupSubmit = (data) => signupMutation.mutate(data);
//   const onOtpSubmit = (data) => verifyMutation.mutate({ ...data, email: userEmail });

//   return (
//     <div className="auth-container">
//       {step === "SIGNUP" ? (
//         <div className="auth-card">
//           <h2>Create Account</h2>
//           <form onSubmit={signupForm.handleSubmit(onSignupSubmit)}>

//           <div className="form-group">
//               <label>Name</label>
//               <input {...signupForm.register("name")} className="form-input" placeholder="Enter your name" />
//               <p className="error-text">{signupForm.formState.errors.name?.message}</p>
//             </div>

//             <div className="form-group">
//               <label>Email</label>
//               <input {...signupForm.register("email")} className="form-input"placeholder="Enter your email" />
//               <p className="error-text">{signupForm.formState.errors.email?.message}</p>
//             </div>  

//             <div className="form-group">
//               <label>Password</label>
//               <input type="password" {...signupForm.register("password")} className="form-input"  placeholder="Password"/>
//               <p className="error-text">{signupForm.formState.errors.password?.message}</p>
//             </div>

//             <div className="form-group">
//               <label>Confirm Password</label>
//               <input type="password" {...signupForm.register("confirmPassword")} className="form-input" placeholder="confirmPassword" />
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





// import React, { useState } from 'react'

// export default function PracticCode() {
//     const [posts, setPosts] = useState([
//         {
//             id: 1,
//             content: "Ashwani like your photo",
//             likes: 10,
//             likedByme: false,
//         },
//         {
//             id: 2,
//             content: "First post",
//             likes: 5,
//             likedByme: true,
//         }
//     ]);

// const handleLikes = (postId) =>{
//     setPosts((prevPosts)=>

//         prevPosts.map((post)=>{
//             if(post.id === postId){
                
//                 return{
//                     ...post,
//                     likedByme:!post.likedByme,
//                     likes:post.likedByme ? post.likes - 1 : post.likes + 1,
//                 };
//             }
//             return post;
//         })
//     );
// };

//     return (
//         <div className='post--content'>
//         <h1>Post</h1>

//         {posts.map((post)=>(

//             <div key={post.id}className='post-id'>
//                 <span>likes:{post.likes}</span>
//                 <p>content:{post.content}</p>

//                 <button className='button-click' onClick={()=>handleLikes(post.id)}>
//                     {post.likedByme ? "UnLike" : "Likes"}
//                 </button>
//             </div>
//         ))}
//         </div>
//     )
// }

 



import React, { useEffect, useState } from 'react'
import socket from '../Socket/Socket';

const rooms = ["friend-group", "react-group", "office-group"];


export default function PracticCode() {

  const [messages , setMessages ]= useState([]);
  const [message , setMessage]= useState("");
  const [ activeRoom , setActiveRoom] = useState("friend-group")
  

 

  useEffect(() => {

    socket.emit("join-room", activeRoom);

    socket.on("received-message",(data)=>{
      setMessages((prev)=>[...prev,data]);
    });


    return(()=>{
      socket.off("received-message")
    });
  },[activeRoom]);


   const sendMessage = () =>{

    if(!message) return;
   
    
    socket.emit("send-message",{
      roomId:activeRoom,
      message:message,
      sender:"",
    });
    setMessage("");
   }
  return (
    <div style={{ padding: 20 }}>
      <h2>Group Chat</h2>

      {/* room button */}
      <div>

      {rooms.map((room)=>(
        <div>
          <button
          key={room} onClick={()=>{setMessages([]);
          setActiveRoom(room);
          }}
          >
          {room}
            
          </button>
        </div>
      ))}


      </div>

      <div>
     {messages.map((msg , i )=>(

      <>
        <p key={i}>
          <span>{msg.sender}: <p>{msg.message}</p></span>
        </p>
      </>
     ))}
      </div>
 
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type message..."
      />     
      <button onClick={sendMessage}>Send</button>
    </div>
  
  )
}
