import React, { useEffect } from 'react';
import { SearchContext } from '../context/SearchContext';
import { sessionParser } from '../utils/sessionHandler';
import handleError from '../utils/errorHandler';

function SuggestedSearchTermList() {
  const { state, setState } = SearchContext();
  const { input, searchTermsArray } = state;

  const sessionDataList = async (inputText: string) => {
    try {
      const sessionData = await sessionParser(inputText);
      if (sessionData) {
        setState((prevState) => ({ ...prevState, searchTermsArray: sessionData }));
        return null;
      }
      return null;
    } catch (error) {
      handleError(error);
      return null;
    }
  };

  useEffect(() => {
    sessionDataList(input);
  }, [input]);

  return (
    <div>
      <ul>
        {searchTermsArray.map((item) => (
          <li key={item.sickCd}>
            <div>
              <span>{item.sickNm}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SuggestedSearchTermList;
