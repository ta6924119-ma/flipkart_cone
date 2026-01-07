// import axios from 'axios';


//  const  API_BASE_URL = "http://192.168.1.5:4041";


//  const api = axios.create({
//     baseURL : API_BASE_URL,
//     headers:{                                       
//         "Content-Type" : "application/json"
//     }
//  });


//  api.interceptors.request.use 
//  ((config) => {
//     const token = localStorage.getItem("token");
//     if(token){
//         config.headers["Authorization"] = `Bearer ${token}`;
//     }
//     return config;
//  },
// (error) => Promise.reject(error));


//  const handleError =(error)=>{
//     if(error.response){
//         const message =
//          error.response.data?.error ||
//          error.response.data?.message || 
//         `Error: ${error.response.status} : ${error.response.statusText}`;

//         return{success :false,
//             error :message
//         };
//  }else if(error.request){
//     return{
//         success:false,
//         error:"No response from server.Please try again later."
//     }
//     }else{
//         return{
//             success:false,
//             error:error.message || "An unexpected error."
//         };
//     }
//  };




//  export const ApiCallPost = async (url, data) =>{

//     try {

//         const response = await api.post(url , data);
//         return {success:true, ...(response.data || {})};        
//     } catch (error) {
//         return handleError (error);
        
//     }
//  };


//  export const ApiCallGet  =  async(url) =>{
//     try {
//         const response = await api.get(url);
//         return {success:true , ...response.data}
        
//     } catch (error) {
//         return handleError(error);
//     }
//  };

//  export const ApiCallPut = async (url , data) =>{
//     try {
//         const response = await api.put(url,data);
//         return{success:true , ...response.data}
        
//     } catch (error) {
//         return handleError(error);
        
//     }
//  } ;


//  export const ApiCallDelete =  async(url , data = {}) =>{
//     try {
//         const response = await api.delete(url,{data});
//         return{success :true, ...response.data}
        
//     } catch (error) {
//         return handleError(error);
        
//     }

//  };













import axios from "axios";

const API_BASE_URL = "https://--------------"

const api = axios.create({
    baseURL:API_BASE_URL,
    headers:{
        "Content-Type": "application/json"
    }
});


api.interceptors.request.use((config)=>{
    const token = localStorage.getItem("token");

    if(token){
        config.headers.Authorization=`Bearer${token}`;;
    }
    return config
});


const handleError = (error)=>{
    if(error.responsee){
        const message = 
        error.response.data?.error ||
        error.response.data?.message || 
        `Error ${error.response.status}:${error.response.statusText}`;
        return {success:
        }
    }
}
