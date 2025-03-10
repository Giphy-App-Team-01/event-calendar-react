import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/app.context';
import Button from '../../components/Button/Button';
import {
  validateTitle,
  validateDescription,
  validateLocation,
} from '../../utils/validationHelpers';
import { Event } from '../../types/interfaces';
import { format, parseISO } from 'date-fns';
import { Trash, CalendarPlus, Pencil, XCircle } from 'lucide-react';
import {
  deleteEvent,
  getEventById,
  getUserById,
  joinEvent,
  leaveEvent,
  updateEvent,
} from '../../services/db-service';
import EventMap from '../EventMap/EventMap';
import { toast } from 'react-toastify';

const SingleEventView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { authUser, dbUser } = useContext(AppContext);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [organizer, setOrganizer] = useState<string | null>(null);
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
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

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
      
      validateTitle(formData.title || '') 
      validateDescription(formData.description || '') 
      validateLocation(formData.location || '')
  
      if (event) {
      await updateEvent(event.id, formData);
      }
      setEvent((prev: Event | null) => (prev ? { ...prev, ...formData } : prev));
      setIsEditOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unknown error occurred');
      }
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

  if (loading)
    return <p className="text-center text-gray-600">Loading event...</p>;
  if (!event)
    return <p className="text-center text-red-500">Event not found.</p>;


  return (
    <div className="min-h-screen py-5">
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
          {(authUser?.uid === event.creatorId || dbUser?.isAdmin) && (
            <div className="flex gap-2">
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
          {authUser?.uid && event.participants?.[authUser.uid] ? (
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
          )}
        </div>

  
        {isEditOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-lg backdrop-brightness-75">
            <div className="bg-white p-6 rounded-lg shadow-xl w-96">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">
                Edit Event
              </h2>

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
                value={formData.start}
                onChange={(e) =>
                  setFormData({ ...formData, start: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md mb-2 text-gray-900"
              />

              <label className="block text-sm font-medium text-gray-800">
                End Date
              </label>
              <input
                type="datetime-local"
                value={formData.end}
                onChange={(e) =>
                  setFormData({ ...formData, end: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md mb-2 text-gray-900"
              />

              <label className="block text-sm font-medium text-gray-800">
                Recurrence
              </label>
              <select
                value={formData.recurrence}
                onChange={(e) =>
                  setFormData({ ...formData, recurrence: e.target.value as 'daily' | 'weekly' | 'monthly' | undefined })
                }
                className="w-full p-2 border border-gray-300 rounded-md mb-4 text-gray-900"
              >
                <option value="">None</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>

              <div className="flex justify-end gap-2">
                <Button
                  className="bg-gray-400 text-white px-4 py-2 rounded-md"
                  onClick={() => setIsEditOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-green-500 text-white px-4 py-2 rounded-md"
                  onClick={handleSaveEdit}
                >
                  Save Changes
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
