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
import { PAGE_SIZE } from '../common/constants';

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
        (event) => (event as Event).visibility === 'public'
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
  const notificationsRef = ref(db, 'notifications');

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

  return () => off(notificationsRef, 'value', unsubscribe);
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
    updates[`users/${currentUserId}/friendRequests/sent/${targetUserId}`] =
      true;
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

    updates[`users/${currentUserId}/friendRequests/received/${senderId}`] =
      null;
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

    updates[`users/${currentUserId}/friendRequests/received/${senderId}`] =
      null;
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

export const getUserOwnedAndJoinedEvents = async (
  userId: string
): Promise<Event[]> => {
  try {
    const eventsRef = ref(db, 'events');
    const snapshot = await get(eventsRef);
    const allEvents = snapshot.val();

    if (!allEvents) return [];

    const userEvents: Event[] = Object.entries(allEvents)
      .filter(([_, event]) => {
        const eventData = event as Event;
        return (
          eventData.creatorId === userId || eventData.participants?.[userId]
        );
      })
      .map(([id, event]) => ({ ...(event as Event), eventId: id }));

    return userEvents;
  } catch (error) {
    console.error('Error fetching user events:', error);
    return [];
  }
};



export const getEventById = async (eventId: string) => {
  try {
    const eventSnapshot = await get(ref(db, `events/${eventId}`));
    return eventSnapshot.exists() ? { id: eventId, ...eventSnapshot.val() } : null;
  } catch (error) {
    console.error('Error fetching event:', error);
    throw new Error('Failed to fetch event');
  }
};


export const deleteEvent = async (eventId: string): Promise<void> => {
  try {
    await remove(ref(db, `events/${eventId}`));
    console.log(`Event ${eventId} deleted successfully`);
  } catch (error) {
    console.error('Error deleting event:', error);
    throw new Error('Failed to delete event');
  }
};


export const updateEvent = async (eventId: string, updatedData: Partial<Event>) => {
  try {
    await update(ref(db, `events/${eventId}`), updatedData);
  } catch (error) {
    console.error('Error updating event:', error);
  }
};



export const joinEvent = async (eventId: string, userId: string) => {
  try {
    const updates: Record<string, boolean> = {};
    updates[`events/${eventId}/participants/${userId}`] = true; 

    await update(ref(db), updates);
    console.log(`User ${userId} joined event ${eventId}`);
  } catch (error) {
    console.error("Error joining event:", error);
    throw error;
  }
};



export const leaveEvent = async (eventId: string, userId: string) => {
  const eventRef = ref(db, `events/${eventId}/participants/${userId}`);

  try {
    await remove(eventRef);
    console.log(`User ${userId} left event ${eventId}`);
  } catch (error) {
    console.error("Error leaving event:", error);
    throw error;
  }
};

export const getUserFriends = async (userId: string) => {
  const userRef = ref(db, `users/${userId}/contacts`);
  const snapshot = await get(userRef);
  if (!snapshot.exists()) return [];
  
  const friendIds = Object.keys(snapshot.val());
  const friends = await Promise.all(friendIds.map(async (friendId) => {
    const friendData = await getUserById(friendId);
    return { uid: friendId, ...friendData };
  }));

  return friends;
};


export const getInvitedUsersForEvent = async (eventId: string): Promise<string[]> => {
  try {
    const notificationsSnapshot = await get(ref(db, 'notifications'));
    const notificationsData = notificationsSnapshot.val();

    if (!notificationsData) return [];

    return Object.entries(notificationsData)
      .filter(([_, notification]) => 
        (notification as Notification).type === 'event_invite' && (notification as Notification).eventId === eventId
      )
      .map(([_, notification]) => (notification as Notification).userId);
  } catch (error) {
    console.error("Error fetching invited users:", error);
    return [];
  }
};


export const paginatedUsers = async (
  searchTerm: string,
  page: number
): Promise<{ data: databaseUser[]; hasMore: boolean }> => {
  try {
    const snapshot = await get(ref(db, 'users'));
    if (!snapshot.exists()) {
      return { data: [], hasMore: false };
    }

    const usersObj = snapshot.val();
    console.log('usersobj',usersObj);
    

    const usersArr: databaseUser[] = Object.keys(usersObj).map((uid) => ({
      uid,
      ...usersObj[uid],
    }));


    const lowerSearch = searchTerm.toLowerCase();
    const filtered = usersArr.filter((user) => {
      return (
        user.username?.toLowerCase().includes(lowerSearch) ||
        user.firstName?.toLowerCase().includes(lowerSearch) ||
        user.lastName?.toLowerCase().includes(lowerSearch) ||
        user.email?.toLowerCase().includes(lowerSearch)
      );
    });

    // Load more
    const startIndex = (page - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const pageData = filtered.slice(startIndex, endIndex);

    return {
      data: pageData,
      hasMore: endIndex < filtered.length, // Check if there are more users
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    return { data: [], hasMore: false };
  }
};

export const paginatedEvents = async (
  searchTerm: string,
  page: number
): Promise<{ data: Event[]; hasMore: boolean }> => {
  try {
    const snapshot = await get(ref(db, 'events'));
    if (!snapshot.exists()) {
      return { data: [], hasMore: false };
    }

    const eventsObj = snapshot.val();
    const eventsArr: Event[] = Object.keys(eventsObj).map((id) => ({
      id,
      ...eventsObj[id],
    }));

    //Filter events by title
    const lowerSearch = searchTerm.toLowerCase();
    const filtered = eventsArr.filter((event) => {
      return event.title?.toLowerCase().includes(lowerSearch);
    });

    //Load more
    const startIndex = (page - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const pageData = filtered.slice(startIndex, endIndex);

    return {
      data: pageData,
      hasMore: endIndex < filtered.length, // Check if there are more events
    };
  } catch (error) {
    console.error('Error fetching events:', error);
    return { data: [], hasMore: false };
  }
};
