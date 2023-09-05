import React from 'react';

function SearchInput() {
  return (
    <div>
      <button type="button">뒤로가기</button>
      <input type="text" placeholder="검색창" />
      <button type="button">input 창 삭제</button>
      <button type="submit">검색하기</button>
    </div>
  );
}

export default SearchInput;
