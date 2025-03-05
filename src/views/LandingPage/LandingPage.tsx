import Button from '../../components/Button/Button';
import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import calendarHome from '../../assets/images/calendar-home.jpeg';
import { getAllPublicEvents } from '../../services/db-service';
import SearchBar from '../../components/SearchBar/SearchBar';
import { Event } from '../../types/interfaces';
import EventsList from '../../components/EventsGrid/EventsList';
import { AppContext} from '../../context/app.context';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  setIsLoginOpen: Dispatch<SetStateAction<boolean>>;
  setIsRegisterOpen: Dispatch<SetStateAction<boolean>>;
}

const LandingPage: React.FC<HeaderProps> = ({
  setIsLoginOpen,
  setIsRegisterOpen,
}) => {
  const [publicEvents, setPublicEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const {authUser} = useContext(AppContext);
  const navigation = useNavigate();

  useEffect(() => {
    const fetchPublicEvents = async () => {
      try {
        const data = (await getAllPublicEvents()) as Event[];
        setPublicEvents(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchPublicEvents();
  }, []);

  const filteredEvents = publicEvents.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="hero flex items-center gap-10">
        <div className="text-box w-1/2">
          <h1 className="text-4xl font-bold text-gray-950 mb-3">
            Shareable Online Calendar
          </h1>
          <div className="text-lg text-gray-950">
            Spend less time planning and more time doing with a shareable
            calendar that works across your workspace.
          </div>
          <div className="flex items-center gap-4 mt-6">
            {authUser ? (
              <Button
              onClick={() => navigation('/my-calendar')}
              className="bg-cyan-500 hover:bg-cyan-600 text-white transition"
              >
              Go To Calendar
              </Button>
            ) : (
              <>
              <Button
                onClick={() => setIsLoginOpen(true)}
                className="bg-cyan-500 hover:bg-cyan-600 text-white transition"
              >
                Sign in
              </Button>
              <Button
                onClick={() => setIsRegisterOpen(true)}
                className="bg-white text-gray-900 hover:bg-gray-200"
              >
                Register
              </Button>
              </>
            )}
          </div>
        </div>
        <div className="img-box w-1/2">
          <img src={calendarHome} alt="" />
        </div>
      </div>

      <div className="public-events mt-10">
        <h2 className="text-4xl font-bold text-gray-950 mb-6 text-center">
          Public Events
        </h2>

        <div className="max-w-100 mx-auto mb-6">
          <SearchBar
            searchTerm={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search events..."
          />
        </div>
        <EventsList events={filteredEvents} layout="scroll" className="pr-3" />
      </div>
    </>
  );
};

export default LandingPage;
