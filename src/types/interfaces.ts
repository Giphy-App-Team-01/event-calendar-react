import { Dispatch, SetStateAction } from 'react';

//This is a simple interface that defines the structure of an event object.
export interface Event {
  id: string;
  creatorId: string;
  title: string;
  start: string;
  end: string;
  participants?: {
    [key: string]: boolean;
  };
  recurrence?: 'daily' | 'weekly' | 'monthly';
  mapUrl: string;
  location: string;
  description: string;
  image: string;
  eventId: string;
  visibility: string;
}

//Interface fo user which is returned by Firebase
export interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  phoneNumber?: string | null;
  providerId?: string;
}

//Interface for user which is stored in the database
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
  isAdmin: boolean;
  isBlocked: boolean;
  contacts?: { [key: string]: boolean };
  friendRequests?: {
    received?: Record<string, boolean>;
    sent?: Record<string, boolean>;
  };
}

export interface Notification {
  id: string;
  senderImage?: string;
  message: string;
  type: 'friend_request' | 'event_invite';
  senderId?: string;
  eventId?: string;
  eventTitle?: string;
  eventStart?: string;
  userId: string;
}

//Interface for the app state which is used in the context
export interface AppState {
  authUser: FirebaseUser | null;
  dbUser: databaseUser | null;
  loading: boolean;
}

//Extended interface for the app state which includes a function to update the state
export interface AppContextType extends AppState {
  setAppState: Dispatch<SetStateAction<AppState>>;
}
