import React from 'react';
import './SingleEventItemCard.css';
import { Clock, Pin } from 'lucide-react';

interface EventProps {
  event: {
    title: string;
    start: string;
    end: string;
    location: string;
    image?: string;
  };
  className?: string;
}

const SingleEventItemCard: React.FC<EventProps> = ({ event, className }) => {
  return (
    <div
      className={
        className +
        'single-event-item-card bg-white shadow-md rounded-lg overflow-hidden'
      }
    >
      {event.image && (
        <img
          src={event.image}
          alt={event.title}
          className='w-full h-32 object-cover'
        />
      )}
      <div className='p-4'>
        <h3 className='single-event-title text-lg font-semibold text-gray-900 mb-3 leading-tight break-words'>
          {event.title}
        </h3>

        <div className='info-box__single-event flex items-center gap-2 text-gray-700 leading-tight'>
          <Clock size={16} className='mt-[2px] text-cyan-600' />
          {event.start} - {event.end}
        </div>

        <div className='info-box__single-event flex items-center gap-2 text-gray-700 leading-tight mt-2'>
          <Pin size={16} className='mt-[2px] text-cyan-600' />
          {event.location}
        </div>
      </div>
    </div>
  );
};

export default SingleEventItemCard;
