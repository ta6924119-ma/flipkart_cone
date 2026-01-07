// import { model } from "mongoose";
// import nodemailer from "nodemailer";
// const createTransport = () => {
//   if (!process.env.app_password) {
//     console.warn(
//       "Email credetials  not found . Using console  logging for  OTP."
//     );
//     return null;
//   }
//   return nodemailer.createTransport({
//     service: "gamil",
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: false,
//     auth: {
//       user: process.env.email,
//       pass: process.env.app_password,
//     },
//     tls: {
//       rejectUnauthorized: false,
//     },
//   });
// };

//   export const sendVerificationOTP = async (email,otp)=>{
//     try {
//        const  transport = createTransport() 
//        if(!transport){
//         console.log('\n======= OTP ======')
//         console.log(`email:${email}`)
//         console.log(`OTP;${otp}`)
//         console.log(` valid for: 10 minutes`)
//         console.log("============\n")
//         return { succrss :true ,mode : "console"}
//        }
//     } catch (error) {
//         console.error("Emaile sending error",error)
//         console.log( `failed${email}`)
//         console.log(`${otp}`)
//         console.log(`Error : ${error.message}`)
//         return {
//             succrss:false,
//             mode: " console- fallback",
//             error: error.message
//         }
//     }
// }


//chatgpt code

import nodemailer from "nodemailer";

const createTransport = () => {
  if (!process.env.app_password) {
    console.warn("Email credentials not found. Using console logging for OTP.");
    return null;
  }
  return nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: { user: process.env.email, pass: process.env.app_password },
    tls: { rejectUnauthorized: false },
  });
};

export const sendVerificationOTP = async (email, otp) => {
  try {
    const transport = createTransport();
    if (!transport) {
      console.log("\n======= OTP ======");
      console.log(`email: ${email}`);
      console.log(`OTP: ${otp}`);
      console.log(`Valid for: 10 minutes`);
      console.log("================\n");
      return { success: true, mode: "console" };
    }

    await transport.sendMail({
      from: process.env.email,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
    });

    return { success: true, mode: "email" };
  } catch (error) {
    console.error("Email sending error:", error);
    return { success: false, mode: "console-fallback", error: error.message };
  }
};
