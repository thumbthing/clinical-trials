import React, { useEffect } from 'react';
import { SearchContext } from '../context/SearchContext';
import { sessionParser } from '../utils/sessionHandler';
import handleError from '../utils/errorHandler';
import { ListContainer, TermList, TermItem, SickName } from '../styles/SuggestedSearchTermList.style';

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
    <ListContainer>
      <TermList>
        {searchTermsArray.map((item) => (
          <TermItem key={item.sickCd}>
            <div>
              <SickName>{item.sickNm}</SickName>
            </div>
          </TermItem>
        ))}
      </TermList>
    </ListContainer>
  );
}

export default SuggestedSearchTermList;
