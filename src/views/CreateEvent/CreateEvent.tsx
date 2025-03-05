import { useState } from 'react';
import {
  Calendar,
  MapPin,
  Users,
  Globe,
  Lock,
  Image,
  Repeat,
  FileText,
} from 'lucide-react';
import Button from '../../components/Button/Button';

const CreateEvent: React.FC = () => {
  const [eventData, setEventData] = useState({
    eventName: '',
    coverImage: null,
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    recurring: 'No recurring',
    location: '',
    description: '',
    guests: '',
    isPublic: true,
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setEventData((prev) => ({
      ...prev,
      [name]: type === 'file' ? e.target.files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Event Created:', eventData);
    // Handle event creation logic (e.g., API call)
  };

  const inputClasses =
    'input input-bordered w-full py-4 px-5 rounded-lg focus:ring-2 focus:ring-blue-300 bg-white text-gray-900 border-gray-300 z-10';
  const textareaClasses =
    'textarea textarea-bordered w-full py-4 px-5 rounded-lg focus:ring-2 focus:ring-blue-300 bg-white text-gray-900 border-gray-300 z-10';
  return (
    <div className='CreateEvent max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg'>
      <h1 className='text-3xl font-bold text-gray-900 mb-6'>Create an Event</h1>

      <form onSubmit={handleSubmit} className='space-y-4'>
        {/* Event Name */}
        <div>
          <label className='label font-medium text-blue-950 mb-2'>
            Event Name
          </label>
          <div className='relative'>
            <Calendar
              className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500'
              size={18}
            />
            <input
              type='text'
              name='eventName'
              value={eventData.eventName}
              onChange={handleChange}
              placeholder='Enter event name'
              className={`${inputClasses} pl-10`}
              required
            />
          </div>
        </div>

        {/* Cover Image */}
        <div>
          <label className='label font-medium text-blue-950 mb-2'>
            Cover Image
          </label>
          <div className='relative'>
            <Image className='absolute left-3 top-3 text-gray-500' size={18} />
            <input
              type='file'
              name='coverImage'
              accept='image/*'
              onChange={handleChange}
              className='file-input file-input-bordered w-full pl-10'
            />
          </div>
        </div>

        {/* Start & End Date/Time */}
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='label font-medium text-blue-950 mb-2'>
              Start Date
            </label>
            <Calendar
              className='absolute left-3 top-3 text-gray-500'
              size={18}
            />
            <input
              type='date'
              name='startDate'
              value={eventData.startDate}
              onChange={handleChange}
              className={inputClasses}
              required
            />
          </div>
          <div>
            <label className='label font-medium text-blue-950 mb-2'>
              Start Time
            </label>
            <input
              type='time'
              name='startTime'
              value={eventData.startTime}
              onChange={handleChange}
              className={inputClasses}
              required
            />
          </div>
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='label font-medium text-blue-950 mb-2'>
              End Date
            </label>
            <input
              type='date'
              name='endDate'
              value={eventData.endDate}
              onChange={handleChange}
              className={inputClasses}
              required
            />
          </div>
          <div>
            <label className='label font-medium text-blue-950 mb-2'>
              End Time
            </label>
            <input
              type='time'
              name='endTime'
              value={eventData.endTime}
              onChange={handleChange}
              className={inputClasses}
              required
            />
          </div>
        </div>

        {/* Recurring Dropdown */}
        <div>
          <label className='label font-medium text-blue-950 mb-2'>
            Recurring
          </label>
          <div className='relative'>
            <Repeat className='absolute left-3 top-3 text-gray-500' size={18} />
            <select
              name='recurring'
              value={eventData.recurring}
              onChange={handleChange}
              className={inputClasses}
            >
              <option>No recurring</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>
        </div>

        {/* Location */}
        <div>
          <label className='label font-medium text-blue-950 mb-2'>
            Location
          </label>
          <div className='relative'>
            <MapPin className='absolute left-3 top-3 text-gray-500' size={18} />
            <input
              type='text'
              name='location'
              value={eventData.location}
              onChange={handleChange}
              placeholder='Enter event location'
              className={inputClasses}
              required
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className='label font-medium text-blue-950 mb-2'>
            Description
          </label>
          <div className='relative'>
            <FileText
              className='absolute left-3 top-3 text-gray-500'
              size={18}
            />
            <textarea
              name='description'
              value={eventData.description}
              onChange={handleChange}
              placeholder='Describe the event...'
              className={textareaClasses}
              rows={6}
            />
          </div>
        </div>

        {/* Guests */}
        {/* Това вече е ненужно може да го премахнеш поканите за event се случват през contacts (Митко) */}
        <div>
          <label className='label font-medium text-blue-950 mb-2'>Guests</label>
          <div className='relative'>
            <Users className='absolute left-3 top-3 text-gray-500' size={18} />
            <input
              type='text'
              name='guests'
              value={eventData.guests}
              onChange={handleChange}
              placeholder='Add guests (comma-separated)'
              className={inputClasses}
            />
          </div>
        </div>

        {/* Privacy Toggle */}
        <div className='flex items-center gap-4'>
          <span className='font-medium text-blue-950'>Event Privacy:</span>
          <label className='swap swap-rotate'>
            <input
              type='checkbox'
              name='isPublic'
              checked={eventData.isPublic}
              onChange={handleChange}
            />
            <Globe className='swap-on text-green-500' size={20} />
            <Lock className='swap-off text-red-500' size={20} />
          </label>
          <span className='font-medium text-blue-950'>
            {eventData.isPublic ? 'Public' : 'Private'}
          </span>
        </div>

        {/* Submit Button */}
        <div>
          <Button type='submit' className='btn btn-primary w-full'>
            Create Event
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;
