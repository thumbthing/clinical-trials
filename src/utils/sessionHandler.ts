import { SickArray } from '../types/context.type';
import handleError from './errorHandler';

const sessionHandler = async (inputText: string, termResult: SickArray[]) => {
  try {
    const serializedData = JSON.stringify(termResult);
    sessionStorage.setItem(inputText, serializedData);
  } catch (error) {
    handleError(error);
  }
};

export default sessionHandler;
