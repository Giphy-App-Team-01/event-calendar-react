import { get, ref, set } from 'firebase/database';
import { db } from '../../firebase.config';

export interface databaseUser {
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  email: string;
  image: string;
  allowEventInvites: boolean;
  uid: string;
}

export const saveUserToDatabase = async (
  uid: string,
  firstName: string,
  lastName: string,
  phoneNumber: string,
  address: string,
  email: string,
  username: string,
  image: string
) => {
  if (
    !uid ||
    !firstName ||
    !lastName ||
    !phoneNumber ||
    !address ||
    !email ||
    !username ||
    !image
  ) {
    throw new Error('All fields are required');
  }

  const userRef = ref(db, `users/${uid}`);
  const userData = {
    uid,
    firstName,
    lastName,
    phoneNumber,
    address,
    email,
    username,
    image,
    allowEventInvites: true,
  };

  try {
    await set(userRef, userData);
    console.log('User saved successfully');
  } catch (error) {
    console.error('Error saving user to database:', error);
    throw error;
  }
};

export const getAllUserEmails = async () => {
  try {
    const snapshot = await get(ref(db, 'users'));

    if (snapshot.exists()) {
      const users = snapshot.val();
      const emails = Object.values(users as Record<string, databaseUser>).map(
        (user) => user.email
      );
      return emails;
    }
    return [];
  } catch (error) {
    console.error('Error fetching user emails:', error);
    return [];
  }
};

export const getAllUsernames = async (): Promise<string[]> => {
  try {
    const snapshot = await get(ref(db, 'users'));

    if (snapshot.exists()) {
      const users = snapshot.val();
      const usernames = Object.values(
        users as Record<string, databaseUser>
      ).map((user) => user.username);
      return usernames;
    }
    return [];
  } catch (error) {
    console.error('Error fetching user usernames:', error);
    return [];
  }
};

export const getAllUsers = async (): Promise<databaseUser[]> => {
  try {
    const snapshot = await get(ref(db, 'users'));
    if (snapshot.exists()) {
      return Object.values(snapshot.val()) as databaseUser[];
    }
    return [];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

export const getAllPublicEvents = async () => {
  try {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 2,
            title: 'Team Meeting',
            description: 'Weekly sync-up',
            start: '2025-03-10T09:00',
            end: '2025-03-10T09:15',
            location: 'Sofia, Bulgaria',
            mapUrl: 'https://maps.google.com/location',
            creator: 'userId1',
            participants: {
              userId2: 'true',
            },
            recurring: 'weekly',
            visibility: 'public',
          },
        ]);
      }, 1000);
    });
  } catch (error) {
    console.log(error);
  }
};
