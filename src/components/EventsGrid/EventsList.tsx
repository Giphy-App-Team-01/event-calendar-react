import React from 'react';
import { Event } from '../../types/interfaces';
import SingleEventItemCard from '../SingleEventItemCard/SingleEventItemCard';
import { CalendarOff } from 'lucide-react';

interface EventsListProps {
  events: Event[];
  className?: string;
  loading?: boolean;
  layout?: 'grid' | 'scroll';
}
const EventsList: React.FC<EventsListProps> = ({
  events,
  className,
  layout = 'grid',
}) => {
  return (
    <div className='relative mt-6'>
      <div
        className={`bg-gray-100 border border-gray-300 rounded-lg p-4 min-h-[300px] ${
          layout === 'scroll'
            ? 'overflow-x-auto scrollbar-hide'
            : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
        } ${className}`}
      >
        {events.length > 0 ? (
          layout === 'scroll' ? (
            <div className='flex gap-4 pr-3'>
              {events.map((event) => (
                <div key={event.id} className='min-w-[300px]'>
                  <SingleEventItemCard event={event} />
                </div>
              ))}
            </div>
          ) : (
            events.map((event) => (
              <div key={event.id}>
                <SingleEventItemCard event={event} />
              </div>
            ))
          )
        ) : (
          <div className='flex flex-col items-center justify-center w-full min-h-[300px]'>
            <CalendarOff className='w-12 h-12 text-gray-500 mb-4' />
            <p className='text-xl font-semibold text-gray-600'>
              No events to show
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsList;
