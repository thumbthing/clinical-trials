import React from 'react';
import SearchInput from '../components/SearchInput';
import SuggestedSearchTermList from '../components/SuggestedSearchTermList';

function SearchPage() {
  return (
    <div>
      <SearchInput />
      <SuggestedSearchTermList />
    </div>
  );
}

export default SearchPage;
