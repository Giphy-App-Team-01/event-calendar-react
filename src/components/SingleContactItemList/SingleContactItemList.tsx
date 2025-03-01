import './SingleContactItemList.css';

interface Props {
  contact: {
    name: string;
    email: string;
    phone: string;
  };
}

const SingleContactItemList = ({ contact }: Props) => {
  return <div className='single-contact-item-list'>{contact.name}</div>;
};

export default SingleContactItemList;
