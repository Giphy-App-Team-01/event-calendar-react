import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { uploadImageToCloudinary } from '../../services/upload-service';
import Button from '../../components/Button/Button';
import { useContext } from 'react';
import { AppContext } from '../../context/app.context';
import { createEvent } from '../../services/db-service';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import DefaultCover from '../../assets/images/event-cover.webp';
import { NewEvent, FormValues } from '../../types/interfaces';
import { isValid, parse } from 'date-fns';

const CreateEvent: React.FC = () => {
  const { authUser } = useContext(AppContext);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      recurrence: 'none',
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const file = data.coverImage && data.coverImage[0];
      let imageUrl: string | null = null;
      if (file) {
        imageUrl = await uploadImageToCloudinary(file);
      }

      const newEvent: NewEvent = {
        title: data.eventName,
        start: data.start,
        end: data.end,
        description: data.description,
        location: data.location,
        image: imageUrl || DefaultCover,
        visibility: data.visibility,
        creatorId: authUser?.uid || '',
      };

      if (data.recurrence !== 'none') {
        newEvent.recurrence = data.recurrence;
      }

      const eventId = await createEvent(newEvent);
      toast.success('Event created successfully!', { autoClose: 1000 });

      setTimeout(() => {
        navigate(`/event/${eventId}`);
      }, 1500);
    } catch (error) {
      console.error('Error creating event:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unknown error occurred.');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const currentYear = new Date().getFullYear();

  const handleDateTimeBlur = (
    e: React.FocusEvent<HTMLInputElement>,
    setValue: (
      name: keyof FormValues,
      value: string,
      options?: { shouldValidate: boolean }
    ) => void
  ) => {
    const value = e.target.value; 
    if (!value) return;
    const parts = value.split('-'); 
    const enteredYear = parseInt(parts[0], 10);
    if (enteredYear < currentYear) {
  
      parts[0] = currentYear.toString();
      const newValue = parts.join('-');
      
      setValue(e.target.name as keyof FormValues, newValue, {
        shouldValidate: true,
      });
    }
  };

  // Styles
  const labelClasses = 'block text-gray-700 font-medium mb-1';
  const inputClasses =
    'w-full p-3 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-blue-300 focus:outline-none';
  const errorClasses = 'text-sm text-red-500 mt-1';

  return (
    <div className="CreateEvent max-w-4xl mx-auto p-8 bg-white shadow-md rounded-lg">
      <h1 className="text-center text-2xl font-bold mb-6 text-gray-800">
        Create an Event
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-y-5"
      >
        {/* EVENT NAME */}
        <div>
          <label className={labelClasses}>Event Name</label>
          <input
            type="text"
            placeholder="Enter event name"
            className={inputClasses}
            {...register('eventName', { required: 'Event name is required',
            minLength: {
              value: 3,
              message: 'At least 3 characters required',
            },
            maxLength: {
              value: 30,
              message: 'Event name must be at most 30 characters',
            },
             })}
          />
          {errors.eventName && (
            <p className={errorClasses}>{errors.eventName.message}</p>
          )}
        </div>
        {/* COVER IMAGE */}
        <div className="form-control">
          <label className="label font-medium text-gray-700">
            <span className="label-text">Cover Image</span>
          </label>
          <div className="relative group">
            <img
              src={previewImage || DefaultCover}
              alt="Cover Preview"
              className="w-full h-72 object-cover rounded-xl border border-gray-200 shadow-sm transition-all duration-300 group-hover:shadow-lg"
            />
            <input
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer"
              accept="image/*"
              {...register('coverImage')}
              onChange={handleFileChange}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl">
              <span className="text-white font-medium">Change Image</span>
            </div>
          </div>
          {errors.coverImage && (
            <p className="text-sm text-red-500 mt-1">
              {errors.coverImage.message}
            </p>
          )}
        </div>

        {/* START DATETIME */}
        <div>
          <label className={labelClasses}>Start (Date & Time)</label>
          <input
            type="datetime-local"
            className={inputClasses}
            {...register('start', {
              required: 'Start Date/Time is required',
              onBlur: (e) => handleDateTimeBlur(e, setValue),
              validate: (value: string) => {
                const parsedDate = parse(
                  value,
                  "yyyy-MM-dd'T'HH:mm",
                  new Date()
                );
                if (!isValid(parsedDate)) {
                  return 'Invalid date/time format. Use YYYY-MM-DDTHH:mm';
                }
                return true;
              },
            })}
          />
          {errors.start && (
            <p className={errorClasses}>{errors.start.message}</p>
          )}
        </div>

        {/* END DATETIME */}
        <div>
          <label className={labelClasses}>End (Date & Time)</label>
          <input
            type="datetime-local"
            className={inputClasses}
            {...register('end', {
              required: 'End Date/Time is required',
              onBlur: (e) => handleDateTimeBlur(e, setValue),
              validate: (value: string) => {
                const parsedDate = parse(
                  value,
                  "yyyy-MM-dd'T'HH:mm",
                  new Date()
                );
                if (!isValid(parsedDate)) {
                  return 'Invalid date/time format. Use YYYY-MM-DDTHH:mm';
                }
                return true;
              },
            })}
          />
          {errors.end && <p className={errorClasses}>{errors.end.message}</p>}
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className={labelClasses}>Description</label>
          <textarea
            rows={4}
            className={`${inputClasses} resize-none`}
            placeholder="Describe the event..."
            {...register('description', {
              required: 'Description is required',
              minLength: {
                value: 10,
                message: 'At least 10 characters required',
              },
              maxLength: {
                value: 500,
                message: 'Description must be at most 500 characters',
              },
            })}
          ></textarea>
          {errors.description && (
            <p className={errorClasses}>{errors.description.message}</p>
          )}
        </div>
        {/* LOCATION */}
        <div>
          <label className={labelClasses}>Location</label>
          <input
            type="text"
            placeholder="Enter event location"
            className={inputClasses}
            {...register('location', { required: 'Location is required',
            minLength: {
              value: 3,
              message: 'At least 3 characters required',
            },
            maxLength: {
              value: 20,
              message: 'Location must be at most 20 characters',
            },
             })}
          />
          {errors.location && (
            <p className={errorClasses}>{errors.location.message}</p>
          )}
        </div>
        {/* RECURRENCE */}
        <div>
          <label className={labelClasses}>Recurrence</label>
          <select
            className={`${inputClasses} bg-white`}
            {...register('recurrence')}
          >
            <option value="none">None</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
        {/* EVENT VISIBILITY (PUBLIC / PRIVATE) */}
        <div className="mb-5">
          <p className="text-gray-800 font-bold text-lg mb-3">
            Event Visibility
          </p>

          <div className="flex gap-4">
            {/* Public Radio */}
            <label className="cursor-pointer relative">
              <input
                type="radio"
                value="public"
                {...register('visibility', { required: true })}
                className="peer opacity-0 absolute"
                defaultChecked
              />
              <div
                className="px-5 py-2 rounded-md text-gray-700 bg-gray-200 
                    peer-checked:bg-blue-500 peer-checked:text-white 
                    transition-colors"
              >
                Public
              </div>
            </label>

            {/* Private Radio */}
            <label className="cursor-pointer relative">
              <input
                type="radio"
                value="private"
                {...register('visibility', { required: true })}
                className="peer opacity-0 absolute"
              />
              <div
                className="px-5 py-2 rounded-md text-gray-700 bg-gray-200 
                    peer-checked:bg-blue-500 peer-checked:text-white 
                    transition-colors"
              >
                Private
              </div>
            </label>
          </div>
        </div>
        {/* SUBMIT BUTTON */}
        <Button type="submit" className="btn btn-primary w-full mt-1">
          Create Event
        </Button>
      </form>
    </div>
  );
};

export default CreateEvent;
