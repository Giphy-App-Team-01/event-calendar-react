import { endOfDay, startOfDay } from 'date-fns';
import { Event } from '../types/interfaces';

//This function checks if the event occurs on the given day.
export const occursOnDay = (event: Event, day: Date): boolean => {
  //Define the start and end of the given day.
  const dayStart = startOfDay(day);
  const dayEnd = endOfDay(day);
  //Create a new Date object from the start time of the event.
  const eventStart = new Date(event.start);

  // If the event is not recurring, simply check if its interval overlaps with the day.
  if (!event.recurrence) {
    const eventEnd = new Date(event.end);
    return eventEnd > dayStart && eventStart < dayEnd;
  }

  // For recurring events, if the given day is before the original event start, return false.
  if (day < startOfDay(eventStart)) return false;

  // Depending on the recurrence type, determine if the event occurs on the given day./
  switch (event.recurrence) {
    case 'daily':
      // Daily events occur on every day after the original start.
      return true;
    case 'weekly':
      // Weekly events occur if the day of the week matches the original event's day.
      return eventStart.getDay() === day.getDay();
    case 'monthly':
      // Monthly events occur if the day of the month matches the original event's date.
      return eventStart.getDate() === day.getDate();
    default:
      return false;
  }
};

//This function will return the new "start" for the event occurrence on the given day.
export const getOccurrenceStart = (event: Event, day: Date): Date => {
  //Create a new Date object from the original start time of the event.
  const originalStart = new Date(event.start);
  //Create a new Date object from the given day.
  const occurrence = new Date(day);

  /// Set the time of the occurrence to match the original event's time.
  occurrence.setHours(
    originalStart.getHours(),
    originalStart.getMinutes(),
    originalStart.getSeconds(),
    originalStart.getMilliseconds()
  );
  return occurrence;
};
