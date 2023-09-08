import styled from 'styled-components';

export const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  min-width: 150px;
  min-height: 150px;
  flex: 1;
`;

// 컨테이너 스타일
export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  position: relative;
  min-height: 4rem;
  min-width: 20rem;
  border: 1px solid;
  border-radius: 1.2rem;
  margin-top: 1rem;
`;

export const Button = styled.button`
  font-size: 1.2rem;
  border-radius: 1.2rem;
  max-height: 1.2rem;
  max-width: 1.2rem;
`;

export const Input = styled.input`
  font-size: 1.2rem;
  min-width: 1.2rem;
  min-height: 1.2rem;
  width: 100%;
`;

export const SearchInputListBox = styled.div`
  position: relative;
`;
