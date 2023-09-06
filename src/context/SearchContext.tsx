import React, { ReactNode, createContext, useContext, useMemo, useState } from 'react';
import { StateType } from '../types/context.type';

const defaultState: StateType = {
  input: '',
  searchTermsArray: [],
  cachedId: [],
  inputDelete: false,
};

const StateContext = createContext<
  | {
      state: StateType;
      setState: React.Dispatch<React.SetStateAction<StateType>>;
    }
  | undefined
>(undefined);

export const SearchContext = () => {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

export function SearchProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StateType>(defaultState);
  const memorizedState = useMemo(() => ({ state, setState }), [state]);

  return <StateContext.Provider value={memorizedState}>{children}</StateContext.Provider>;
}
