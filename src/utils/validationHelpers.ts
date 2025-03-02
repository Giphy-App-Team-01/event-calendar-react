
import { MAX_ADDRESS_LENGTH, MAX_FIRST_LAST_NAME_LENGTH, MAX_PASSWORD_LENGTH, MAX_USERNAME_LENGTH, MIN_ADDRESS_LENGTH, MIN_FIRST_LAST_NAME_LENGTH, MIN_PASSWORD_LENGTH, MIN_PHONE_NUMBER_LENGTH, MIN_USERNAME_LENGTH } from "../common/constants";
import { getAllUserEmails, getAllUsernames } from "../services/db-service";

export const validateFirstAndLastName = (firstName: string, lastName: string) => {
  if (firstName.length < MIN_FIRST_LAST_NAME_LENGTH) {
     throw new Error(`First name must be at least ${MIN_FIRST_LAST_NAME_LENGTH} characters long`);
  }

  if (lastName.length < MIN_FIRST_LAST_NAME_LENGTH) {
     throw new Error(`Last name must be at least ${MIN_FIRST_LAST_NAME_LENGTH} characters long`);
  }

  if (firstName.length > MAX_FIRST_LAST_NAME_LENGTH) {
     throw new Error(`First name must be at most ${MAX_FIRST_LAST_NAME_LENGTH} characters long`);
  }

  if (lastName.length > MAX_FIRST_LAST_NAME_LENGTH) {
     throw new Error(`Last name must be at most ${MAX_FIRST_LAST_NAME_LENGTH} characters long`);
  }

  return true;
};

export const validateUsername = async (username: string) => {
  const existingUsernames = await getAllUsernames();

  if (existingUsernames.includes(username)) {
    throw new Error('Username already exists');
  }

  if (username.length < MIN_USERNAME_LENGTH) {
    throw new Error(`Username must be at least ${MIN_USERNAME_LENGTH} characters long
    `);
  }

  if (username.length > MAX_USERNAME_LENGTH) {
    throw new Error(`Username must be at most ${MAX_USERNAME_LENGTH} characters long`);
  }

  return true;
};

export const validatePhoneNumber = (phoneNumber: string) => {
  
  if (phoneNumber.length <  MIN_PHONE_NUMBER_LENGTH) {
    throw new Error(`Phone number must be at least ${MIN_PHONE_NUMBER_LENGTH} characters long`);
  }

  return true;

};

export const validateEmail = async (email: string) => {
  const existingEmails = await getAllUserEmails();
  console.log(existingEmails);
  

  if (existingEmails.includes(email)) {
    throw new Error('Email already exists');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }

  return true;
}

export const validatePassword = (password: string) => {
 
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long`);
  }

  if (password.length > MAX_PASSWORD_LENGTH) {
    throw new Error(`Password must be at most ${MAX_PASSWORD_LENGTH} characters long`);
  }

  return true;
}

export const validatePasswordsMatch = (password: string, confirmPassword: string) => {
  if (password !== confirmPassword) {
    throw new Error('Passwords do not match');
  }

  return true;
}

export const validateAddress = (address: string) => {
  if (address.length === 0) {
    throw new Error('Address cannot be empty');
  }

  if (address.length > MAX_ADDRESS_LENGTH) {
    throw new Error(`Address must be at most ${MAX_ADDRESS_LENGTH} characters long`);
  }

  if (address.length < MIN_ADDRESS_LENGTH) {
    throw new Error(`Address must be at least ${MIN_ADDRESS_LENGTH} characters long`);
  }



}



