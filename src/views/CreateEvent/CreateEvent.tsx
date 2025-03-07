import Button from '../../components/Button/Button';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';

const CreateEvent: React.FC = () => {
  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log('Form Data:', data);
  };

  // Handle file upload preview
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Reusable classes
  const inputClasses =
    'input input-bordered w-full py-4 px-5 rounded-lg focus:ring-2 focus:ring-blue-300 bg-white text-gray-900 border-gray-300';
  const textareaClasses = `textarea textarea-bordered w-full py-4 px-5 rounded-lg focus:ring-2 focus:ring-blue-300 bg-white text-gray-900 border-gray-300`;
  const rowsFormClasses = 'mt-2';
  const labelClasses = 'block text-gray-700 font-medium mb-1';

  return (
    <div className='CreateEvent max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg'>
      <h1 className='text-3xl font-bold text-gray-900 mb-6'>Create an Event</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Event Name */}
        <div>
          <label className={labelClasses}>Event Name</label>
          <input
            {...register('eventName', { required: 'Event name is required' })}
            type='text'
            placeholder='Enter event name'
            className={inputClasses}
          />
          {errors.eventName && (
            <p className='text-red-500 text-sm mt-1'>
              {errors.eventName.message}
            </p>
          )}
        </div>

        {/* Cover Image Upload */}
        <div className={rowsFormClasses}>
          <label className={labelClasses}>Cover Image</label>
          <input
            type='file'
            {...register('coverImage', { required: 'Cover image is required' })}
            onChange={handleFileChange}
            className='file-input file-input-primary w-full'
            accept='image/*'
          />
          {errors.coverImage && (
            <p className='text-red-500 text-sm mt-1'>
              {errors.coverImage.message}
            </p>
          )}
        </div>

        {/* Start Date & Time */}
        <div className={rowsFormClasses + ' grid grid-cols-2 gap-4'}>
          {/* Start Date Picker */}
          <div>
            <label className={labelClasses}>Start Date</label>
            <Controller
              name='startDate'
              control={control}
              rules={{ required: 'Start date is required' }}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  selected={field.value}
                  onChange={(date) => field.onChange(date)}
                  dateFormat='MMMM d, yyyy'
                  className={inputClasses}
                  popperClassName='shadow-lg'
                />
              )}
            />
            {errors.startDate && (
              <p className='text-red-500 text-sm mt-1'>
                {errors.startDate.message}
              </p>
            )}
          </div>

          {/* Start Time Picker */}
          <div>
            <label className={labelClasses}>Start Time</label>
            <Controller
              name='startTime'
              control={control}
              rules={{ required: 'Start time is required' }}
              render={({ field }) => (
                <TimePicker
                  {...field}
                  value={field.value}
                  onChange={(time) => field.onChange(time)}
                  className={inputClasses}
                  disableClock={true}
                />
              )}
            />
            {errors.startTime && (
              <p className='text-red-500 text-sm mt-1'>
                {errors.startTime.message}
              </p>
            )}
          </div>
        </div>

        {/* End Date & Time */}
        <div className={rowsFormClasses + ' grid grid-cols-2 gap-4'}>
          {/* End Date Picker */}
          <div>
            <label className={labelClasses}>End Date</label>
            <Controller
              name='endDate'
              control={control}
              rules={{ required: 'End date is required' }}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  selected={field.value}
                  onChange={(date) => field.onChange(date)}
                  dateFormat='MMMM d, yyyy'
                  className={inputClasses}
                  popperClassName='shadow-lg'
                />
              )}
            />
            {errors.endDate && (
              <p className='text-red-500 text-sm mt-1'>
                {errors.endDate.message}
              </p>
            )}
          </div>

          {/* End Time Picker */}
          <div>
            <label className={labelClasses}>End Time</label>
            <Controller
              name='endTime'
              control={control}
              rules={{ required: 'End time is required' }}
              render={({ field }) => (
                <TimePicker
                  {...field}
                  value={field.value}
                  onChange={(time) => field.onChange(time)}
                  className={inputClasses}
                  disableClock={true}
                />
              )}
            />
            {errors.endTime && (
              <p className='text-red-500 text-sm mt-1'>
                {errors.endTime.message}
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        <div className={rowsFormClasses}>
          <label className={labelClasses}>Event Description</label>
          <textarea
            {...register('description', {
              required: 'Description is required',
              minLength: {
                value: 10,
                message: 'At least 10 characters required',
              },
            })}
            placeholder='Describe the event...'
            className={textareaClasses}
            rows='4'
          ></textarea>
          {errors.description && (
            <p className='text-red-500 text-sm mt-1'>
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Location */}
        <div className={rowsFormClasses}>
          <label className='block text-gray-700 font-medium mb-1'>
            Location
          </label>
          <input
            {...register('location', { required: 'Location is required' })}
            type='text'
            placeholder='Enter event location'
            className={inputClasses}
          />
          {errors.location && (
            <p className='text-red-500 text-sm mt-1'>
              {errors.location.message}
            </p>
          )}
        </div>

        {/* Visibility Toggle */}
        <div className={`${rowsFormClasses} flex items-center justify-between`}>
          <label className='text-gray-700 font-medium'>Event Visibility</label>
          <Controller
            name='visibility'
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <input
                type='checkbox'
                className='toggle toggle-primary' // This should work for a switch
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              />
            )}
          />
        </div>

        {/* Submit Button */}
        <Button type='submit' className='btn btn-primary mt-5'>
          Create Event
        </Button>
      </form>
    </div>
  );
};

export default CreateEvent;
