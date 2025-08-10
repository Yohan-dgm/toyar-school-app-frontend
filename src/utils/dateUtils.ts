/**
 * Date utility functions to ensure consistent date handling across the app
 * These functions avoid timezone issues by using local date methods
 */

/**
 * Format a Date object to YYYY-MM-DD string in local timezone
 * This avoids the timezone issues caused by toISOString()
 * @param date - Date object to format
 * @returns Date string in YYYY-MM-DD format
 */
export const formatDateToYYYYMMDD = (date: Date): string => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

/**
 * Parse a YYYY-MM-DD string to Date object in local timezone
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns Date object in local timezone
 */
export const parseDateFromYYYYMMDD = (dateString: string): Date => {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day); // month is 0-indexed
};

/**
 * Get current date as YYYY-MM-DD string in local timezone
 * @returns Today's date in YYYY-MM-DD format
 */
export const getCurrentDateString = (): string => {
  return formatDateToYYYYMMDD(new Date());
};

/**
 * Check if two date strings represent the same date
 * @param date1 - First date string in YYYY-MM-DD format
 * @param date2 - Second date string in YYYY-MM-DD format
 * @returns True if dates are the same
 */
export const isSameDate = (date1: string, date2: string): boolean => {
  return date1 === date2;
};

/**
 * Format date string for display (e.g., "Sep 2, 2024")
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns Formatted date string for display
 */
export const formatDateForDisplay = (dateString: string): string => {
  try {
    const date = parseDateFromYYYYMMDD(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date for display:", error);
    return dateString;
  }
};

/**
 * Validate if a string is a valid YYYY-MM-DD date
 * @param dateString - Date string to validate
 * @returns True if valid date string
 */
export const isValidDateString = (dateString: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return false;
  }
  
  try {
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    
    // Check if the date is valid and matches input
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  } catch {
    return false;
  }
};