import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const addressSchema = new mongoose.Schema({
 fullName: String,
      mobile: String,
      pincode: String,
      city: String,
      state: String,
      District: String,
      PostOffice: String,
      fullAddress: String,
      Village: String,// Home // Office
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
       type: String
       },

    password: {
      type: String,
      required: true,
      select: false,
    },

    confirmPassword: {
      type: String,
      required: true,
      select: false,
    },
   token: { 
    type: String 
  },

    isEmailVerificationOTP: String,
    isEmailVerificationExpire: Date,

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    signupStage: {
      type: String,
      default: "Basic",
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isBlocked: {
      
      type: Boolean, default: false
     } , // For admin block/unblock


    address: [addressSchema],

    lastActiveAt: Date,
  },
  { timestamps: true }
);

// Password hash
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model("User", userSchema);
