// utils/validate.js
export const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export const isValidAadhaar = (aadhaar) => {
    return /^\d{12}$/.test(aadhaar);
};

export const isValidMobile = (mobile) => {
    return /^\d{10}$/.test(mobile);
};

export const generateOTP = () => {
    // 6 digit random number
    return Math.floor(1000 + Math.random() * 9000);
};