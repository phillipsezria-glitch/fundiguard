import bcrypt from 'bcryptjs';

/**
 * Hash password
 */
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

/**
 * Compare password with hash
 */
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

/**
 * Validate password strength (at least 8 chars, 1 uppercase, 1 lowercase, 1 number)
 */
export const validatePasswordStrength = (password: string): boolean => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

/**
 * Validate phone number format
 */
export const validatePhoneNumber = (phone: string): boolean => {
  // Accept Kenyan format: 0712345678, 254712345678, +254712345678
  const regex = /^(\+254|254|0)[7][0-9]{8}$/;
  const cleaned = phone.replace(/\s/g, '');
  return regex.test(cleaned);
};

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};
