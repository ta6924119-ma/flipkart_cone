import mongoose from "mongoose";
import { ContactUs } from "../models/contactUs.js";
import { isValidEmail, isValidMobile } from "../utils/contecValidator.js";

// Create a contact message
export const createContactMessage = async (req, res) => {
  try {
    const { name, email, message, phoneNumber } = req.body;


    // Validate email and phone number
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (!isValidMobile(phoneNumber)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }
               
    // Create a new contact message
    const newMessage = new ContactUs({
      name,
      email,
      message,
      phoneNumber,
    });
  

    await newMessage.save();

    res.status(201).json({ message: "Contact message created successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server error" });
    }
};

