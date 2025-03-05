import SingleEventItemCard from '../SingleEventItemCard/SingleEventItemCard';
interface EventsGridProps {
  events: Event[];
  className: string;
}

const EventsGrid: React.FC<EventsGridProps> = ({ events, className }) => {
  return (
    <div className={'events-grid grid ' + className}>
      {events.map((event) => (
        <SingleEventItemCard key={event.id} event={event} />
      ))}
    </div>
  );
};

export default EventsGrid;
