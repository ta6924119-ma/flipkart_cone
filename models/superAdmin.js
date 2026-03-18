import mongoose from "mongoose";
 import bcrypt from "bcryptjs";


  export const superAdminSchema = new mongoose.Schema({
     name: {
        type: String,
        required: true
     },
     email: {
        type: String,
        required: true,
        unique: true
     },
     password: {
        type: String,
        required: true,
        minlength: 6,
         select: false
     },
     otp: {
        type: String,
     },
     otpExpire: {
        type: Date,
     },
     isVerified: {
        type: Boolean,
        default: false
     },
     tokens: {
        type: [String],
     },
     role: {
        type: String,
        enum: ["superadmin"],
        default: "superadmin"
     },
     createdAt: {
        type: Date,
        default: Date.now
     }
  }, { timestamps: true });

  // Password hashing middleware
superAdminSchema.pre("save",async function(){

if(!this.isModified("password")) return;

this.password=await bcrypt.hash(this.password,10);

});

superAdminSchema.methods.comparePassword=function(password){

return bcrypt.compare(password,this.password);

};

export const SuperAdmin = new  mongoose.model("SuperAdmin", superAdminSchema);