import Button from '../../components/Button/Button';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import calendarHome from '../../assets/images/calendar-home.jpeg';
import { getAllPublicEvents } from '../../services/db-service';
import { Event } from '../../types/interfaces';
interface HeaderProps {
  setIsLoginOpen: Dispatch<SetStateAction<boolean>>;
  setIsRegisterOpen: Dispatch<SetStateAction<boolean>>;
}
const LandingPage: React.FC<HeaderProps> = ({
  setIsLoginOpen,
  setIsRegisterOpen,
}) => {
  const [publicEvents, setPublicEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchPublicEvents = async () => {
      try {
        const data = await getAllPublicEvents() as Event[];
        setPublicEvents(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchPublicEvents();
  }, []);
  return (
    <div className='LandingPage flex items-center gap-10'>
      <div className='text-box w-1/2'>
        <h1 className='text-4xl font-bold text-gray-950 mb-3'>
          Shareable Online Calendar
        </h1>
        <div className='text-lg text-gray-950'>
          Spend less time planning and more time doing with a shareable calendar
          that works across your workspace.
        </div>
        <div className='flex items-center gap-4 mt-6'>
          <Button
            onClick={() => setIsLoginOpen(true)}
            className='bg-cyan-500 hover:bg-cyan-600 text-white transition'
          >
            Sign in
          </Button>
          <Button
            onClick={() => setIsRegisterOpen(true)}
            className='bg-white text-gray-900 hover:bg-gray-200'
          >
            Register
          </Button>
        </div>
      </div>
      <div className='img-box w-1/2'>
        <img src={calendarHome} alt='' />
      </div>

      <div className='public-events'>
        {publicEvents &&
          publicEvents.map((event) => (
            <div key={event.id}>
              <h2>{event.title}</h2>
              <p>{event.start}</p>
              <p>{event.end}</p>
              <p>{event.location}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default LandingPage;
