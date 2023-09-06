import React, { ChangeEvent, ReactNode, createContext, useContext, useMemo } from 'react';
import { FunctionType, SickArray } from '../types/context.type';
import handleError from '../utils/errorHandler';
import { getSearchTerms } from '../api/client';
import sessionHandler from '../utils/sessionHandler';

const changeInput = (event: ChangeEvent<HTMLInputElement>): Promise<string> => {
  return new Promise((resolve) => {
    const text = event.target.value;
    resolve(text);
  });
};

const getTerm = async (searchText: string) => {
  try {
    const response = await getSearchTerms(searchText);
    if (response?.status !== 200) {
      throw new Error('fail to get term');
    }
    const result = response?.data;
    return result;
  } catch (error) {
    handleError(error);
    return null;
  }
};

// 키값을 숫자로 해야 순서대로 지워야함

const addToSessionStorage = async (searchText: string, reponseData: SickArray[]) => {
  try {
    await sessionHandler(searchText, reponseData);
  } catch (error) {
    handleError(error);
  }
};

// delete 작성해야함

const defaultFunction: FunctionType = {
  changeInput,
  getTerm,
  addToSessionStorage,
  deleteOldSession: () => {
    console.log('delete cache 작동');
  },
};
const FunctionProviderContext = createContext<FunctionType>(defaultFunction);
export const SearchFunctionContext = () => useContext(FunctionProviderContext);

export function FunctionContext({ children }: { children: ReactNode }) {
  const MemorizedFunction = useMemo<FunctionType>(() => {
    return defaultFunction;
  }, []);

  return <FunctionProviderContext.Provider value={MemorizedFunction}>{children}</FunctionProviderContext.Provider>;
}
