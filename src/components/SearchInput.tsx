import React, { ChangeEvent, useCallback, useEffect } from 'react';
import { SearchContext } from '../context/SearchContext';
import { SearchFunctionContext } from '../context/FunctionContext';
import handleError from '../utils/errorHandler';
import debounceFunction from '../utils/debounce';

function SearchInput() {
  const { state, setState } = SearchContext();
  const { changeInput, getTerm, addToSessionStorage, deleteOldSession } = SearchFunctionContext();

  // test 용 hook

  const getTermAndAddToCacheStorage = async (text: string) => {
    try {
      const dataFromDb = await getTerm(text);
      addToSessionStorage(text, dataFromDb);
    } catch (error) {
      handleError(error);
    }
  };

  const handleChangeInput = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const debouncedChangeInput = debounceFunction(changeInput, 500);
      const text = await debouncedChangeInput(e);
      if (text) {
        setState((prevState) => ({ ...prevState, input: text }));
        await getTermAndAddToCacheStorage(text);
      }
      console.log('input : asdfaiuosfbivae', state.input);

      console.log('just for testing', getTermAndAddToCacheStorage('asdf'));
      console.log('just for testing', setState);
    } catch (error) {
      handleError(error);
    }
  };

  const addCachedId = useCallback(() => {
    // cachedId.push(input);
    return null;
  }, []);

  useEffect(() => {
    console.log(state.input);

    console.log(addCachedId);

    deleteOldSession();
  }, [state]);

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
