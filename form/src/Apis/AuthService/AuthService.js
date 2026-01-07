import { ApiConfig } from "../ApiConfig/ApiEndpoints";
import { ApiCallPost } from "../ApiConfig/ApiCall";

const AuthService = {
  register: async (newUser) => {
    const url = ApiConfig.baseUrl + ApiConfig.register;
    const response = await ApiCallPost(url, newUser);

    if (!response.success) {
      throw new Error(response.error);
    }
     if (response.token) {
      localStorage.setItem("token", response.token);
    }

    return response;
  },


//   login section
  login: async (credentials) => {
    const url = ApiConfig.baseUrl + ApiConfig.login;
    const response = await ApiCallPost (url,credentials);
    if(!response.success){
      throw new Error (response.error);
    }
    return response;
  },

//   otp section
//   sendOtp : async (email)=>{
//     const url = ApiConfig.baseUrl +  ApiConfig.sendOtp;
//     const response = await ApiCallPost (url , {email});
//     if(!response.success){
//       throw new Error (response.error);
//     }
//     return response;

//   },
//   verifyOtp: async (otpData) => {
//   const url = ApiConfig.baseUrl + ApiConfig.verifyOtp;
//   const response = await ApiCallPost(url, otpData); // { email, otp }
//   if (!response.success) throw new Error(response.error);
//   if (response.token) {
//     localStorage.setItem("token", response.token);
//   }
//   return response;
// }

sendOtp: async (userData) => {
  const url = ApiConfig.baseUrl + ApiConfig.sendOtp; // e.g., POST /auth/send-otp
  const response = await ApiCallPost(url, userData);
  if (!response.success) throw new Error(response.error);
  return response;
},

verifyAndRegister: async (otpData) => {
  const url = ApiConfig.baseUrl + ApiConfig.verifyOtp; // e.g., POST /auth/verify-otp
  const response = await ApiCallPost(url, otpData);
  if (!response.success) throw new Error(response.error);
  if (response.token) localStorage.setItem("token", response.token);
  return response;
}
};

export default AuthService;
