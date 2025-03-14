import {
  format,
  startOfDay,
  endOfDay,
  eachHourOfInterval,
  differenceInMinutes,
} from 'date-fns';
import { computeEffectiveTimes, occursOnDay } from '../../utils/calendarHelpers';
import { Event } from '../../types/interfaces';
import { useNavigate } from 'react-router-dom';


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
  const navigate = useNavigate();

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
            const { effectiveStart, effectiveEnd } = computeEffectiveTimes(
              event,
              currentDate
            );
            const durationMinutes = differenceInMinutes(effectiveEnd, effectiveStart);
            return (
              <div
                key={idx}
                className="absolute left-16 right-4 bg-blue-500 text-white rounded p-1 text-xs shadow-xl ring-1 ring-white cursor-pointer"
                style={{
                  top: `${
                    ((effectiveStart.getHours() * 60 + effectiveStart.getMinutes()) / 1440) *
                    100
                  }%`,
                  height: `${(durationMinutes / 1440) * 100}%`,
                  minHeight: '30px',
                  zIndex: idx + 1,
                }}
                onClick={() => navigate(`/event/${event.eventId}`)}
              >
                <div className="truncate">{event.title}</div>
                <div className="text-[0.7em]">
                  {format(effectiveStart, 'HH:mm')} - {format(effectiveEnd, 'HH:mm')}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default DayView;
