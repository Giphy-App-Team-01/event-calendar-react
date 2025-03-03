import {
  format,
  isSameDay,
  startOfDay,
  endOfDay,
  eachHourOfInterval,
  differenceInMinutes,
} from 'date-fns';
import { getOccurrenceStart, occursOnDay } from '../../utils/calendarHelpers';
import { Event } from '../../views/MyCalendar/MyCalendar';

const DayView = ({
  currentDate,
  events,
}: {
  currentDate: Date;
  events: Event[];
}) => {
  const dayStart = startOfDay(currentDate);
  const dayEnd = endOfDay(currentDate);
  const hours = eachHourOfInterval({ start: dayStart, end: dayEnd });

  return (
    <div className="border rounded-lg shadow-lg overflow-hidden bg-white">
      <div className="bg-gray-200 text-black text-center py-3 font-medium mb-1.5">
        {format(currentDate, 'EEEE, d MMMM yyyy')}
      </div>
      <div className="relative" style={{ height: '1440px' }}>
        <div className="absolute inset-0 grid grid-rows-24">
          {hours.map((hour, index) => (
            <div key={index} className="border-t relative">
              <span className="absolute left-2 top-1 text-xs text-gray-800">
                {format(hour, 'HH:mm')}
              </span>
            </div>
          ))}
        </div>
        {events
          .filter((event) => occursOnDay(event, currentDate))
          .map((event, idx) => {
            const originalStart = new Date(event.start);
            const originalEnd = new Date(event.end);
            const duration = originalEnd.getTime() - originalStart.getTime();
            const occurrenceStart = event.recurrence
              ? getOccurrenceStart(event, currentDate)
              : originalStart;
            const occurrenceEnd = new Date(
              occurrenceStart.getTime() + duration
            );
            const startTime =
              occurrenceStart < dayStart ? dayStart : occurrenceStart;
            const endTime = occurrenceEnd > dayEnd ? dayEnd : occurrenceEnd;
            const startMinutes =
              startTime.getHours() * 60 + startTime.getMinutes();
            const durationMinutes = differenceInMinutes(endTime, startTime);
            const topOffset = (startMinutes / 1440) * 100;
            const eventHeight = (durationMinutes / 1440) * 100;
            return (
              <div
                key={idx}
                className="absolute left-16 right-4 bg-blue-500 text-white rounded p-1 text-xs 
               shadow-xl ring-1 ring-white"
                style={{
                  top: `${topOffset}%`,
                  height: `${eventHeight}%`,
                  minHeight: '30px',
                  zIndex: idx + 1,
                }}
                onClick={() => console.log(event)}
              >
                <div className="truncate">{event.title}</div>
                <div className="text-[0.7em]">
                  {format(startTime, 'HH:mm')} - {format(endTime, 'HH:mm')}
                  {!isSameDay(originalStart, originalEnd) && ' (cont.)'}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};


export default DayView;