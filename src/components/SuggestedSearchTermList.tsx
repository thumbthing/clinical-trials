import React, { useEffect, useRef } from 'react';
import { SearchContext } from '../context/SearchContext';
import { sessionParser } from '../utils/sessionHandler';
import handleError from '../utils/errorHandler';
import { ListContainer, TermList, TermItem, SickName } from '../styles/SuggestedSearchTermList.style';

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
        return null;
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
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

  const getSessionDataList = async (inputText: string) => {
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

  const isInputEmpty = input === '';

  useEffect(() => {
    getSessionDataList(input);
  }, [input]);

  return (
    <ListContainer>
      <TermList ref={listRef} style={{ display: isInputEmpty ? 'none' : 'block' }}>
        {searchTermsArray.map((item, index) => (
          <TermItem
            key={item.sickCd}
            tabIndex={0}
            ref={index === selectedItemIndex ? focusRef : null}
            onKeyDown={(e) => handleKeyDown(e)}
          >
            <SickName>{item.sickNm}</SickName>
          </TermItem>
        ))}
      </TermList>
    </ListContainer>
  );
}

export default SuggestedSearchTermList;
