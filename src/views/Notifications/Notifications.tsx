import { useEffect, useState, useContext } from 'react';
import { Bell, CheckCircle, XCircle } from 'lucide-react';
import {
  acceptEventInvite,
  acceptFriendRequest,
  declineEventInvite,
  declineFriendRequest,
  listenForNotifications,
} from '../../services/db-service';
import { format, parseISO } from 'date-fns';
import { Notification } from '../../types/interfaces';
import { AppContext } from '../../context/app.context';
import Button from '../../components/Button/Button';

const Notifications = () => {
  const { authUser } = useContext(AppContext) as {
    authUser: { uid: string } | null;
  };

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    if (authUser) {
      const unsubscribe = listenForNotifications(authUser.uid, setNotifications);
      return () => unsubscribe();
    }
  }, [authUser]);

  return (
    <div className="relative">
      <button onClick={() => setIsPopupOpen(!isPopupOpen)} className="relative">
        <Bell className="w-7 h-7 cursor-pointer hover:text-yellow-300 transition" />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
            {notifications.length}
          </span>
        )}
      </button>

      {isPopupOpen && (
        <div className="absolute right-0 top-12 w-96 bg-white text-black shadow-xl rounded-lg p-6 z-50 border border-gray-200">
          <h3 className="font-semibold text-lg mb-4 text-gray-900">Notifications</h3>

          {notifications.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-3">No new notifications</p>
          ) : (
            <ul className="space-y-3">
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  className="flex items-center gap-4 p-4 border-b last:border-none bg-gray-50 hover:bg-gray-100 transition rounded-lg"
                >
                  {/* Профилна снимка */}
                  <img
                    src={notification.senderImage || "https://via.placeholder.com/50"}
                    alt="Profile"
                    className="w-12 h-12 rounded-full border border-gray-300 object-cover"
                  />

                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{notification.message}</p>

                    {/* Ако е покана за събитие, показваме инфото */}
                    {notification.type === 'event_invite' && (
                      <p className="text-xs text-gray-600">
                        {notification.eventTitle} ·{' '}
                        {format(parseISO(notification.eventStart ?? ''), 'MMM dd, HH:mm')}
                      </p>
                    )}
                  </div>

                  {/* Бутони за действие */}
                  {notification.type === 'friend_request' ? (
                    <div className="flex gap-2">
                      <Button
                        className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-2 rounded-md flex items-center gap-1"
                        onClick={() => acceptFriendRequest(authUser!.uid, notification.senderId ?? '', notification.id)}
                      >
                        <CheckCircle className="w-4 h-4 text-white" />
                      </Button>
                      <Button
                        className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-2 rounded-md flex items-center gap-1"
                        onClick={() => declineFriendRequest(authUser!.uid, notification.senderId ?? '', notification.id)}
                      >
                        <XCircle className="w-4 h-4 text-white" />
                      </Button>
                    </div>
                  ) : notification.type === 'event_invite' ? (
                    <div className="flex gap-2">
                      <Button
                        className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-2 rounded-md flex items-center gap-1"
                        onClick={() => acceptEventInvite(authUser!.uid, notification.eventId ?? '', notification.id)}
                      >
                        <CheckCircle className="w-4 h-4 text-white" />
                      </Button>
                      <Button
                        className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-2 rounded-md flex items-center gap-1"
                        onClick={() => declineEventInvite(notification.id)}
                      >
                        <XCircle className="w-4 h-4 text-white" />
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
  );
};

export default Notifications;
