import {
  get,
  off,
  onValue,
  push,
  ref,
  remove,
  set,
  update,
} from 'firebase/database';
import { db } from '../../firebase.config';
import { databaseUser, Notification, Event } from '../types/interfaces';

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
    const eventsRef = ref(db, 'events');
    const snapshot = await get(eventsRef);

    if (snapshot.exists()) {
      const events = snapshot.val();
      const publicEvents = Object.values(events).filter(
        (event) => event.visibility === 'public'
      );
      return publicEvents;
    }
    return [];
  } catch (error) {
    console.error('Error fetching public events:', error);
    return [];
  }
};

export const getUserById = async (id: string): Promise<databaseUser | null> => {
  try {
    const snapshot = await get(ref(db, `users/${id}`));

    if (snapshot.exists()) {
      return snapshot.val() as databaseUser;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    return null;
  }
};

//Тhis function returns all events created by the user with the given ID
//If the user is in her own profile, she will see all events (public and private)
//If the user is viewing another user's profile, she will see only the public events
export const getUserEventsByProfile = async (
  profileId: string
): Promise<any> => {
  try {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock data (this will be replaced with real database data)
        const allEvents = [
          {
            id: 1,
            title: 'React Workshop',
            description: 'Advanced React techniques',
            start: '2025-03-08T14:00',
            end: '2025-03-08T16:00',
            location: 'Sofia, Bulgaria',
            mapUrl: 'https://maps.google.com/location',
            creator: 'eTeD3Nj4ZmPeno8vQUNMUNEDsaA3',
            visibility: 'public',
            image:
              'https://images.unsplash.com/photo-1504384308090-c894fdcc538d',
          },
          {
            id: 2,
            title: 'Team Meeting',
            description: 'Weekly sync-up',
            start: '2025-03-10T09:00',
            end: '2025-03-10T09:30',
            location: 'Remote',
            mapUrl: 'https://maps.google.com/location',
            creator: 'eTeD3Nj4ZmPeno8vQUNMUNEDsaA3',
            visibility: 'private',
            image:
              'https://images.unsplash.com/photo-1504384308090-c894fdcc538d',
          },
          {
            id: 3,
            title: 'JS Conference',
            description: 'Biggest JavaScript conference',
            start: '2025-04-01T10:00',
            end: '2025-04-01T18:00',
            location: 'Plovdiv, Bulgaria',
            mapUrl: 'https://maps.google.com/location',
            creator: 'AA9MWTN0xZWFueBJvHaK9WrnCld2',
            visibility: 'public',
            image:
              'https://images.unsplash.com/photo-1504384308090-c894fdcc538d',
          },
          {
            id: 4,
            title: 'Private Brainstorming Session',
            description: 'Discussing project ideas',
            start: '2025-05-10T15:00',
            end: '2025-05-10T17:00',
            location: 'Sofia, Bulgaria',
            mapUrl: 'https://maps.google.com/location',
            creator: 'AA9MWTN0xZWFueBJvHaK9WrnCld2',
            visibility: 'private',
            image:
              'https://images.unsplash.com/photo-1504384308090-c894fdcc538d',
          },
          {
            id: 5,
            title: 'Strategy Meeting',
            description: 'Business strategy for Q3',
            start: '2025-06-15T10:00',
            end: '2025-06-15T12:30',
            location: 'Varna, Bulgaria',
            mapUrl: 'https://maps.google.com/location',
            creator: 'eTeD3Nj4ZmPeno8vQUNMUNEDsaA3',
            visibility: 'private',
            image:
              'https://images.unsplash.com/photo-1504384308090-c894fdcc538d',
          },
        ];

        // If we are viewing our own profile -> all events we have created (public and private)
        // If we are viewing another user's profile -> only the public events
        const filteredEvents = allEvents.filter(
          (event) =>
            event.creator === profileId || event.visibility === 'public'
        );

        resolve(filteredEvents);
      }, 1000);
    });
  } catch (error) {
    console.log(error);
  }
};

