import { SickArray } from '../types/context.type';
import handleError from './errorHandler';

export const sessionHandler = async (inputText: string, termResult: SickArray[]) => {
  try {
    const serializedData = JSON.stringify(termResult);
    sessionStorage.setItem(inputText, serializedData);
  } catch (error) {
    handleError(error);
  }
};

export const sessionParser = async (input: string): Promise<SickArray[] | null> => {
  try {
    const cachedData: string | null = sessionStorage.getItem(input);
    if (typeof cachedData === 'string') {
      const formatedData = JSON.parse(cachedData);
      return formatedData;
    }
    return null;
  } catch (error) {
    handleError(error);
    return null;
  }
};
