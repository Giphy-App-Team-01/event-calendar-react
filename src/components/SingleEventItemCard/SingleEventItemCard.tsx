import './SingleEventItemCard.css';

interface Props {
  event: {
    name: string;
    date: string;
    time: string;
    location: string;
  };
}

const SingleEventItemCard = ({ event }: Props) => {
  return (
    <div className='single-event-item-card'>
      <h1>{event.name}</h1>
      <div className='single-event-item-card__info'>
        <p>{event.date}</p>
        <p>{event.time}</p>
        <p>{event.location}</p>
      </div>
    </div>
  );
};

export default SingleEventItemCard;
