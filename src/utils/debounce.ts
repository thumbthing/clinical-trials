import { ChangeEvent } from 'react';

/* eslint-disable no-unused-vars */
const debounceFunction = (callback: (args: ChangeEvent<HTMLInputElement>) => Promise<string>, delay: number) => {
  let timer: ReturnType<typeof setTimeout>;

  return (args: ChangeEvent<HTMLInputElement>) => {
    return new Promise<string>((resolve) => {
      clearTimeout(timer);
      timer = setTimeout(async () => {
        const result = await callback(args);
        resolve(result);
      }, delay);
    });
  };
};

export default debounceFunction;
