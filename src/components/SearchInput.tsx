import React, { ChangeEvent, useCallback, useEffect } from 'react';
import { SearchContext } from '../context/SearchContext';
import { SearchFunctionContext } from '../context/FunctionContext';
import handleError from '../utils/errorHandler';
import debounceFunction from '../utils/debounce';
import checkInputValid from '../utils/checkInputTextValid';
import { Button, Input, Container } from '../styles/SearchInput.style';

function SearchInput() {
  const { state, setState } = SearchContext();
  const { changeInput, getTerm, addToSessionStorage, deleteOldSession } = SearchFunctionContext();

  const getTermAndAddToSessionStorage = async (text: string) => {
    try {
      const dataFromDb = await getTerm(text);
      const checkCachedId = !state.cachedId.includes(text);
      const checkDataLength = dataFromDb.length !== 0;

      if (checkCachedId && checkDataLength) {
        addToSessionStorage(text, dataFromDb);
        const newCachedArray = [...state.cachedId, text];
        setState((prevState) => ({ ...prevState, cachedId: newCachedArray, searchTermsArray: dataFromDb }));
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
      const OLD_KEY: string | undefined = state.cachedId.shift();
      if (OLD_KEY) {
        await deleteOldSession(OLD_KEY);
        const newCacheId: string[] = state.cachedId.filter((key) => key !== OLD_KEY);
        setState((prevState) => ({ ...prevState, cachedId: newCacheId }));
      }
    } catch (error) {
      handleError(error);
    }
  }, [state.cachedId]);

  useEffect(() => {
    setTimeout(() => deleteOldTerm(), 100000000);
  }, [state.cachedId]);

  const resetInput = async () => {
    try {
      setState((prevState) => ({ ...prevState, input: '' }));
    } catch (error) {
      handleError(error);
    }
  };

  // 브라우저 이벤트 해제
  const ArrowKeyHandle = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setState((prevState) => ({
        ...prevState,
        isSelectingSuggestedTerms: true,
      }));
    }
  };

  return (
    <Container>
      <Button type="button">뒤로가기</Button>
      <Input
        type="search"
        onChange={handleChangeInput}
        onKeyDown={(e) => ArrowKeyHandle(e)}
        placeholder="검색창"
        value={state.input}
      />
      <Button type="button" onClick={resetInput}>
        input 창 삭제
      </Button>
      <Button type="submit">검색하기</Button>
    </Container>
  );
}

export default SearchInput;
