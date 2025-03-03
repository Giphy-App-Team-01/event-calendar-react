import { useEffect, useState } from 'react';
import { format, addDays, addWeeks, addMonths } from 'date-fns';
import { mockEvents } from './mockEvents';
import Button from '../../components/Button/Button';
import MonthView from '../MonthView/MonthView';
import WeekView from '../WeekView/WeekView';
import WorkWeekView from '../WorkWeekView/WorkWeekView';
import DayView from '../DayView/DayView';


export interface Event {
  id: string;
  title: string;
  start: string;
  end: string;
  recurrence?: 'daily' | 'weekly' | 'monthly';
}
const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

  const handleNavigateToDay = (day: Date) => {
    setCurrentDate(day);
    setView('day');
  };

  useEffect(() => {
    setFilteredEvents(mockEvents);
  }, [currentDate, view]);

  const handleNext = () => {
    setCurrentDate((prev) =>
      view === 'month'
        ? addMonths(prev, 1)
        : view === 'week' || view === 'work-week'
        ? addWeeks(prev, 1)
        : addDays(prev, 1)
    );
  };

  const handlePrev = () => {
    setCurrentDate((prev) =>
      view === 'month'
        ? addMonths(prev, -1)
        : view === 'week' || view === 'work-week'
        ? addWeeks(prev, -1)
        : addDays(prev, -1)
    );
  };

  const buttonClass =
    'px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 rounded transition-colors cursor-pointer';

  return (
    <div className='min-h-screen'>
    <div className="p-6 max-w-5xl mx-auto bg-gradient-to-b from-gray-50 to-gray-100 shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <Button
          className={
            'px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors'
          }
          onClick={handlePrev}
        >
          ❮
        </Button>
        <h2 className="text-2xl font-bold text-gray-800">
          {format(currentDate, 'MMMM yyyy')}
        </h2>

        <Button
          className={
            'px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors'
          }
          onClick={handleNext}
        >
          ❯
        </Button>
      </div>

      <div className="flex gap-2 mb-4">
        <Button className={buttonClass} onClick={() => setView('month')}>
          Month
        </Button>
        <Button className={buttonClass} onClick={() => setView('week')}>
          Week
        </Button>
        <Button className={buttonClass} onClick={() => setView('work-week')}>
          Work week
        </Button>
        <Button className={buttonClass} onClick={() => setView('day')}>
          Day
        </Button>
      </div>

      {view === 'month' && (
        <MonthView
          currentDate={currentDate}
          events={filteredEvents}
          handleNavigateToDay={handleNavigateToDay}
        />
      )}
      {view === 'week' && (
        <WeekView
          currentDate={currentDate}
          events={filteredEvents}
          handleNavigateToDay={handleNavigateToDay}
        />
      )}
      {view === 'work-week' && (
        <WorkWeekView
          currentDate={currentDate}
          events={filteredEvents}
          handleNavigateToDay={handleNavigateToDay}
        />
      )}
      {view === 'day' && (
        <DayView currentDate={currentDate} events={filteredEvents} />
      )}
    </div>
    </div>
  );
};

export default Calendar;
