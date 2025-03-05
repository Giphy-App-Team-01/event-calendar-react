import React from "react";
import { Event } from "../../types/interfaces";
import SingleEventItemCard from "../SingleEventItemCard/SingleEventItemCard";

interface EventsListProps {
  events: Event[];
  className?: string;
  loading?: boolean;
  layout?: "grid" | "scroll"; // choose between grid and scroll
}

const EventsList: React.FC<EventsListProps> = ({ events, className, loading, layout = "grid" }) => {
  return (
    <div className="relative mt-6">
      <div
        className={`bg-gray-100 border border-gray-300 shadow-md rounded-lg p-4 ${
          layout === "scroll" ? "overflow-x-auto scrollbar-hide" : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        } ${className}`}
      >
        <div className={layout === "scroll" ? "flex gap-4 pr-3" : ""}>
          {events.length > 0 ? (
            events.map((event) => (
              <div key={event.id} className={layout === "scroll" ? "min-w-[300px]" : ""}>
                <SingleEventItemCard event={event} />
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-center w-full py-4">
              {loading ? "Loading..." : "No events to show"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsList;
