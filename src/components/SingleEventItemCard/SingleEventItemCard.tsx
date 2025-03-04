import React from "react";
import "./SingleEventItemCard.css";

interface EventProps {
  event: {
    title: string;
    start: string;
    end: string;
    location: string;
    image?: string;
  };
} 

const SingleEventItemCard: React.FC<EventProps> = ({ event }) => {
  return (
    <div className="single-event-item-card bg-white shadow-md rounded-lg overflow-hidden">
      {event.image && (
        <img src={event.image} alt={event.title} className="w-full h-32 object-cover" />
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
        <p className="text-gray-700">🕒 {event.start} - {event.end}</p>
        <p className="text-gray-700">📍 {event.location}</p>
      </div>
    </div>
  );
};

export default SingleEventItemCard;
