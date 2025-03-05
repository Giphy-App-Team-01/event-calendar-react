import { Link, useNavigate } from 'react-router-dom';
import Button from '../Button/Button';
import {
  useContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import LoginModal from '../../views/LoginModal/LoginModal';
import RegisterModal from '../../views/RegisterModal/RegisterModal';
import { logoutUser } from '../../services/auth-service';
import { AppContext } from '../../context/app.context';
import { toast } from 'react-toastify';
import Container from '../Container/Container';
import UserSearch from '../UserSearch/UserSearch';
import { Bell, Calendar } from 'lucide-react';
import {
  acceptEventInvite,
  acceptFriendRequest,
  declineEventInvite,
  declineFriendRequest,
  listenForNotifications,
} from '../../services/db-service';
import { format, parseISO } from 'date-fns';
import { Notification } from '../../types/interfaces';

interface HeaderProps {
  isLoginOpen: boolean;
  setIsLoginOpen: Dispatch<SetStateAction<boolean>>;
  isRegisterOpen: boolean;
  setIsRegisterOpen: Dispatch<SetStateAction<boolean>>;
}


const Header: React.FC<HeaderProps> = ({
  isLoginOpen,
  setIsLoginOpen,
  isRegisterOpen,
  setIsRegisterOpen,
}) => {
  const navigate = useNavigate();
  const { authUser } = useContext(AppContext) as {
    authUser: { uid: string } | null;
  };

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    if (authUser) {
      const unsubscribe = listenForNotifications(
        authUser.uid,
        setNotifications
      );

      return () => unsubscribe();
    }
  }, [authUser]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success('Logout successful', {
        autoClose: 1000,
      });
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container className="bg-gradient-to-r from-blue-400 to-teal-300 shadow-lg top-0 z-50 py-4 px-6 text-white">
      <header className="">
        <nav className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link
              to="/"
              className="flex items-center gap-2 text-2xl font-bold text-white hover:text-teal-700 transition-all"
            >
              <Calendar className="w-6 h-6" />
              Event Calendar
            </Link>

            {authUser && (
              <ul className="hidden md:flex space-x-6 text-white font-medium">
                <li>
                  <Link
                    to="/my-calendar"
                    className="hover:text-teal-700 transition"
                  >
                    My Calendar
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/user/${authUser.uid}`}
                    className="hover:text-teal-700 transition"
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/my-contacts/${authUser.uid}`}
                    className="hover:text-teal-700 transition"
                  >
                    Contacts
                  </Link>
                </li>
                <li>
                  <Link
                    to="/create-event"
                    className="hover:text-teal-700 transition"
                  >
                    Create Event
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin-board"
                    className="hover:text-teal-700 transition"
                  >
                    Admin Dashboard
                  </Link>
                </li>
              </ul>
            )}
          </div>

          <div className="flex items-center gap-6">
            {authUser ? (
              <>
                <UserSearch />

                {/* Иконка за нотификации */}
                <div className="relative">
                  <button onClick={() => setIsPopupOpen(!isPopupOpen)}>
                    <Bell className="w-6 h-6 cursor-pointer hover:text-yellow-300 transition" />
                    {notifications.length > 0 && (
                      <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded-full">
                        {notifications.length}
                      </span>
                    )}
                  </button>

                  {/* Pop-up за нотификациите */}
                  {isPopupOpen && (
                    <div className="absolute right-0 top-14 w-80 bg-white text-black shadow-xl rounded-lg p-5 z-50 border border-gray-200">
                      <h3 className="font-semibold text-lg mb-3 text-gray-900">
                        Notifications
                      </h3>

                      {notifications.length === 0 ? (
                        <p className="text-gray-500 text-sm text-center py-3">
                          No new notifications
                        </p>
                      ) : (
                        <ul className="space-y-2">
                          {notifications.map((notification) => (
                            <li
                              key={notification.id}
                              className="flex items-center gap-3 p-3 border-b last:border-none bg-gray-50 hover:bg-gray-100 transition rounded-lg"
                            >
                              {/* Профилна снимка */}
                              <img
                                src={
                                  notification.senderImage ||
                                  'https://via.placeholder.com/50'
                                }
                                alt="Profile"
                                className="w-10 h-10 rounded-full border border-gray-300 object-cover"
                              />

                              <div className="flex-1">
                                <p className="text-sm text-gray-900">
                                  {notification.message}
                                </p>

                                {/* Ако е покана за събитие, показваме инфото */}
                                {notification.type === 'event_invite' && (
                                  <p className="text-xs text-gray-500">
                                    {notification.eventTitle} ·{' '}
                                    {format(
                                      parseISO(notification.eventStart ?? ''),
                                      'MMM dd, HH:mm'
                                    )}
                                  </p>
                                )}
                              </div>

                              {/* Бутони за действие */}
                              {notification.type === 'friend_request' ? (
                                <div className="flex gap-1">
                                  <Button
                                    className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 rounded-md"
                                    onClick={() =>
                                      acceptFriendRequest(
                                        authUser.uid,
                                        notification.senderId ?? '',
                                        notification.id
                                      )
                                    }
                                  >
                                    ✔
                                  </Button>
                                  <Button
                                    className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded-md"
                                    onClick={() =>
                                      declineFriendRequest(
                                        authUser.uid,
                                        notification.senderId ?? '',
                                        notification.id
                                      )
                                    }
                                  >
                                    ✖
                                  </Button>
                                </div>
                              ) : notification.type === 'event_invite' ? (
                                <div className="flex gap-1">
                                  <Button
                                    className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 rounded-md"
                                    onClick={() =>
                                      acceptEventInvite(
                                        authUser.uid,
                                        notification.eventId ?? '',
                                        notification.id
                                      )
                                    }
                                  >
                                    ✔
                                  </Button>
                                  <Button
                                    className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded-md"
                                    onClick={() =>
                                      declineEventInvite(notification.id)
                                    }
                                  >
                                    ✖
                                  </Button>
                                </div>
                              ) : null}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleLogout}
                  className="bg-red-400 hover:bg-red-500 text-white"
                >
                  Logout
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => setIsLoginOpen(true)}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white"
                >
                  Sign in
                </Button>
                <Button
                  onClick={() => setIsRegisterOpen(true)}
                  className="bg-white text-gray-900 hover:bg-gray-200"
                >
                  Register
                </Button>
              </div>
            )}
          </div>
        </nav>
        {isLoginOpen && (
          <LoginModal
            isOpen={isLoginOpen}
            onClose={() => setIsLoginOpen(false)}
          />
        )}
        {isRegisterOpen && (
          <RegisterModal
            isOpen={isRegisterOpen}
            onClose={() => setIsRegisterOpen(false)}
          />
        )}
      </header>
    </Container>
  );
};

export default Header;
