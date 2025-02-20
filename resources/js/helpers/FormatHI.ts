import { format } from "date-fns";

// Parsing dan format waktu
export const formatHI = (timeString: string | undefined) => {
  if (!timeString) return "00:00"; // Default jika waktu kosong

  try {
    // Remove seconds if present
    const timeParts = timeString.split(':');
    const hours = timeParts[0] || '00';
    const minutes = timeParts[1] || '00';

    // Create a date object with today's date and the time
    const date = new Date();
    date.setHours(parseInt(hours));
    date.setMinutes(parseInt(minutes));

    return format(date, 'HH:mm');
  } catch (error) {
    console.error('Error formatting time:', error);
    return "00:00";
  }
};
