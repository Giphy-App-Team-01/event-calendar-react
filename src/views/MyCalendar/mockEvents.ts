import { Event } from '../../views/MyCalendar/MyCalendar';

// This is a mock data file that contains an array of events.
//We need only this data to display events on the calendar.

//This will be replaced with a real events data from the database. 
//For now this functionality is not implemented

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Morning Standup',
    start: '2025-03-10T09:00',
    end: '2025-03-10T09:30',
  },
  {
    id: '2',
    title: 'Project Meeting',
    start: '2025-03-10T10:30',
    end: '2025-03-10T12:00',
  },
  {
    id: '3',
    title: 'Lunch Break',
    start: '2025-03-10T13:00',
    end: '2025-03-10T14:00',
  },
  {
    id: '4',
    title: 'Client Presentation',
    start: '2025-03-10T15:00',
    end: '2025-03-10T16:30',
  },
  {
    id: '5',
    title: 'Gym Workout',
    start: '2025-03-10T18:00',
    end: '2025-03-10T19:30',
  },
  {
    id: '6',
    title: 'Dinner with Family',
    start: '2025-03-10T20:00',
    end: '2025-03-10T21:30',
  },
  {
    id: '7',
    title: 'Overnight Hackathon',
    start: '2025-03-10T22:00',
    end: '2025-03-11T06:00',
  },
  {
    id: '8',
    title: 'Weekend Trip',
    start: '2025-03-15T07:00',
    end: '2025-03-17T22:00',
  },
  {
    id: '9',
    title: 'Daily Standup',
    start: '2025-03-10T09:00',
    end: '2025-03-10T09:15',
    recurrence: 'daily',
  },
  {
    id: '10',
    title: 'Weekly Sync',
    start: '2025-03-11T10:00',
    end: '2025-03-11T10:30',
    recurrence: 'weekly',
  },
  {
    id: '11',
    title: 'Monthly Check',
    start: '2025-03-15T14:00',
    end: '2025-03-15T15:00',
    recurrence: 'monthly',
  },
];
