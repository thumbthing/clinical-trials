import React, { useEffect } from 'react';
import SearchInput from '../components/SearchInput';
import SuggestedSearchTermList from '../components/SuggestedSearchTermList';
import { SearchProvider } from '../context/SearchContext';
import { FunctionContext } from '../context/FunctionContext';

function SearchPage() {
  // 캐싱 되어 있는 데이터 초기화

  useEffect(() => {
    sessionStorage.clear();
  }, []);
  return (
    <SearchProvider>
      <FunctionContext>
        <div>
          <SearchInput />
          <SuggestedSearchTermList />
        </div>
      </FunctionContext>
    </SearchProvider>
  );
}

export default SearchPage;
