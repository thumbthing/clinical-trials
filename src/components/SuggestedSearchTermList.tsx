import React, { useEffect, useRef } from 'react';
import { SearchContext } from '../context/SearchContext';
import { sessionParser } from '../utils/sessionHandler';
import handleError from '../utils/errorHandler';
import { ListContainer, TermList, TermItem } from '../styles/SuggestedSearchTermList.style';

type KeyEventActiontType = {
  ArrowDown: () => void;
  ArrowUp: () => void;
  Escape: () => void;
  Enter: () => void;
};

type KeyEventType = 'ArrowDown' | 'ArrowUp' | 'Escape' | 'Enter';

function SuggestedSearchTermList() {
  const { state, setState } = SearchContext();
  const { input, searchTermsArray, selectedItemIndex, isSelectingSuggestedTerms } = state;

  const listRef = useRef<HTMLUListElement | null>(null);
  const focusRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    if (isSelectingSuggestedTerms && selectedItemIndex === -1) {
      setState((prev) => ({ ...prev, selectedItemIndex: 0 }));
    }
  }, [isSelectingSuggestedTerms]);

  const KeyEventAction: KeyEventActiontType = {
    ArrowDown: () => {
      if (searchTermsArray.length === 0 || listRef.current === null) {
        return null;
      }
      if (listRef.current.childElementCount === selectedItemIndex + 1) {
        setState((prevState) => ({
          ...prevState,
          selectedItemIndex: 0,
        }));
      }
      if (selectedItemIndex === -1) {
        setState((prevState) => ({
          ...prevState,
          selectedItemIndex: 0,
        }));
      } else {
        setState((prevState) => ({
          ...prevState,
          selectedItemIndex: selectedItemIndex + 1,
        }));
      }
      return null;
    },
    ArrowUp: () => {
      if (selectedItemIndex <= 0) {
        setState((prevState) => ({
          ...prevState,
          isSelectingSuggestedTerms: false,
          selectedItemIndex: -1,
        }));
      } else {
        setState((prevState) => ({
          ...prevState,
          selectedItemIndex: prevState.selectedItemIndex - 1,
        }));
      }
      return null;
    },
    Escape: () => {
      setState((prevState) => ({
        ...prevState,
        isSelectingSuggestedTerms: false,
        selectedItemIndex: -1,
      }));
    },
    Enter: () => {
      setState((prevState) => ({
        ...prevState,
        isSelectingSuggestedTerms: false,
        selectedItemIndex: -1,
      }));
    },
  };

  const handleKeyUP = (e: React.KeyboardEvent) => {
    e.preventDefault();
    const keyInserted = e.key as KeyEventType;

    if (KeyEventAction[keyInserted]) {
      KeyEventAction[keyInserted]();
    }
    return null;
  };

  useEffect(() => {
    if (focusRef?.current) {
      focusRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      focusRef.current.focus();
    }
    if (selectedItemIndex <= -1) {
      focusRef.current?.blur();
    }
  }, [selectedItemIndex]);

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
      <TermList ref={listRef}>
        {searchTermsArray.map((item, index) => (
          <TermItem
            key={item.sickCd}
            tabIndex={0}
            ref={index === selectedItemIndex ? focusRef : null}
            onKeyUp={(e) => handleKeyUP(e)}
          >
            {index} : {item.sickNm}
          </TermItem>
        ))}
      </TermList>
    </ListContainer>
  );
}

export default SuggestedSearchTermList;
