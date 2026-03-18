import mongoose from "mongoose";
 import bcrypt from "bcryptjs";


 export const adminSchema = new mongoose.Schema({
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
           select: false
        },
        tokens: {
           type: [String],
        },
        role: {
           type: String,
           enum: ["admin","branchAdmin"],
           default: "admin"
        },
         otp: {
             type: String
             },             
         otpExpire:{ 
             type: Date 
          },   
         isBlocked: {
              type: Boolean,
              default: false
              },

        createdAt: {
              type: Date,
                default: Date.now
        }
 }, { timestamps: true });

 
adminSchema.pre("save",async function(){

if(!this.isModified("password")) return;

this.password=await bcrypt.hash(this.password,10);

});

adminSchema.methods.comparePassword=function(password){

return bcrypt.compare(password,this.password);

};

export const Admin =  new mongoose.model("Admin", adminSchema);