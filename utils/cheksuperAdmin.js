import { SuperAdmin } from "../models/superAdmin.js";

export const createSuperAdmin = async () => {
  try {
    const exist = await SuperAdmin.findOne();
    if (exist) {
      console.log("SuperAdmin already exists:", exist.name, exist.email);
      return;
    }

    const superAdmin = new SuperAdmin({
      name: process.env.SUPERADMIN_NAME,
      email: process.env.SUPERADMIN_EMAIL,
      password: process.env.SUPERADMIN_PASSWORD,
      isVerified: true, // Directly verified
      tokens: [],
      role: "superadmin",
    });

    await superAdmin.save(); // <-- This actually saves to DB

    console.log("SuperAdmin created successfully:", superAdmin.email);
  } catch (err) {
    console.log("Error creating SuperAdmin", err);
  }
};