import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import defaultAvatar from '../../assets/images/default-avatar.jpg';
import {
  getUserById,
  getUserEventsByProfile,
  getEventInvitesById,
  updateUserProfile,
  toggleUserAdminStatus,
  toggleUserBlockStatus,
  sendFriendRequest,
} from '../../services/db-service';
import Button from '../../components/Button/Button';
import { uploadImageToCloudinary } from '../../services/upload-service';
import { AppContext } from '../../context/app.context';
import { toast } from 'react-toastify';
import { databaseUser, Event, AppContextType } from '../../types/interfaces';
import EventsList from '../../components/EventsGrid/EventsList';
import {
  CalendarCheck,
  CalendarX,
  Hourglass,
  UserCheck,
  UserPlus,
} from 'lucide-react';

const Profile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { authUser, dbUser } = useContext(AppContext) as AppContextType;
  const [user, setUser] = useState<databaseUser | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);
  const [profilePic, setProfilePic] = useState<string>(defaultAvatar);
  const [isFriendRequestSent, setIsFriendRequestSent] =
    useState<boolean>(false);
  const [isFriend, setIsFriend] = useState<boolean>(false);

  const [formData, setFormData] = useState<
    Omit<databaseUser, 'uid' | 'isAdmin' | 'isBlocked'>
  >({
    firstName: '',
    lastName: '',
    username: '',
    phoneNumber: '',
    address: '',
    email: '',
    image: '',
    allowEventInvites: false,
  });

  const [activeTab, setActiveTab] = useState<'myEvents' | 'invitedEvents'>(
    'myEvents'
  );
  const [events, setEvents] = useState<Event[]>([]);
  const [invitedEvents, setInvitedEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;

      setIsFriend(false);
      setIsFriendRequestSent(false);

      const userData = await getUserById(id);
      if (userData) {
        setUser(userData);
        setProfilePic(userData.image || defaultAvatar);
        setFormData({
          firstName: userData.firstName,
          lastName: userData.lastName,
          username: userData.username,
          phoneNumber: userData.phoneNumber,
          address: userData.address,
          email: userData.email,
          image: userData.image,
          allowEventInvites: userData.allowEventInvites,
        });
      }

      if (authUser?.uid && userData && userData.contacts?.[authUser.uid]) {
        setIsFriend(true);
      }

      if (authUser?.uid && userData && userData.friendRequests?.received?.[authUser.uid]) {
        setIsFriendRequestSent(true);
      }
    };

    fetchUser();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const fetchAllEvents = async () => {
      try {
        const userEvents = await getUserEventsByProfile(id);
        setEvents(userEvents || []);

        if (authUser?.uid === id) {
          const invitedEventsData = await getEventInvitesById(id);
          setInvitedEvents(invitedEventsData || []);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchAllEvents();
  }, [id, authUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendFriendRequest = async () => {
    if (!authUser || !user) return;

    try {
      await sendFriendRequest(authUser.uid, user.uid);
      setIsFriendRequestSent(true);
      toast.success('Friend request sent!');
    } catch (error) {
      toast.error('Failed to send friend request.');
      console.error('Error sending friend request:', error);
    }
  };

  const handleProfilePicChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      const uploadedImageUrl = await uploadImageToCloudinary(e.target.files[0]);
      if (uploadedImageUrl) {
        setProfilePic(uploadedImageUrl);
      }
      setIsUploading(false);
    }
  };

  const handleToggleInvites = () => {
    setFormData((prev) => ({
      ...prev,
      allowEventInvites: !prev.allowEventInvites,
    }));
  };

  const handleEdit = () => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        allowEventInvites: user.allowEventInvites,
      }));
    }
    setEditing(true);
  };

  const handleSave = async () => {
    if (!user) return;

    const updatedData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      phoneNumber: formData.phoneNumber,
      address: formData.address,
      image: profilePic,
      allowEventInvites: formData.allowEventInvites,
    };

    const result = await updateUserProfile(user.uid, updatedData);
    if (result.success) {
      setUser((prevUser) =>
        prevUser ? { ...prevUser, ...updatedData } : null
      );

      setEditing(false);
      toast.success('Profile updated successfully!');
    } else {
      toast.error('Failed to update profile.');
    }
  };

  const handleToggleAdmin = async () => {
    if (!user) return;

    const result = await toggleUserAdminStatus(user.uid);
    if (result.success) {
      setUser((prevUser) =>
        prevUser ? { ...prevUser, isAdmin: !prevUser.isAdmin } : null
      );
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const handleToggleBlock = async () => {
    if (!user) return;

    const result = await toggleUserBlockStatus(user.uid);
    if (result.success) {
      setUser((prevUser) =>
        prevUser
          ? { ...prevUser, isBlocked: prevUser.isBlocked ? false : true }
          : null
      );
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-2xl rounded-lg mt-8 relative border border-gray-200">
        {authUser?.uid !== id && dbUser?.isAdmin && (
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              className="bg-red-500 text-white px-3 py-1 rounded-md text-sm cursor-pointer"
              onClick={handleToggleBlock}
            >
              {user?.isBlocked ? 'Unblock' : 'Block'}
            </Button>
            <Button
              className="bg-yellow-500 text-white px-3 py-1 rounded-md text-sm cursor-pointer"
              onClick={handleToggleAdmin}
            >
              {user?.isAdmin ? 'Remove Admin' : 'Make Admin'}
            </Button>
          </div>
        )}

        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24 rounded-full border border-gray-300 overflow-hidden group">
            <img
              src={profilePic}
              alt="Profile"
              className="w-full h-full object-cover"
            />
            {authUser?.uid === id && editing && (
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <span className="text-white text-sm">
                  {isUploading ? '🔄 Loading...' : '📷 Change'}
                </span>
              </div>
            )}
            {authUser?.uid === id && editing && (
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleProfilePicChange}
              />
            )}
          </div>

          <div>
            <p className="text-lg font-semibold text-gray-900">
              @{formData.username}
            </p>
            {editing ? (
              <div className="flex flex-col space-y-2">
                {(
                  ['firstName', 'lastName', 'phoneNumber', 'address'] as Array<
                    keyof databaseUser
                  >
                ).map((field) => (
                  <input
                    key={field}
                    type="text"
                    name={field}
                    value={String(
                      formData[field as keyof typeof formData] ?? ''
                    )}
                    onChange={handleInputChange}
                    className="border border-gray-300 px-3 py-1 rounded-md w-45 bg-gray-100 text-gray-900 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                ))}

                <div className="flex items-center gap-4 mt-4">
                  <span
                    className={`font-medium transition-colors ${
                      formData.allowEventInvites
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {formData.allowEventInvites
                      ? 'Invites Enabled'
                      : 'Invites Disabled'}
                  </span>

                  <label className="cursor-pointer">
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={formData.allowEventInvites}
                      onChange={handleToggleInvites}
                    />
                    <div
                      className={`w-14 h-7 flex items-center rounded-full p-1 transition-all duration-300 ${
                        formData.allowEventInvites
                          ? 'bg-green-500'
                          : 'bg-red-500'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-all duration-300 ${
                          formData.allowEventInvites
                            ? 'translate-x-7'
                            : 'translate-x-0'
                        }`}
                      ></div>
                    </div>
                  </label>
                </div>
              </div>
            ) : (
              <>
                <p className="text-gray-800 font-medium leading-tight">
                  {formData.firstName} {formData.lastName}
                </p>
                <p className="text-gray-700 leading-tight">{formData.phoneNumber}</p>
                <p className="text-gray-700 leading-tight">{formData.address}</p>
            
                {/* Статус за покани за събития */}
                {user?.allowEventInvites ? (
                  <p className="text-blue-700 font-medium flex items-center gap-2 leading-tight">
                    <CalendarCheck className="w-5 h-5 text-blue-700" />
                    <span>Accepting event invites</span>
                  </p>
                ) : (
                  <p className="text-red-700 font-medium flex items-center gap-2 leading-tight">
                    <CalendarX className="w-5 h-5 text-red-700" />
                    <span>Not accepting event invites</span>
                  </p>
                )}
            
                {/* Бутон за приятелство */}
                {authUser?.uid !== id && (
                  <div className="mt-2">
                    {isFriend ? (
                      <p className="text-green-700 font-medium flex items-center gap-2 leading-tight">
                        <UserCheck className="w-5 h-5 text-green-700" />
                        <span>You are friends</span>
                      </p>
                    ) : isFriendRequestSent ? (
                      <p className="text-gray-700 font-medium flex items-center gap-2 leading-tight">
                        <Hourglass className="w-5 h-5 text-gray-500" />
                        <span>Friend request pending...</span>
                      </p>
                    ) : (
                      <Button
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2 justify-center shadow-md"
                        onClick={handleSendFriendRequest}
                      >
                        <UserPlus className="w-5 h-5 text-white" />
                        Add to Contacts
                      </Button>
                    )}
                  </div>
                )}
              </>
            )
            }
          </div>
        </div>

        {authUser?.uid === id &&
          (editing ? (
            <div className="flex gap-1 mt-4">
              <Button
                className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer"
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                className="bg-red-500 text-white px-4 py-2 rounded-md cursor-pointer"
                onClick={() => setEditing(false)}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              className="bg-gray-400 px-4 py-2 rounded-md mt-4 text-white cursor-pointer"
              onClick={handleEdit}
            >
              Edit Profile
            </Button>
          ))}

        <div className="flex justify-center gap-4 mt-6">
          {authUser?.uid === id ? (
            <Button
              className={`px-4 py-2 rounded-md transition-all cursor-pointer ${
                activeTab === 'myEvents'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-400 text-white hover:bg-gray-500'
              }`}
              onClick={() => setActiveTab('myEvents')}
            >
              Events by Me
            </Button>
          ) : (
            <Button className="px-4 py-2 rounded-md bg-blue-500 text-white">
              Public Events
            </Button>
          )}

          {authUser?.uid === id && (
            <Button
              className={`px-4 py-2 rounded-md transition-all ${
                activeTab === 'invitedEvents'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-400 text-white hover:bg-gray-500'
              } cursor-pointer`}
              onClick={() => setActiveTab('invitedEvents')}
            >
              Events I'm Invited To
            </Button>
          )}
        </div>

        <EventsList
          events={activeTab === 'myEvents' ? events : invitedEvents}
          layout="scroll"
          className="pr-3"
        />
      </div>
    </div>
  );
};

export default Profile;
