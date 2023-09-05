import React from 'react';
import SearchInput from '../components/SearchInput';
import SuggestedSearchTermList from '../components/SuggestedSearchTermList';
import { SearchProvider } from '../context/SearchContext';
import { FunctionContext } from '../context/FunctionContext';

function SearchPage() {
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
