export const getMonthNumber = (monthName: string) => {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  return monthNames.indexOf(monthName) + 1;
};

export const calculateReadingTime = (htmlContent: string): number => {
  const text = htmlContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = text.split(' ').filter((word) => word.length > 0).length;
  return Math.max(1, Math.ceil(wordCount / 200));
};

export const getMonthName = (monthNumber: number) => {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return monthNames[monthNumber - 1];
};
