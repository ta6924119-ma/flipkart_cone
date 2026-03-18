export const isValidMobile = (mobile) => {
    return /^\d{10}$/.test(mobile);
};
export const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};
