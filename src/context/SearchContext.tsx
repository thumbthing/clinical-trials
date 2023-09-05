import React, { ReactNode, createContext, useContext } from 'react';
import { StateType } from '../types/context.type';

const defaultState: StateType = {
  input: '장',
  searchTermsArray: [],
  cachedId: [],
  inputDelete: false,
};

const StateContext = createContext<StateType>(defaultState);

export const SearchContext = () => useContext(StateContext);

export function SearchProvider({ children }: { children: ReactNode }) {
  return <StateContext.Provider value={defaultState}>{children}</StateContext.Provider>;
}
