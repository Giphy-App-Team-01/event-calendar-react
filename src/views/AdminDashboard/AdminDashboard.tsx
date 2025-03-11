import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { paginatedUsers, paginatedEvents } from '../../services/db-service';
import { databaseUser, Event } from '../../types/interfaces';
import Button from '../../components/Button/Button';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState<databaseUser[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [userPage, setUserPage] = useState(1);
  const [hasMoreUsers, setHasMoreUsers] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [eventSearch, setEventSearch] = useState('');
  const [eventPage, setEventPage] = useState(1);
  const [hasMoreEvents, setHasMoreEvents] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await paginatedUsers(userSearch, userPage);
        if (userPage === 1) {
          setUsers(response.data);
        } else {
          setUsers((prev) => [...prev, ...response.data]);
        }
        setHasMoreUsers(response.hasMore);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    loadUsers();
  }, [userSearch, userPage]);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await paginatedEvents(eventSearch, eventPage);
        if (eventPage === 1) {
          setEvents(response.data);
        } else {
          setEvents((prev) => [...prev, ...response.data]);
        }
        setHasMoreEvents(response.hasMore);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    loadEvents();
  }, [eventSearch, eventPage]);

  const handleUserSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserSearch(e.target.value);
    setUserPage(1);
  };

  const handleEventSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEventSearch(e.target.value);
    setEventPage(1);
  };

  return (
    <div className="p-6 bg-white min-h-screen text-gray-900">
      <h1 className="text-center text-3xl font-bold mb-8">Admin Dashboard</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">
          User Management
        </h2>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Search users
          </label>
          <input
            type="text"
            placeholder="By username, first/last name, email..."
            value={userSearch}
            onChange={handleUserSearchChange}
            className="input input-bordered w-full max-w-md bg-gray-100 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-300"
          />
        </div>

        <div className="overflow-x-auto max-h-96 overflow-y-auto border border-gray-300 rounded-lg">
          <table className="table-auto w-full text-left text-gray-800">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 font-semibold">Username</th>
                <th className="py-2 px-4 font-semibold">First Name</th>
                <th className="py-2 px-4 font-semibold">Last Name</th>
                <th className="py-2 px-4 font-semibold">Email</th>
                <th className="py-2 px-4 font-semibold">Role</th>
                <th className="py-2 px-4 font-semibold">Blocked</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const roleLabel = user.isAdmin ? 'Admin' : 'Regular User';
                return (
                  <tr
                    key={user.uid}
                    className="hover:bg-gray-100 cursor-pointer"
                    onClick={() => navigate(`/user/${user.uid}`)}
                  >
                    <td className="py-2 px-4">{user.username}</td>
                    <td className="py-2 px-4">{user.firstName}</td>
                    <td className="py-2 px-4">{user.lastName}</td>
                    <td className="py-2 px-4">{user.email}</td>
                    <td className="py-2 px-4">{roleLabel}</td>
                    <td className="py-2 px-4">
                      {user.isBlocked ? 'Yes' : 'No'}
                    </td>
                  </tr>
                );
              })}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {hasMoreUsers && users.length > 0 && (
          <Button
            className="mt-4"
            onClick={() => setUserPage((prev) => prev + 1)}
          >
            Load More Users
          </Button>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">
          Event Management
        </h2>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Search events
          </label>
          <input
            type="text"
            placeholder="By event title..."
            value={eventSearch}
            onChange={handleEventSearchChange}
            className="input input-bordered w-full max-w-md bg-gray-100 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-300"
          />
        </div>

        <div className="overflow-x-auto max-h-96 overflow-y-auto border border-gray-300 rounded-lg">
          <table className="table-auto w-full text-left text-gray-800">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 font-semibold">Title</th>
                <th className="py-2 px-4 font-semibold">Start</th>
                <th className="py-2 px-4 font-semibold">End</th>
                <th className="py-2 px-4 font-semibold">Location</th>
                <th className="py-2 px-4 font-semibold">Recurrence</th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev) => (
                <tr
                  key={ev.id}
                  className="hover:bg-gray-100 cursor-pointer"
                  onClick={() => navigate(`/event/${ev.id}`)}
                >
                  <td className="py-2 px-4">{ev.title}</td>
                  <td className="py-2 px-4">{ev.start}</td>
                  <td className="py-2 px-4">{ev.end}</td>
                  <td className="py-2 px-4">{ev.location || 'N/A'}</td>
                  <td className="py-2 px-4">
                    {ev.recurrence ? ev.recurrence : 'None'}
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-gray-500">
                    No events found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {hasMoreEvents && events.length > 0 && (
          <Button
            className="mt-4"
            onClick={() => setEventPage((prev) => prev + 1)}
          >
            Load More Events
          </Button>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
