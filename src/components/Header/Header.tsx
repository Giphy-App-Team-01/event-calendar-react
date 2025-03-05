import { Link, useNavigate } from 'react-router-dom';
import Button from '../Button/Button';
import { useContext, Dispatch, SetStateAction } from 'react';
import LoginModal from '../../views/LoginModal/LoginModal';
import RegisterModal from '../../views/RegisterModal/RegisterModal';
import { logoutUser } from '../../services/auth-service';
import { AppContext } from '../../context/app.context';
import { toast } from 'react-toastify';
import Container from '../Container/Container';
import UserSearch from '../UserSearch/UserSearch';
import { Calendar } from 'lucide-react';
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