// This function returns all events the user is invited to
//this function work only if the user is viewing her own profile
export const getEventInvitesById = async (id: string): Promise<any> => {
  try {
    return new Promise((resolve) => {
      setTimeout(() => {
        //Mock data (this will be replaced with real database data)
        resolve([
          {
            id: 6,
            title: 'Tech Meetup',
            description: 'Monthly IT meetup',
            start: '2025-03-12T18:30',
            end: '2025-03-12T20:30',
            location: 'Sofia, Bulgaria',
            mapUrl: 'https://maps.google.com/location',
            participants: { [id]: true },
            visibility: 'private',
            image:
              'https://images.unsplash.com/photo-1504384308090-c894fdcc538d', // mock image
          },
          {
            id: 7,
            title: 'Blockchain Conference',
            description: 'Future of blockchain',
            start: '2025-04-10T09:00',
            end: '2025-04-10T17:00',
            location: 'Varna, Bulgaria',
            mapUrl: 'https://maps.google.com/location',
            participants: { [id]: true },
            visibility: 'private',
            image:
              'https://images.unsplash.com/photo-1504384308090-c894fdcc538d',
          },
          {
            id: 8,
            title: 'Artificial Intelligence Summit',
            description: 'AI trends and innovations',
            start: '2025-05-02T10:00',
            end: '2025-05-02T16:00',
            location: 'Plovdiv, Bulgaria',
            mapUrl: 'https://maps.google.com/location',
            participants: { [id]: true },
            visibility: 'private',
            image:
              'https://images.unsplash.com/photo-1504384308090-c894fdcc538d',
          },
          {
            id: 9,
            title: 'Leadership Training',
            description: 'Become a better leader',
            start: '2025-06-08T14:00',
            end: '2025-06-08T18:00',
            location: 'Burgas, Bulgaria',
            mapUrl: 'https://maps.google.com/location',
            participants: { [id]: true },
            visibility: 'private',
            image:
              'https://images.unsplash.com/photo-1504384308090-c894fdcc538d',
          },
          {
            id: 10,
            title: 'Coding Bootcamp',
            description: 'Full-stack development',
            start: '2025-07-15T09:00',
            end: '2025-07-15T17:00',
            location: 'Sofia, Bulgaria',
            mapUrl: 'https://maps.google.com/location',
            participants: { [id]: true },
            visibility: 'private',
            image:
              'https://images.unsplash.com/photo-1504384308090-c894fdcc538d',
          },
        ]);
      }, 1000);
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateUserProfile = async (
  uid: string,
  updatedData: Partial<databaseUser>
) => {
  try {
    const userRef = ref(db, `users/${uid}`);

    await update(userRef, updatedData);
    return { success: true, message: 'Profile updated successfully!' };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { success: false, message: 'Failed to update profile.' };
  }
};

export const toggleUserAdminStatus = async (uid: string) => {
  try {
    const userRef = ref(db, `users/${uid}`);

    const snapshot = await get(userRef);
    if (!snapshot.exists()) {
      return { success: false, message: 'User not found.' };
    }

    const isAdmin = snapshot.val().isAdmin ?? null;
    await update(userRef, { isAdmin: isAdmin ? null : true });

    return {
      success: true,
      message: `User is now ${isAdmin ? 'a regular user' : 'an admin'}.`,
    };
  } catch (error) {
    console.error('Error toggling admin status:', error);
    return { success: false, message: 'Failed to update admin status.' };
  }
};

export const toggleUserBlockStatus = async (uid: string) => {
  try {
    const userRef = ref(db, `users/${uid}`);

    const snapshot = await get(userRef);
    if (!snapshot.exists()) {
      return { success: false, message: 'User not found.' };
    }

    const isBlocked = snapshot.val().isBlocked ?? null;
    await update(userRef, { isBlocked: isBlocked ? null : true });

    return {
      success: true,
      message: `User has been ${isBlocked ? 'unblocked' : 'blocked'}.`,
    };
  } catch (error) {
    console.error('Error toggling block status:', error);
    return { success: false, message: 'Failed to update block status.' };
  }
};


export const listenForNotifications = (
  userId: string,
  setNotifications: (notifications: Notification[]) => void
) => {
  const notificationsRef = ref(db, "notifications");

  const unsubscribe = onValue(notificationsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const userNotifications: Notification[] = Object.entries(data)
        .filter(([_, notif]) => (notif as Notification).userId === userId)
        .map(([id, notif]) => ({ ...(notif as Notification), id }));

      setNotifications(userNotifications);
    } else {
      setNotifications([]);
    }
  });

  return () => off(notificationsRef, "value", unsubscribe);
};

export const sendFriendRequest = async (
  currentUserId: string,
  targetUserId: string
) => {
  try {
    const senderRef = ref(db, `users/${currentUserId}`);
    const senderSnapshot = await get(senderRef);
    const senderData = senderSnapshot.val();

    if (!senderData) {
      console.error('Sender data not found!');
      return;
    }

    const updates: Record<string, unknown> = {};
    updates[`users/${currentUserId}/friendRequests/sent/${targetUserId}`] = true;
    updates[`users/${targetUserId}/friendRequests/received/${currentUserId}`] =
      true;

    await update(ref(db), updates);

    const notificationsRef = ref(db, 'notifications');
    await push(notificationsRef, {
      userId: targetUserId,
      type: 'friend_request',
      message: `${senderData.firstName} ${senderData.lastName} sent you a friend request!`,
      senderId: currentUserId,
      senderImage: senderData.image,
      timestamp: Date.now(),
    });

  } catch (error) {
    console.error('Error sending friend request:', error);
  }
};

export const acceptFriendRequest = async (
  currentUserId: string,
  senderId: string,
  notificationId: string
) => {
  try {
    const updates: Record<string, unknown> = {};

    updates[`users/${currentUserId}/contacts/${senderId}`] = true;
    updates[`users/${senderId}/contacts/${currentUserId}`] = true;

    updates[`users/${currentUserId}/friendRequests/received/${senderId}`] = null;
    updates[`users/${senderId}/friendRequests/sent/${currentUserId}`] = null;

    updates[`notifications/${notificationId}`] = null;

    await update(ref(db), updates);
  } catch (error) {
    console.error('Error accepting friend request:', error);
  }
};

export const declineFriendRequest = async (
  currentUserId: string,
  senderId: string,
  notificationId: string
) => {
  try {
    const updates: Record<string, unknown> = {};

    updates[`users/${currentUserId}/friendRequests/received/${senderId}`] = null;
    updates[`users/${senderId}/friendRequests/sent/${currentUserId}`] = null;

    updates[`notifications/${notificationId}`] = null;

    await update(ref(db), updates);
  } catch (error) {
    console.error('Error declining friend request:', error);
  }
};


export const removeFriend = async (currentUserId: string, friendId: string) => {
  try {
    const updates: Record<string, unknown> = {};
    updates[`users/${currentUserId}/contacts/${friendId}`] = null;
    updates[`users/${friendId}/contacts/${currentUserId}`] = null;

    await update(ref(db), updates);
  } catch (error) {
    console.error('Error removing friend:', error);
  }
};

export const getUserEvents = async (userId: string) => {
  try {
    const eventsRef = ref(db, 'events');
    const snapshot = await get(eventsRef);
    const allEvents = snapshot.val();

    if (!allEvents) return [];

    return Object.entries(allEvents)
      .filter(([, event]) => (event as Event).creatorId === userId)
      .map(([id, event]) => ({ ...(event as Event), id })); //
  } catch (error) {
    console.error('Error fetching user events:', error);
    return [];
  }
};

export const sendEventInvite = async (
  senderId: string,
  recipientId: string,
  eventId: string
) => {
  try {
    const eventRef = ref(db, `events/${eventId}`);
    const eventSnapshot = await get(eventRef);
    const eventData = eventSnapshot.val();
    console.log('data', eventData);

    if (!eventData) {
      console.error('Event not found!');
      return;
    }

    const notificationsRef = ref(db, 'notifications');
    await push(notificationsRef, {
      userId: recipientId,
      type: 'event_invite',
      message: `You have been invited to "${eventData.title}"`,
      senderId,
      senderImage: eventData.image, 
      eventId,
      eventTitle: eventData.title, 
      eventStart: eventData.start, 
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Error sending event invite:', error);
  }
};

export const acceptEventInvite = async (
  userId: string,
  eventId: string,
  notificationId: string
) => {
  try {
    const eventRef = ref(db, `events/${eventId}`);
    const eventSnapshot = await get(eventRef);
    const eventData = eventSnapshot.val();

    if (!eventData) {
      console.error('Event not found!');
      return;
    }

    const updates: Record<string, unknown> = {};
    updates[`events/${eventId}/participants/${userId}`] = true;

    await update(ref(db), updates);
    await remove(ref(db, `notifications/${notificationId}`));

  } catch (error) {
    console.error('Error accepting event invite:', error);
  }
};

export const declineEventInvite = async (notificationId: string) => {
  try {
    await remove(ref(db, `notifications/${notificationId}`));
  } catch (error) {
    console.error('Error declining event invite:', error);
  }
};
