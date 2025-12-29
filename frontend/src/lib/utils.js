import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs) => twMerge(clsx(inputs));

export const SetLocalStorage = () => {};
export const GetLocalStorage = () => ({ token: null, userInfo: null });
export const ClearLocalStorage = () => {};

export const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

export const formatDateShort = (dateString) => {
  const date = new Date(dateString);

  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
  });
};
