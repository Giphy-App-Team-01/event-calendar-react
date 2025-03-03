import {
  format,
  addDays,
  startOfWeek,
  isSameDay,
  startOfDay,
  endOfDay,
} from 'date-fns';
import { getOccurrenceStart, occursOnDay } from '../../utils/calendarHelpers';
import { Event } from '../../views/MyCalendar/MyCalendar';

const WeekView = ({
  currentDate,
  events,
  handleNavigateToDay,
}: {
  currentDate: Date;
  events: Event[];
  handleNavigateToDay: (day: Date) => void;
}) => {
  const start = addDays(startOfWeek(currentDate, { weekStartsOn: 1 }), 0);
  const days = [...Array(7)].map((_, i) => addDays(start, i));

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 mb-1 text-center font-bold text-white bg-gradient-to-r from-indigo-500 to-cyan-500 p-2 rounded">
        {days.map((day, index) => (
          <div key={index} className="p-2">
            {format(day, 'EEEE d')}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const dayStart = startOfDay(day);
          const dayEnd = endOfDay(day);
          const dayEvents = events.filter((event) => occursOnDay(event, day));
          return (
            <div
              key={index}
              onClick={() => handleNavigateToDay(day)}
              className="cursor-pointer p-2 border h-32 overflow-auto relative bg-gray-200 rounded shadow-sm"
            >
              {dayEvents.map((event, idx) => {
                const originalStart = new Date(event.start);
                const originalEnd = new Date(event.end);
                const duration =
                  originalEnd.getTime() - originalStart.getTime();
                const occurrenceStart = event.recurrence
                  ? getOccurrenceStart(event, day)
                  : originalStart;
                const occurrenceEnd = new Date(
                  occurrenceStart.getTime() + duration
                );
                const startTime =
                  occurrenceStart < dayStart ? dayStart : occurrenceStart;
                const endTime = occurrenceEnd > dayEnd ? dayEnd : occurrenceEnd;
                return (
                  <div
                    key={idx}
                    className="bg-blue-600 text-white font-semibold rounded p-1 mt-1 text-sm truncate"
                  >
                    {event.title} ({format(startTime, 'HH:mm')} -{' '}
                    {format(endTime, 'HH:mm')})
                    {!isSameDay(originalStart, originalEnd) && ' (continued)'}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeekView;
