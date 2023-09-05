import React, { ChangeEvent, useEffect } from 'react';
import { SearchContext } from '../context/SearchContext';
import { SearchFunctionContext } from '../context/FunctionContext';

function SearchInput() {
  const { input, searchTermsArray, cachedId, inputDelete } = SearchContext();
  const { changeInput, getTerm, addToSessionStorage, deleteOldSession } = SearchFunctionContext();

  // test 용 hook

  useEffect(() => {
    console.log(input);
    console.log(searchTermsArray);
    console.log(cachedId);
    console.log(inputDelete);
    deleteOldSession();
  }, []);

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const text = changeInput(e);
    console.log(text);
  };

  const testText = '장';

  const getTermAndAddToCacheStorage = async () => {
    const dataFromDb = await getTerm(testText);
    addToSessionStorage(testText, dataFromDb);
  };

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
        <button type="button" onClick={getTermAndAddToCacheStorage}>
          test button
        </button>
      </div>
    </>
  );
}

export default SearchInput;
