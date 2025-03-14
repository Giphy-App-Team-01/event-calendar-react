import {
  startOfDay,
  endOfDay,
  addDays,
  differenceInCalendarDays,
  addMonths,
  differenceInMonths,
  addYears,
  differenceInYears,
} from 'date-fns';
import { Event } from '../types/interfaces';

export const getOccurrenceStartForRecurringEvent = (
  event: Event,
  referenceDate: Date
): Date | null => {
  const originalStart = new Date(event.start);
  if (referenceDate < originalStart) return null;
  switch (event.recurrence) {
    case 'daily': {
      const diffDays = differenceInCalendarDays(referenceDate, originalStart);
      let candidate = addDays(originalStart, diffDays);
      if (candidate > referenceDate) candidate = addDays(candidate, -1);
      return candidate;
    }
    case 'weekly': {
      const diffDays = differenceInCalendarDays(referenceDate, originalStart);
      const weeks = Math.floor(diffDays / 7);
      let candidate = addDays(originalStart, weeks * 7);
      if (candidate > referenceDate) candidate = addDays(candidate, -7);
      return candidate;
    }
    case 'monthly': {
      const diffMonths = differenceInMonths(referenceDate, originalStart);
      let candidate = addMonths(originalStart, diffMonths);
      if (candidate > referenceDate) candidate = addMonths(candidate, -1);
      return candidate;
    }
    case 'yearly': {
      const diffYears = differenceInYears(referenceDate, originalStart);
      let candidate = addYears(originalStart, diffYears);
      if (candidate > referenceDate) candidate = addYears(candidate, -1);
      return candidate;
    }
    default:
      return null;
  }
};

export const occursOnDay = (event: Event, day: Date): boolean => {
  const dayStart = startOfDay(day);
  const dayEnd = endOfDay(day);

  if (!event.recurrence) {
    const originalStart = new Date(event.start);
    const originalEnd = new Date(event.end);
    return originalEnd > dayStart && originalStart < dayEnd;
  } else {
    const occurrenceStart = getOccurrenceStartForRecurringEvent(event, dayEnd);
    if (!occurrenceStart) return false;
    const originalStart = new Date(event.start);
    const originalEnd = new Date(event.end);
    const duration = originalEnd.getTime() - originalStart.getTime();
    const occurrenceEnd = new Date(occurrenceStart.getTime() + duration);
    return occurrenceEnd > dayStart && occurrenceStart < dayEnd;
  }
};

export const computeEffectiveTimes = (
  event: Event,
  currentDate: Date
): { effectiveStart: Date; effectiveEnd: Date } => {
  const dayStart = startOfDay(currentDate);
  const dayEnd = endOfDay(currentDate);

  if (!event.recurrence) {
    const originalStart = new Date(event.start);
    const originalEnd = new Date(event.end);
    return {
      effectiveStart: originalStart < dayStart ? dayStart : originalStart,
      effectiveEnd: originalEnd > dayEnd ? dayEnd : originalEnd,
    };
  } else {
    const occurrenceStart = getOccurrenceStartForRecurringEvent(event, dayEnd);
    if (!occurrenceStart)
      return { effectiveStart: dayStart, effectiveEnd: dayStart };

    const originalStart = new Date(event.start);
    const originalEnd = new Date(event.end);
    const duration = originalEnd.getTime() - originalStart.getTime();
    const occurrenceEnd = new Date(occurrenceStart.getTime() + duration);

    const effectiveStart =
      occurrenceStart.toDateString() === dayStart.toDateString()
        ? occurrenceStart < dayStart
          ? dayStart
          : occurrenceStart
        : dayStart;
    const effectiveEnd = occurrenceEnd > dayEnd ? dayEnd : occurrenceEnd;
    return { effectiveStart, effectiveEnd };
  }
};

export const getOccurrenceStart = (event: Event, day: Date): Date => {
  const originalStart = new Date(event.start);
  const occurrence = new Date(day);

  occurrence.setHours(
    originalStart.getHours(),
    originalStart.getMinutes(),
    originalStart.getSeconds(),
    originalStart.getMilliseconds()
  );
  return occurrence;
};
