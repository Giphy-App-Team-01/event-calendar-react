import { useEffect, useState, useContext } from 'react';
import { AppContext } from '../../context/app.context';
import {
  getUserById,
  removeFriend,
  getUserEvents,
  sendEventInvite,
  getInvitedUsersForEvent,
} from '../../services/db-service';
import Button from '../../components/Button/Button';
import { UserMinus, CalendarPlus, XCircle, CalendarDays } from 'lucide-react';
import { format, isSameDay, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { databaseUser, Event } from '../../types/interfaces';

const MyContacts: React.FC = () => {
  const { authUser } = useContext(AppContext);
  const [contacts, setContacts] = useState<databaseUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [eventInvites, setEventInvites] = useState<{ [key: string]: string[] }>(
    {}
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (!authUser) return;

    const fetchContacts = async () => {
      const userData = await getUserById(authUser.uid);
      if (userData?.contacts) {
        const contactsArray = await Promise.all(
          Object.keys(userData.contacts).map(async (contactId) => {
            const contactData = await getUserById(contactId);
            if (contactData) {
              return {
                ...contactData,
                uid: contactId,
                username: contactData.username || '',
                firstName: contactData.firstName || '',
                lastName: contactData.lastName || '',
                phoneNumber: contactData.phoneNumber || '',
                address: contactData.address || '',
                email: contactData.email || '',
              };
            }
            return null;
          })
        );
        setContacts(
          contactsArray.filter((contact) => contact !== null) as databaseUser[]
        );
      }
    };

    fetchContacts();
  }, [authUser]);

  const handleRemoveFriend = async (friendId: string) => {
    if (!authUser) return;
    await removeFriend(authUser.uid, friendId);
    setContacts((prevContacts) =>
      prevContacts.filter((c) => c.uid !== friendId)
    );
  };

  const handleOpenInvitePopup = async (friendId: string) => {
    if (!authUser) return;

    const userEvents = await getUserEvents(authUser.uid);
    setEvents(userEvents || []);
    setSelectedUser(friendId);

    const invitesPromises = userEvents.map(async (event) => {
      const invites = await getInvitedUsersForEvent(event.id);
      return { eventId: event.id, invites };
    });

    const invitesResults = await Promise.all(invitesPromises);
    const invitesObj = invitesResults.reduce((acc, { eventId, invites }) => {
      acc[eventId] = invites;
      return acc;
    }, {} as { [key: string]: string[] });
    setEventInvites(invitesObj);

    setIsPopupOpen(true);
  };

  const handleSendEventInvite = async (eventId: string) => {
    if (!authUser || !selectedUser) return;

    await sendEventInvite(authUser.uid, selectedUser, eventId);
    setEventInvites((prev) => ({
      ...prev,
      [eventId]: [...(prev[eventId] || []), selectedUser],
    }));
    setIsPopupOpen(false);
  };

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">My Contacts</h2>

        {contacts.length === 0 ? (
          <p className="text-gray-500 text-center">You have no contacts yet.</p>
        ) : (
          <ul className="space-y-3">
            {contacts.map((contact) => (
              <li
                key={contact.uid}
                className="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow-md"
              >
                <div className="flex items-center gap-4">
                  <img
                    onClick={() => navigate(`/user/${contact.uid}`)}
                    src={contact.image}
                    alt="Profile"
                    className="w-12 h-12 rounded-full border shadow-sm cursor-pointer"
                  />
                  <p className="text-gray-900 font-medium text-lg">
                    {contact.firstName} {contact.lastName}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md flex items-center gap-2 shadow"
                    onClick={() => handleRemoveFriend(contact.uid)}
                  >
                    <UserMinus className="w-5 h-5 text-white" />
                    Remove
                  </Button>

                  {contact.allowEventInvites && (
                    <Button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 shadow"
                      onClick={() => handleOpenInvitePopup(contact.uid)}
                    >
                      <CalendarPlus className="w-5 h-5 text-white" />
                      Invite
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        {isPopupOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-8">
              <button
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
                onClick={() => setIsPopupOpen(false)}
              >
                <XCircle className="w-6 h-6" />
              </button>
              <h3 className="text-2xl font-bold mb-6 text-gray-800 text-center">
                Select an Event
              </h3>
              <ul className="space-y-4">
                {events.length === 0 ? (
                  <p className="text-gray-500 text-center">
                    You have no created events.
                  </p>
                ) : (
                  events.map((event) => {
                    const invitesForEvent = eventInvites[event.id] || [];
                    const isAlreadyInvited = invitesForEvent.includes(
                      selectedUser!
                    );
                    const isAlreadyParticipant =
                      event.participants && event.participants[selectedUser!];

                    return (
                      <li
                        key={event.id}
                        className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-100 rounded-lg shadow-md"
                      >
                        <div className="flex items-center gap-4">
                          <CalendarDays className="w-6 h-6 text-blue-500" />
                          <div>
                            <p className="text-gray-900 font-medium">
                              {event.title}
                            </p>
                            <p className="text-gray-500 text-sm">
                              {format(
                                parseISO(event.start),
                                'EEE, MMM dd, HH:mm'
                              )}
                              {' - '}
                              {isSameDay(
                                parseISO(event.start),
                                parseISO(event.end)
                              )
                                ? format(parseISO(event.end), 'HH:mm')
                                : format(
                                    parseISO(event.end),
                                    'EEE, MMM dd, HH:mm'
                                  )}
                            </p>
                          </div>
                        </div>

                        <Button
                          className={`mt-4 sm:mt-0 px-4 py-2 rounded-md text-sm ${
                            isAlreadyParticipant || isAlreadyInvited
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-green-500 hover:bg-green-600 text-white'
                          }`}
                          onClick={() => handleSendEventInvite(event.id)}
                          disabled={isAlreadyParticipant || isAlreadyInvited}
                        >
                          {isAlreadyParticipant
                            ? 'Already Joined'
                            : isAlreadyInvited
                            ? 'Pending'
                            : 'Invite'}
                        </Button>
                      </li>
                    );
                  })
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyContacts;
