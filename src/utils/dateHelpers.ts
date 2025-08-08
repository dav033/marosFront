export function formatDate(
  dateValue: string | Date | null | undefined,
  options: {
    format?: "short" | "medium" | "long" | "relative";
    locale?: string;
  } = {}
): string {
  if (!dateValue) {
    return "—";
  }

  const { format = "medium", locale = "en-US" } = options;

  let date: Date;

  try {
    date = typeof dateValue === "string" ? new Date(dateValue) : dateValue;

    if (isNaN(date.getTime())) {
      return "—";
    }
  } catch (error) {
    console.warn("Invalid date format:", dateValue);
    return "—";
  }

  switch (format) {
    case "short":
      return date.toLocaleDateString(locale, {
        month: "short",
        day: "numeric",
        year: "2-digit",
      });

    case "medium":
      return date.toLocaleDateString(locale, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

    case "long":
      return date.toLocaleDateString(locale, {
        weekday: "short",
        month: "long",
        day: "numeric",
        year: "numeric",
      });

    case "relative":
      return formatRelativeDate(date);

    default:
      return date.toLocaleDateString(locale);
  }
}
export function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 1) {
    return "just now";
  } else if (diffMinutes < 60) {
    return `${diffMinutes} min ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays === 1) {
    return "yesterday";
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} month${months > 1 ? "s" : ""} ago`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `${years} year${years > 1 ? "s" : ""} ago`;
  }
}
export function formatDateTime(
  dateValue: string | Date | null | undefined,
  options: {
    dateFormat?: "short" | "medium" | "long";
    timeFormat?: "12h" | "24h";
    locale?: string;
  } = {}
): string {
  if (!dateValue) {
    return "—";
  }

  const {
    dateFormat = "medium",
    timeFormat = "12h",
    locale = "en-US",
  } = options;

  let date: Date;

  try {
    date = typeof dateValue === "string" ? new Date(dateValue) : dateValue;

    if (isNaN(date.getTime())) {
      return "—";
    }
  } catch (error) {
    console.warn("Invalid datetime format:", dateValue);
    return "—";
  }

  const dateOptions: Intl.DateTimeFormatOptions = {
    month:
      dateFormat === "short"
        ? "short"
        : dateFormat === "long"
          ? "long"
          : "short",
    day: "numeric",
    year: dateFormat === "short" ? "2-digit" : "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: timeFormat === "12h",
  };

  return date.toLocaleDateString(locale, dateOptions);
}
export function isToday(date: Date | string): boolean {
  const inputDate = typeof date === "string" ? new Date(date) : date;
  const today = new Date();

  return inputDate.toDateString() === today.toDateString();
}
export function isWithinLastDays(date: Date | string, days: number): boolean {
  const inputDate = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - inputDate.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  return diffDays <= days && diffDays >= 0;
}
