import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/app.context';
import Button from '../../components/Button/Button';
import {
  validateTitle,
  validateDescription,
  validateLocation,
} from '../../utils/validationHelpers';
import { databaseUser, Event } from '../../types/interfaces';
import { format, parseISO } from 'date-fns';
import {
  Trash,
  CalendarPlus,
  Pencil,
  XCircle,
  UserPlus,
  Loader2,
} from 'lucide-react';
import {
  deleteEvent,
  getEventById,
  getInvitedUsersForEvent,
  getUserById,
  getUserFriends,
  joinEvent,
  leaveEvent,
  sendEventInvite,
  updateEvent,
} from '../../services/db-service';
import EventMap from '../EventMap/EventMap';
import { toast } from 'react-toastify';
import { uploadImageToCloudinary } from '../../services/upload-service';
import Loading from '../../components/Loading/Loading';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';

const SingleEventView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { authUser, dbUser } = useContext(AppContext);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [organizer, setOrganizer] = useState<string | null>(null);
  const [friends, setFriends] = useState<databaseUser[]>([]);
  const [isInvitePopupOpen, setIsInvitePopupOpen] = useState(false);
  const [invitedUsers, setInvitedUsers] = useState<string[]>([]);
  const [editCoverFile, setEditCoverFile] = useState<File | null>(null);
  const [editCoverPreview, setEditCoverPreview] = useState<string | null>(null);
  const [loadingEdit, setLoadingEdit] = useState<boolean>(false);

  const [formData, setFormData] = useState<Partial<Event>>({
    title: '',
    description: '',
    location: '',
    start: '',
    end: '',
    recurrence: undefined,
  });

  useEffect(() => {
    if (!id) return;

    const fetchEvent = async () => {
      try {
        const eventData = await getEventById(id);
        const userData = await getUserById(eventData.creatorId);
        setOrganizer(userData?.username ?? null);

        setEvent(eventData);
        setFormData({
          title: eventData.title,
          description: eventData.description,
          location: eventData.location,
          start: eventData.start,
          end: eventData.end,
          recurrence: eventData.recurrence || 'None',
        });

        if (authUser?.uid === eventData.creatorId) {
          if (authUser) {
            const friendsList = await getUserFriends(authUser.uid);
            setFriends(
              friendsList.filter(
                (friend) => friend.allowEventInvites
              ) as databaseUser[]
            );
          }
          const invitedUsersList = await getInvitedUsersForEvent(eventData.id);
          setInvitedUsers(invitedUsersList);
        }
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, authUser]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this event?'
    );
    if (confirmDelete && event) {
      await deleteEvent(event.id);
      navigate('/');
    }
  };

  const handleSaveEdit = async () => {
    try {
      setLoadingEdit(true);
      validateTitle(formData.title || '');
      validateDescription(formData.description || '');
      validateLocation(formData.location || '');

      const updatedData: Partial<Event> = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        start: formData.start,
        end: formData.end,
      };

      if (formData.recurrence && formData.recurrence.toLowerCase() !== 'none') {
        updatedData.recurrence = formData.recurrence;
      } else {
        updatedData.recurrence = null;
      }

      if (editCoverFile) {
        const newImageUrl = await uploadImageToCloudinary(editCoverFile);
        updatedData.image = newImageUrl || event?.image || '';
      }

      if (event) {
        await updateEvent(event.id, updatedData);
      }
      setEvent((prev: Event | null) =>
        prev ? { ...prev, ...updatedData } : prev
      );
      setIsEditOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unknown error occurred');
      }
    } finally {
      setLoadingEdit(false);
    }
  };

  const handleEditCoverFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setEditCoverFile(file);
      setEditCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleJoinEvent = async () => {
    if (!event || !authUser) return;

    try {
      await joinEvent(event.id, authUser.uid);
      setEvent((prev: Event | null) => {
        if (!prev) return prev;
        return {
          ...prev,
          participants: { ...prev.participants, [authUser.uid]: true },
        } as Event;
      });
    } catch (error) {
      console.error('Error joining event:', error);
    }
  };

  const handleLeaveEvent = async () => {
    if (!event || !authUser) return;

    try {
      await leaveEvent(event.id, authUser.uid);
      setEvent((prev: Event | null) => {
        if (!prev) return prev;
        const updatedParticipants = { ...prev.participants };
        delete updatedParticipants[authUser.uid];
        return { ...prev, participants: updatedParticipants } as Event;
      });
    } catch (error) {
      console.error('Error leaving event:', error);
    }
  };
  const handleSendEventInvite = async (friendId: string) => {
    if (!event || !authUser) return;

    try {
      await sendEventInvite(authUser.uid, friendId, event.id);
      toast.success('Invitation sent!');

      // Добавяме потребителя към списъка с поканени
      setInvitedUsers((prev) => [...prev, friendId]);
    } catch (error) {
      console.error('Error sending invite:', error);
      toast.error('Failed to send invitation.');
    }
  };

  const currentYear = new Date().getFullYear();

  const handleDateTimeBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value) return;
    const parts = value.split('-');
    const enteredYear = parseInt(parts[0], 10);
    if (enteredYear < currentYear) {
      parts[0] = currentYear.toString();
      const newValue = parts.join('-');
      setFormData((prev) => ({ ...prev, [e.target.name]: newValue }));
    }
  };

  if (loading) return <Loading type="event" />;

  if (!event)
    return (
      <ErrorMessage
        type={'event'} error={{ message: "We couldn't find the event you're looking for." }}
      />
    );

  return (
    <div className="min-h-screen py-5">
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <div className="grid grid-cols-[1fr_auto] gap-4 mb-4 items-center">
          <h1 className="text-3xl font-bold text-gray-900 break-words">
            {event.title}
          </h1>
          {(authUser?.uid === event.creatorId || dbUser?.isAdmin) && (
            <div className="flex gap-2">
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer shadow-md transition-all duration-200"
                onClick={() => setIsInvitePopupOpen(true)}
              >
                <UserPlus className="w-5 h-5" /> Invite Friends
              </Button>
              <Button
                className="bg-yellow-500 hover:bg-yellow-600 text-white flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer"
                onClick={() => setIsEditOpen(true)}
              >
                <Pencil className="w-5 h-5" /> Edit Event
              </Button>
              <Button
                className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer"
                onClick={handleDelete}
              >
                <Trash className="w-5 h-5" /> Delete Event
              </Button>
            </div>
          )}
        </div>

        <img
          src={event.image}
          alt={event.title}
          className="w-full h-64 object-cover rounded-md shadow-md mb-6"
        />

        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          {event.description}
        </p>

        <div className="border-t pt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800">
          <div className="space-y-4">
            <p className="text-lg">
              <strong className="font-semibold text-gray-900">
                Start Date:
              </strong>{' '}
              {format(parseISO(event.start), "EEEE, MMMM d, yyyy 'at' h:mm a")}
            </p>
            <p className="text-lg">
              <strong className="font-semibold text-gray-900">End Date:</strong>{' '}
              {format(parseISO(event.end), "EEEE, MMMM d, yyyy 'at' h:mm a")}
            </p>
            <div>
              <p>
                <strong>Location:</strong> {event.location}
              </p>
              <EventMap address={event.location} />
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-lg">
              <strong className="font-semibold text-gray-900">
                Organizer:
              </strong>{' '}
              {organizer}
            </p>
            <p className="text-lg">
              <strong className="font-semibold text-gray-900">
                Recurrence:
              </strong>{' '}
              {event.recurrence ? event.recurrence : 'None'}
            </p>
          </div>
        </div>

        <div className="mt-8">
          {authUser?.uid &&
            authUser.uid !== event.creatorId &&
            (event.participants?.[authUser.uid] ? (
              <Button
                className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-2 px-5 py-3 rounded-lg shadow-md text-lg cursor-pointer"
                onClick={handleLeaveEvent}
              >
                <XCircle className="w-6 h-6" /> Leave Event
              </Button>
            ) : (
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2 px-5 py-3 rounded-lg shadow-md text-lg cursor-pointer"
                onClick={handleJoinEvent}
              >
                <CalendarPlus className="w-6 h-6" /> Add to Calendar
              </Button>
            ))}
        </div>

        {isEditOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-lg backdrop-brightness-75">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">
                Edit Event
              </h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-800">
                  Cover Image
                </label>
                <div className="relative group">
                  <img
                    src={editCoverPreview || event.image}
                    alt="Cover Preview"
                    className="w-full h-48 object-cover rounded-xl border border-gray-200 shadow-sm transition-all duration-300 group-hover:shadow-lg"
                  />
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept="image/*"
                    onChange={handleEditCoverFileChange}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl">
                    <span className="text-white font-medium">Change Image</span>
                  </div>
                </div>
              </div>

              <label className="block text-sm font-medium text-gray-800">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md mb-2 text-gray-900"
              />

              <label className="block text-sm font-medium text-gray-800">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md text-gray-900 resize-none h-32"
              ></textarea>

              <label className="block text-sm font-medium text-gray-800">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md mb-2 text-gray-900"
              />

              <label className="block text-sm font-medium text-gray-800">
                Start Date
              </label>
              <input
                type="datetime-local"
                name="start"
                value={formData.start}
                onChange={(e) =>
                  setFormData({ ...formData, start: e.target.value })
                }
                onBlur={handleDateTimeBlur}
                className="w-full p-2 border border-gray-300 rounded-md mb-2 text-gray-900"
              />

              <label className="block text-sm font-medium text-gray-800">
                End Date
              </label>
              <input
                type="datetime-local"
                name="end"
                value={formData.end}
                onChange={(e) =>
                  setFormData({ ...formData, end: e.target.value })
                }
                onBlur={handleDateTimeBlur}
                className="w-full p-2 border border-gray-300 rounded-md mb-2 text-gray-900"
              />

              <label className="block text-sm font-medium text-gray-800">
                Recurrence
              </label>
              <select
                value={formData.recurrence || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    recurrence: e.target.value as
                      | 'daily'
                      | 'weekly'
                      | 'monthly'
                      | 'yearly'
                      | undefined,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md mb-4 text-gray-900"
              >
                <option value="">None</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>

              <div className="flex justify-end gap-2">
                <Button
                  className="bg-gray-400 text-white px-4 py-2 rounded-md cursor-pointer"
                  onClick={() => setIsEditOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-green-500 text-white px-4 py-2 rounded-md cursor-pointer"
                  onClick={handleSaveEdit}
                >
                  {loadingEdit ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="animate-spin w-6 h-6" />
                      <span>Saving...</span>
                    </div>
                  ) : (
                    'Save Changes'
                  )}{' '}
                </Button>
              </div>
            </div>
          </div>
        )}

        {isInvitePopupOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md transition-all duration-300 ease-out">
            <div className="bg-white p-6 rounded-lg shadow-2xl w-96 transform scale-100 hover:scale-105 transition-transform duration-300 ease-out">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 text-center">
                Invite Friends 🎉
              </h2>

              {friends.length === 0 ? (
                <p className="text-gray-500 text-sm text-center">
                  No friends available to invite.
                </p>
              ) : (
                <ul className="space-y-3">
                  {friends.map((friend) => {
                    const isAlreadyParticipant =
                      event?.participants?.[friend.uid];

                    return (
                      <li
                        key={friend.uid}
                        className="flex justify-between items-center p-3 bg-gray-100 rounded-lg shadow"
                      >
                        <div>
                          <p className="text-gray-900 font-medium">
                            {friend.firstName} {friend.lastName}
                          </p>
                          <p className="text-gray-500 text-sm">
                            @{friend.username}
                          </p>
                        </div>

                        <Button
                          className={`px-3 py-1 rounded-md text-sm ${
                            isAlreadyParticipant
                              ? 'bg-gray-400 cursor-not-allowed'
                              : invitedUsers.includes(friend.uid)
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-blue-500 hover:bg-blue-600 text-white cursor-pointer'
                          }`}
                          onClick={() => handleSendEventInvite(friend.uid)}
                          disabled={
                            isAlreadyParticipant ||
                            invitedUsers.includes(friend.uid)
                          }
                        >
                          {isAlreadyParticipant
                            ? 'Already Joined'
                            : invitedUsers.includes(friend.uid)
                            ? 'Pending'
                            : 'Invite'}
                        </Button>
                      </li>
                    );
                  })}
                </ul>
              )}

              <div className="mt-5 flex justify-center">
                <Button
                  className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md transition-all cursor-pointer"
                  onClick={() => setIsInvitePopupOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleEventView;
