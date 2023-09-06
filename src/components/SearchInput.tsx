import React, { ChangeEvent, useEffect } from 'react';
import { SearchContext } from '../context/SearchContext';
import { SearchFunctionContext } from '../context/FunctionContext';
import handleError from '../utils/errorHandler';
import debounceFunction from '../utils/debounce';
import checkInputValid from '../utils/checkInputTextValid';

function SearchInput() {
  const { state, setState } = SearchContext();
  const { changeInput, getTerm, addToSessionStorage, deleteOldSession } = SearchFunctionContext();

  const getTermAndAddToCacheStorage = async (text: string) => {
    try {
      const dataFromDb = await getTerm(text);
      const checkCachedId = !state.cachedId.includes(text);
      const checkDataLength = dataFromDb.length !== 0;

      if (checkCachedId && checkDataLength) {
        addToSessionStorage(text, dataFromDb);
        const newCachedArray = [...state.cachedId, text];
        setState((prevState) => ({ ...prevState, cachedId: newCachedArray }));
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleChangeInput = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const debouncedChangeInput = debounceFunction(changeInput, 1000);
      const text = await debouncedChangeInput(e);
      const formatedText = text.trim();
      const inputValid = checkInputValid(formatedText);
      if (formatedText && inputValid) {
        setState((prevState) => ({ ...prevState, input: formatedText }));
        await getTermAndAddToCacheStorage(text);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const addCachedId = useEffect(() => {
    console.log(state.input);

    console.log(addCachedId);

    deleteOldSession();
  }, [state.cachedId]);

  return (
    <>
      <div>
        <button type="button">뒤로가기</button>
        <input type="text" placeholder="검색창" />
        <button type="button">input 창 삭제</button>
        <button type="submit">검색하기</button>
      </div>
      <div>
        <h1>test container</h1>
        <input onChange={handleChangeInput} type="text" />
      </div>
    </>
  );
}

export default SearchInput;
