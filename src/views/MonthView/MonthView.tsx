
import {
  format,
  addDays,
  startOfMonth,
  getDaysInMonth,
  getDay,
} from 'date-fns';
import { occursOnDay } from '../../utils/calendarHelpers';
import { Event } from '../../types/interfaces';


const MonthView = ({
  currentDate,
  events,
  handleNavigateToDay,
}: {
  currentDate: Date;
  events: Event[];
  handleNavigateToDay: (day: Date) => void;
}) => {
  const daysInMonth = getDaysInMonth(currentDate);
  const startDay = getDay(startOfMonth(currentDate));
  const days = [...Array(daysInMonth)].map((_, i) =>
    addDays(startOfMonth(currentDate), i)
  );
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 mb-1 text-center font-bold text-white bg-gradient-to-r from-indigo-500 to-cyan-500 p-2 rounded">
        {weekDays.map((day, index) => (
          <div key={index} className="p-2">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {[...Array(startDay)].map((_, i) => (
          <div
            key={i}
            className="p-2 border h-32 bg-gray-400 text-white rounded"
          ></div>
        ))}
        {days.map((day, index) => (
          <div
            key={index}
            onClick={() => handleNavigateToDay(day)}
            className="cursor-pointer p-2 border h-32 overflow-hidden relative bg-gray-200 rounded shadow-sm hover:shadow-md transition-shadow"
          >
            <span className="font-bold text-gray-800">{format(day, 'd')}</span>
            <div className="absolute top-6 left-0 w-full overflow-auto max-h-20 mt-1.5">
              {events
                .filter((event) => occursOnDay(event, day))
                .map((event, idx) => (
                  <div
                    key={idx}
                    className="bg-blue-600 text-white font-semibold rounded p-1 mt-1 text-sm truncate w-5/6 mx-auto"
                  >
                    {event.title}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthView;
