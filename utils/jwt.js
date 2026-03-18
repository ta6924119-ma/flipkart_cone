import jwt from "jsonwebtoken";
export const signToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "90d" }
  );
};
export const DeliveryBoySignToken = (deliveryBoy) => {
  return jwt.sign(
    {
      id: deliveryBoy._id,
      email: deliveryBoy.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "90d" }
  );
};

export const generateToken = (id)=>{

return jwt.sign(
{ id },
process.env.JWT_SECRET,
{ expiresIn:"90d" }
);

};