import { User } from "../models/user.js";
import { sendVerificationOTP } from "../utils/Sendotp.js";
import { isValidEmail } from "../utils/validator.js";
import crypto from "crypto";
import { signToken } from "../utils/jwt.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, token } = req.body;

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        Message: "Invalid email address",
      });
    }

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
      token,
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
      "+isEmailVerificationOTP +isEmailVerificationExpire",
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

    // Expiry check
    if (user.isEmailVerificationExpire < Date.now()) {
      return res.status(400).json({
        success: false,
        Message: "OTP expired",
      });
    }

    // OTP comparison
    if (String(user.isEmailVerificationOTP) !== String(otp)) {
      return res.status(400).json({
        success: false,
        Message: "Invalid OTP",
      });
    }

    // OTP verified successfully
    user.isEmailVerified = true;
    user.isEmailVerificationExpire = undefined;
    user.isEmailVerificationOTP = undefined;
    user.signupStage = "Verified";

    await user.save();
    console.log(`User ${email} verified`);

    // Generate JWT token correctly
    const token = signToken(user._id);

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
      error: error.message,
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
    ((user.isEmailVerificationExpire = Date.now() + 10 * 60 * 1000),
      await user.save());
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
        Message: "User not found",
      });
    }
       if(user.isBlocked){
 return res.status(403).json({
  message:"Your account has been blocked by admin"
 })
}
    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        Message: "please  verify your email first ",
      });

   
    }
    user.lastActiveAt = Date.now();
    await user.save();

    // Generate JWT token
    const token = signToken(user);
    user.token = token;
    await user.save();

    return res.status(200).json({
      success: true,
      token,
      Message: "Email verified successfully",
      userId: user._id,
      signupStage: user.signupStage,
      nextStep: "complete_profile",
    });

    console.log(token, "new error");
  } catch (error) {
    console.error("Login error: ", error);
    res.status(500).json({
      success: false,
      Message: "Login failed",
    });
  }
};
// MAKE USER ADMIN (Only Admin can call this)

export const makeAdmin = async (req, res) => {
  try {
    const { userId } = req.body;
    console.log("ADMIN CALLER:", req.user._id, req.user.role);
    console.log("TARGET USER ID:", userId);

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(200).json({ message: "User already admin" });
    }

    user.role = "admin";
    await user.save();

    res.status(200).json({
      success: true,
      message: "User promoted to admin",
      adminId: user._id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to make admin",
      error: error.message,
    });
  }
};

// GET PROFILE
export const profile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "name email phone address",
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ADD ADDRESS
export const addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.address.push(req.body);

    await user.save();

    res.json({
      success: true,
      message: "Address added successfully",
      address: user.address,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// UPDATE ADDRESS
export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user._id);
    const address = user.address.id(id);
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }
    Object.assign(address, req.body);
    await user.save();
    res.json({
      success: true,
      message: "Address updated successfully",
      address,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// get address
export const getAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      address: user.address,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// DELETE ADDRESS
export const deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.address = user.address.filter(
      (addr) => addr._id.toString() !== req.params.id,
    );

    await user.save();

    res.json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
