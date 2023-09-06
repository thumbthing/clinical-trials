import { ChangeEvent } from 'react';

export type SickArray = {
  sickCd: string;
  sickNm: string;
};

export type StateType = {
  input: string;
  searchTermsArray: SickArray[];
  cachedId: string[];
  inputDelete: boolean;
};

export type FunctionType = {
  /* eslint-disable no-unused-vars */
  changeInput: (event: ChangeEvent<HTMLInputElement>) => Promise<string>;
  /* eslint-disable no-unused-vars */
  getTerm: (searchText: string) => Promise<SickArray[]>;
  /* eslint-disable no-unused-vars */
  addToSessionStorage: (searchText: string, responseData: SickArray[]) => Promise<void>;
  /* eslint-disable no-unused-vars */
  deleteOldSession: (key: string) => void;
};
