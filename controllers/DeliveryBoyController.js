import { DeliveryBoy } from "../models/deliveryboy.js";
import { sendSimpleEmail } from "../utils/sendemail.js";
import { sendVerificationOTP } from "../utils/Sendotp.js";
import {
  isValidEmail,
  isValidAadhaar,
  isValidMobile,
  generateOTP,
} from "../utils/DeliveryBoyValidator.js";
import { DeliveryBoySignToken } from "../utils/jwt.js";

// Register Delivery Boy
export const registerDeliveryBoy = async (req, res) => {
  try {
    const { name, aadhaar, email, mobile, city, state, address } = req.body;

    // Validation
    if (!isValidEmail(email))
      return res.status(400).json({ message: "Invalid email" });
    if (!isValidAadhaar(aadhaar))
      return res.status(400).json({ message: "Invalid Aadhaar" });
    if (!isValidMobile(mobile))
      return res.status(400).json({ message: "Invalid Mobile" });

    // Check duplicates
    const Aadharexists = await DeliveryBoy.findOne({ aadhaar });
    if (Aadharexists)
      return res.status(400).json({
        success: false,
        message: "Aadhaar already exists",
      });
    const mobileexists = await DeliveryBoy.findOne({ mobile });
    if (mobileexists)
      return res.status(400).json({
        success: false,
        message: "Mobile number already exists",
      });

    // Generate OTP
    const otp = generateOTP();
    console.log("Generated OTP:", otp);
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000);

    const newDeliveryBoy = new DeliveryBoy({
      name,
      aadhaar,
      email,
      mobile,
      city,
      state,
      address,
      otp,
    expire: otpExpire,
    });


// Email message
const emailMessage = `
Welcome to APNACART Delivery System

Your OTP for verification: ${otp}

Your Delivery Boy ID: ${newDeliveryBoy._id}

Please keep this ID safe. You will need it for order pickup.

Thank you.
`;

await sendSimpleEmail(
  email,
  "APNACART Delivery Boy Verification",
  emailMessage
);
    await newDeliveryBoy.save();


    // Send OTP via email
     await sendVerificationOTP(email, otp);

    res.status(201).json({
      success: true,
      message: `OTP sent to ${email}`,
      DeliveryBoyId: newDeliveryBoy._id,
      DeliveryBoyEmail: newDeliveryBoy.email,
      nextStep: "verify_otp",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Verify OTP
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const deliveryBoy = await DeliveryBoy.findOne({ email });
    if (!deliveryBoy)
      return res.status(404).json({ message: "Delivery boy not found" });

    if (deliveryBoy.otpExpire < new Date()) {
      return res
        .status(400)
        .json({ message: "OTP expired, please register again" });
    }

    if (deliveryBoy.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    deliveryBoy.isVerified = true;
    deliveryBoy.otp = null;
    deliveryBoy.otpExpire = null;
    await deliveryBoy.save();

    res.json({ message: "OTP verified successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Login
export const loginDeliveryBoy = async (req, res) => {
  try {
    const { aadhaar, email } = req.body;

    const deliveryBoy = await DeliveryBoy.findOne({
      aadhaar,
      email,
      isVerified: true,
    });
    if (!deliveryBoy)
      return res
        .status(404)
        .json({ msg: "Delivery boy not found or not verified" });

    // Generate token
    const token = DeliveryBoySignToken(deliveryBoy);
    deliveryBoy.token = token;
    await deliveryBoy.save();

    res.json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Update Delivery Boy
export const updateDeliveryBoy = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const deliveryBoy = await DeliveryBoy.findById(id);
    if (!deliveryBoy)
      return res.status(404).json({ msg: "Delivery boy not found" });

    // Aadhaar duplicate check (agar change kar raha ho)
    if (updateData.aadhaar && updateData.aadhaar !== deliveryBoy.aadhaar) {
      const aadhaarExists = await DeliveryBoy.findOne({
        aadhaar: updateData.aadhaar,
      });
      if (aadhaarExists)
        return res.status(400).json({ msg: "Aadhaar already exists" });
    }

    // Mobile duplicate check
   /* if (updateData.mobile && updateData.mobile !== deliveryBoy.mobile) {
      const mobileExists = await DeliveryBoy.findOne({
        mobile: updateData.mobile,
      });
      if (mobileExists)
        return res.status(400).json({ msg: "Mobile already exists" });
    }*/

    const updated = await DeliveryBoy.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.json({
      success: true,
      message: "Delivery boy updated successfully",
      data: updated,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Delete Delivery Boy
export const deleteDeliveryBoy = async (req, res) => {
  try {
    const { id } = req.params;

    const deliveryBoy = await DeliveryBoy.findById(id);
    if (!deliveryBoy)
      return res.status(404).json({ msg: "Delivery boy not found" });

    await DeliveryBoy.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Delivery boy deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get All Delivery Boys (Admin)
export const getAllDeliveryBoys = async (req, res) => {
  try {
    const deliveryBoys = await DeliveryBoy.find().select("-otp -otpExpire");

    res.json({
      success: true,
      count: deliveryBoys.length,
      data: deliveryBoys,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error" });
  }
};
// Admin: Delete Delivery Boy
export const adminDeleteDeliveryBoy = async (req, res) => {
  try {
    const { id } = req.params;

    const deliveryBoy = await DeliveryBoy.findById(id);
    if (!deliveryBoy)
      return res.status(404).json({ msg: "Delivery boy not found" });

    await DeliveryBoy.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Delivery boy deleted successfully by admin",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error" });
  }
};