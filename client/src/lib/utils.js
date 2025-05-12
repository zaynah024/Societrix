import { format, isToday } from 'date-fns';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for merging classes with tailwind
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Format date to display (e.g., "May 15, 2025")
export function formatDate(date) {
  return format(date, 'MMMM d, yyyy');
}

// Format just month and year (e.g., "May 2025")
export function formatMonthYear(date) {
  return format(date, 'MMMM yyyy');
}

// Check if a date is today
export function isDateToday(date) {
  return isToday(date);
}

// Get class name for a badge based on status
export function getStatusBadgeClass(status) {
  switch (status.toLowerCase()) {
    case 'approved':
      return 'badge badge-green';
    case 'pending':
      return 'badge badge-yellow';
    case 'rejected':
      return 'badge badge-red';
    default:
      return 'badge';
  }
}

// Get class name for a priority badge
export function getPriorityBadgeClass(priority) {
  switch (priority.toLowerCase()) {
    case 'high':
      return 'announcement-priority priority-high';
    case 'medium':
      return 'announcement-priority priority-medium';
    case 'low':
      return 'announcement-priority priority-low';
    default:
      return 'announcement-priority';
  }
}

// Handle API errors
export function handleApiError(error) {
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  }
  return 'An error occurred. Please try again later.';
}

// Create an array of calendar days for a month
export function getCalendarDays(year, month) {
  const days = [];
  
  // First day of the month
  const firstDay = new Date(year, month, 1);
  // Last day of the month
  const lastDay = new Date(year, month + 1, 0);
  
  // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
  const firstDayOfWeek = firstDay.getDay();
  
  // Add days from previous month to fill the first week
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month, -i);
    days.push({ date, isCurrentMonth: false });
  }
  
  // Add all days of the current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(year, month, i);
    days.push({ date, isCurrentMonth: true });
  }
  
  // Add days from next month to fill the last week
  const lastDayOfWeek = lastDay.getDay();
  for (let i = 1; i < 7 - lastDayOfWeek; i++) {
    const date = new Date(year, month + 1, i);
    days.push({ date, isCurrentMonth: false });
  }
  
  return days;
}

// Generate initials from a name
export function getInitials(name) {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase();
}