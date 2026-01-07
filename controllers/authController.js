import { User } from "../models/user.js";
import { sendVerificationOTP } from "../utils/Sendotp.js";
import crypto from "crypto";
import { signToken } from "../utils/jwt.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ Message: " password no match" });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        Message: " password most be  at last 6 characters ",
      });
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res
        .status(402)
        .json({ success: false, Message: "user already exist" });
    }

    const otp = crypto.randomInt(1000, 9999).toString();

    const user = await User.create({
      name,
      email,
      password,
      confirmPassword,
      isEmailVerificationOTP: otp,
      isEmailVerificationExpire: Date.now() + 10 * 60 * 1000,
      isEmailVerified: false,
      signupStage: "Basic",
    });

    await sendVerificationOTP(email, otp);

    res.status(201).json({
      success: true,
      Message: " OTP send your  email please check youe email",
      userId: user._id,
      email: user.email,
      nextStep: "verify_otp",
    });
  } catch (error) {
    console.error("signup error full", error);
    return res.status(500).json({
      success: false,
      Message: "signup failed",
      error: " error",
    });
  }
};

export const verificationEamilOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        Message: "Email and OTP are required",
      });
    }

    const user = await User.findOne({ email }).select(
      "+isEmailVerificationOTP +isEmailVerificationExpire"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        Message: "User not found",
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        Message: "OTP already verified",
      });
    }

    // ⏰ Expiry check (FIXED)
    if (user.isEmailVerificationExpire < Date.now()) {
      return res.status(400).json({
        success: false,
        Message: "OTP expired",
      });
    }

    // 🔐 OTP comparison (FIXED)
    if (String(user.isEmailVerificationOTP) !== String(otp)) {
      return res.status(400).json({
        success: false,
        Message: "Invalid OTP",
      });
    }

    // ✅ Success
    user.isEmailVerified = true;
    user.isEmailVerificationExpire = undefined;
    user.isEmailVerificationOTP = undefined;
    user.signupStage = "Verified";

    await user.save();
    console.log(`User ${email} verified`);

     const token =token(user._id);

    return res.status(200).json({
      success: true,
      token,
      Message: "Email verified successfully",
      userId: user._id,
      signupStage: user.signupStage,
      nextStep: "complete_profile",
    });
  } catch (error) {
    console.error("OTP Verification Error:", error);

    return res.status(500).json({
      success: false,
      Message: "OTP verification failed",
    });
  }
};

export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({
        success: false,
        Message: "user not found",
      });
    }
    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        Message: " Email already  verified",
      });
    }

    const otp = crypto.randomInt(1000, 9999).toString();
    user.isEmailVerificationOTP = otp;
    (user.isEmailVerificationExpire = Date.now() + 10 * 60 * 1000),
      await user.save();
    await sendVerificationOTP(email, otp);
    res.json({
      success: true,
      Message: " New OTP sent your email ",
    });
  } catch (error) {
    console.error("Resend OTP error", error);
    res.status(500).json({
      success: true,
      Message: " Failed  to  resend OTP ",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        Message: "Invalid email password",
      });
    }
    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        Message: "please  verify your email first ",
      });
    }
    user.lastActiveAt = Date.now();
    await user.save();

    const token = signToken(user._id);

return res.status(200).json({
  success: true,
  token,
  Message: "Email verified successfully",
  userId: user._id,
  signupStage: user.signupStage,
  nextStep: "complete_profile",
});

    console.log(token,"new error")
  } catch (error) {
    console.error("Login error: ", error);
    res.status(500).json({
      success: false,
      Message: "Login failed",
    });
  }
};

// //chatgpt code

// import { User } from "../models/user.js";
// import { sendVerificationOTP } from "../utils/Sendotp.js";
// import crypto from "crypto";
// import { signToken } from "../utils/jwt.js"; // assume JWT sign function

