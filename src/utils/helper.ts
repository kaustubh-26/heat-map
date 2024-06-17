export type Value = {
  year: number;
  month: number;
  variance: number;
};

export type DataValue = {
  baseTemperature: number;
  monthlyVariance: Value[];
};

export const colors = ['#4575b4', '#74add1', '#f46d43', '#d73027'];

export const months = [
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

