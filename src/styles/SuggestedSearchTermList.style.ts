import { styled } from 'styled-components';

export const ListContainer = styled.div`
  display: flex;
  border: 1px solid;
  justify-content: center;
  flex-direction: column;

  border-top: none;
  border-bottom-left-radius: 1rem;
  border-bottom-right-radius: 1rem;
  position: absolute;
  top: 100%;
  overflow-y: auto;
  width: 100%;
`;

export const TermList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  min-height: 1.2rem;
  margin: 0px 0px 0px 0px;
  padding: 0px;
  flex-grow: auto;
`;

export const TermItem = styled.li`
  display: flex;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 1px;
  padding: 1px;
  flex: 1;
  border-top: 1px solid rgba(0, 0, 0, 0.2);
  font-size: 1.2rem;
  background-color: white;
`;

export const SickName = styled.span``;