// export const signup = async (req, res) => {
//   try {
//     const { name, email, password, confirmPassword } = req.body;

//     if (password !== confirmPassword)
//       return res.status(400).json({ Message: "Password does not match" });

//     if (password.length < 6)
//       return res.status(400).json({
//         success: false,
//         Message: "Password must be at least 6 characters",
//       });

//     const userExist = await User.findOne({ email });
//     if (userExist)
//       return res.status(409).json({ success: false, Message: "User already exists" });

//     const otp = crypto.randomInt(1000, 9999).toString();

//     const user = await User.create({
//       name,
//       email,
//       password,
//       isEmailVerificationOTP: otp,
//       isEmailVerificationExpire: Date.now() + 10 * 60 * 1000,
//       isEmailVerified: false,
//       signupStage: "Basic",
//     });

//     await sendVerificationOTP(email, otp);

//     res.status(201).json({
//       success: true,
//       Message: "OTP sent to your email",
//       userId: user._id,
//       email: user.email,
//       nextStep: "verify_otp",
//     });
//   } catch (error) {
//     console.error("Signup error:", error);
//     res.status(500).json({
//       success: false,
//       Message: "Signup failed",
//       error: error.message,
//     });
//   }
// };

// export const verificationEamilOTP = async (req, res) => {
//   try {
//     const { email, otp } = req.body;
//     if (!email || !otp)
//       return res.status(400).json({ success: false, Message: "Email and OTP are required" });

//     const user = await User.findOne({ email });
//     if (!user)
//       return res.status(404).json({ success: false, Message: "User not found" });

//     if (user.isEmailVerified)
//       return res.status(400).json({ success: false, Message: "OTP already verified" });

//     if (user.isEmailVerificationExpire < Date.now())
//       return res.status(400).json({ success: false, Message: "OTP expired" });

//     if (user.isEmailVerificationOTP !== otp)
//       return res.status(400).json({ success: false, Message: "Invalid OTP" });

//     user.isEmailVerified = true;
//     user.isEmailVerificationOTP = undefined;
//     user.isEmailVerificationExpire = undefined;
//     user.signupStage = "Verified";
//     await user.save();

//     const token = signToken(user._id);
//     res.json({
//       success: true,
//       token,
//       Message: "Email verified successfully",
//       userId: user._id,
//       signupStage: user.signupStage,
//       nextStep: "complete_profile",
//     });
//   } catch (error) {
//     console.error("OTP verification error:", error);
//     res.status(500).json({ success: false, Message: "OTP verification failed", error: error.message });
//   }
// };

// export const resendOTP = async (req, res) => {
//   try {
//     const { email } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ success: false, Message: "User not found" });

//     if (user.isEmailVerified)
//       return res.status(400).json({ success: false, Message: "Email already verified" });

//     const otp = crypto.randomInt(1000, 9999).toString();
//     user.isEmailVerificationOTP = otp;
//     user.isEmailVerificationExpire = Date.now() + 10 * 60 * 1000;
//     await user.save();

//     await sendVerificationOTP(email, otp);

//     res.json({ success: true, Message: "New OTP sent to your email" });
//   } catch (error) {
//     console.error("Resend OTP error:", error);
//     res.status(500).json({ success: false, Message: "Failed to resend OTP", error: error.message });
//   }
// };

// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email }).select("+password");
//     if (!user || !(await user.comparePassword(password)))
//       return res.status(401).json({ success: false, Message: "Invalid email or password" });

//     if (!user.isEmailVerified)
//       return res.status(403).json({ success: false, Message: "Please verify your email first" });

//     user.lastActiveAt = Date.now();
//     await user.save();

//     const token = signToken(user._id);
//     res.json({
//       success: true,
//       token,
//       Message: "Login successful",
//       user: { id: user._id, email: user.email, signupStage: user.signupStage },
//     });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ success: false, Message: "Login failed", error: error.message });
//   }
// };
