export const isValidEmail = (email) => {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

export const isValidPhone = (phone) => {
  if (!phone) return false;
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10;
};

export const isValidPincode = (pincode) => {
  if (!pincode) return false;
  return /^\d{6}$/.test(pincode.trim());
};
