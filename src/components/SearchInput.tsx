import React, { ChangeEvent, useCallback, useEffect, useRef } from 'react';
import { SearchContext } from '../context/SearchContext';
import { SearchFunctionContext } from '../context/FunctionContext';
import handleError from '../utils/errorHandler';
import debounceFunction from '../utils/debounce';
import checkInputValid from '../utils/checkInputTextValid';
import { Button, Input, Container, SearchInputListBox } from '../styles/SearchInput.style';
import SuggestedSearchTermList from './SuggestedSearchTermList';

function SearchInput() {
  const { state, setState } = SearchContext();
  const { changeInput, getTerm, addToSessionStorage, deleteOldSession } = SearchFunctionContext();
  const { input, searchTermsArray, cachedId, inputDelete, selectedItemIndex, isSelectingSuggestedTerms } = state;

  const inputRef = useRef<HTMLInputElement | null>(null);

  const getTermAndAddToSessionStorage = async (text: string) => {
    try {
      const checkCachedId = !cachedId.includes(text);
      if (checkCachedId) {
        const dataFromDb = await getTerm(text);
        const checkDataLength = dataFromDb.length !== 0;

        if (checkDataLength) {
          addToSessionStorage(text, dataFromDb);
          const newCachedArray = [...cachedId, text];
          setState((prevState) => ({ ...prevState, cachedId: newCachedArray, searchTermsArray: dataFromDb }));
        }
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleChangeInput = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      setState((prevState) => ({ ...prevState, input: e.target.value }));
      const debouncedChangeInput = debounceFunction(changeInput, 1000);
      const text = await debouncedChangeInput(e);
      const formatedText = text.trim();
      const inputValid = checkInputValid(formatedText);
      if (formatedText && inputValid) {
        await getTermAndAddToSessionStorage(text);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const deleteOldTerm = useCallback(async () => {
    try {
      const OLD_KEY: string | undefined = cachedId.shift();
      if (OLD_KEY) {
        await deleteOldSession(OLD_KEY);
        const newCacheId: string[] = cachedId.filter((key) => key !== OLD_KEY);
        setState((prevState) => ({ ...prevState, cachedId: newCacheId }));
      }
    } catch (error) {
      handleError(error);
    }
  }, [cachedId]);

  const resetInput = async () => {
    try {
      setState((prevState) => ({ ...prevState, input: '', searchTermsArray: [] }));
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    setTimeout(() => deleteOldTerm(), 100000000);
  }, [cachedId]);

  // 브라우저 이벤트 해제
  const ArrowKeyHandle = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      e.stopPropagation();
      const isSuggestedTermExist = searchTermsArray.length !== 0;
      if (isSuggestedTermExist) {
        setState((prevState) => ({
          ...prevState,
          isSelectingSuggestedTerms: true,
        }));
      }
    }
  };

  useEffect(() => {
    if (isSelectingSuggestedTerms === false) {
      inputRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      inputRef?.current?.focus();
    }
  }, [isSelectingSuggestedTerms, selectedItemIndex]);

  useEffect(() => {
    if (input === '') {
      setState((prevState) => ({ ...prevState, searchTermsArray: [] }));
    }
  }, [input]);

  // 확인용 콘솔

  useEffect(() => {
    console.log('========console.log start============');
    console.log('input                     : \n', input);
    console.log('searchTemrsArray          : \n', searchTermsArray);
    console.log('cachedId                  : \n', cachedId);
    console.log('inputDelete               : \n', inputDelete);
    console.log('selectedItemIndex         : \n', selectedItemIndex);
    console.log('isSelectingSuggestedTerms : \n', isSelectingSuggestedTerms);

    console.log('=========console.log end===========');
  }, [state]);

  return (
    <Container>
      <Button type="button">{`<-`}</Button>
      <SearchInputListBox>
        <Input
          type="search"
          ref={isSelectingSuggestedTerms === false ? inputRef : null}
          onChange={handleChangeInput}
          onKeyDown={(e) => ArrowKeyHandle(e)}
          placeholder="검색창"
          value={input}
        />
        <SuggestedSearchTermList />
      </SearchInputListBox>
      <Button type="button" onClick={resetInput}>
        x
      </Button>
      <Button type="submit">0</Button>
    </Container>
  );
}

export default SearchInput;
