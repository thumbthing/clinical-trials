
# clinical-trials

---

## 기능

1. 검색 창 구현

2. 검색어 추천  
    - API 호출에 따른 검색어 추천 기능
3. API 호출별로 로컬 캐싱

---

## 실행 방법

---

```shell
git clone https://github.com/thumbthing/clinical-trials.git 
npm install
npm start
```

`로컬 api server`  
[클릭시 repository로 이동합니다](https://github.com/walking-sunset/assignment-api)

---

## 프로젝트 구조

```shell
├── App.tsx
├── api
│   └── client.ts
├── components
│   ├── SearchInput.tsx
│   └── SuggestedSearchTermList.tsx
├── context
│   ├── FunctionContext.tsx
│   └── SearchContext.tsx
├── index.tsx
├── pages
│   └── SearchPage.tsx
├── react-app-env.d.ts
├── reportWebVitals.ts
├── setupTests.ts
├── styles
│   ├── SearchInput.style.ts
│   └── SuggestedSearchTermList.style.ts
├── types
│   └── context.type.ts
└── utils
    ├── checkInputTextValid.ts
    ├── debounce.ts
    ├── errorHandler.ts
    └── sessionHandler.ts

```

---

## Commit convention

| Type 키워드 | 사용 시점                                                             |
| ----------- | --------------------------------------------------------------------- |
| Feat        | 새로운 기능 추가                                                      |
| Fix         | 버그 수정                                                             |
| Docs        | 문서 수정                                                             |
| Style       | 코드 스타일 변경 (코드 포매팅, 세미콜론 누락 등)기능 수정이 없는 경우 |
| Design      | 사용자 UI 디자인 변경 (CSS 등)                                        |
| Test        | 테스트 코드, 리팩토링 테스트 코드 추가                                |
| Refactor    | 코드 리팩토링                                                         |
| Build       | 빌드 파일 수정                                                        |
| Ci          | CI 설정 파일 수정                                                     |
| Chore       | 빌드 업무 수정, 패키지 매니저 수정 (gitignore 수정 등)                |
| Rename      | 파일 혹은 폴더명을 수정만 한 경우                                     |
| Remove      | 파일을 삭제만 한 경우                                                 |

---

### 사용 라이브러리

- React
- Typescript
- eslint
- prettier
- react-router-dom
- styled-components
- axios
- husky

---

### UI

- 방향키로 연관 검색어 선택

```javascript
// input component
  const ArrowKeyHandle = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      e.stopPropagation();
      const isSuggestedTermExist = state.searchTermsArray.length !== 0;
      if (isSuggestedTermExist) {
        setState((prevState) => ({
          ...prevState,
          isSelectingSuggestedTerms: true,
        }));
      }
    }
  };
```

```javascript
// suggested Term List component
const { state, setState } = SearchContext();
  const { input, searchTermsArray, selectedItemIndex, isSelectingSuggestedTerms } = state;

  const listRef = useRef<HTMLUListElement | null>(null);
  const focusRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    if (isSelectingSuggestedTerms && selectedItemIndex === -1) {
      setState((prev) => ({ ...prev, selectedItemIndex: 0 }));
    }
  }, [isSelectingSuggestedTerms]);

  const KeyEventAction: KeyEventActiontType = {
    ArrowDown: () => {
      if (searchTermsArray.length === 0 || listRef.current === null) {
        return null;
      }
      if (listRef.current.childElementCount === selectedItemIndex + 1) {
        setState((prevState) => ({
          ...prevState,
          selectedItemIndex: 0,
        }));
      }
      if (selectedItemIndex === -1) {
        setState((prevState) => ({
          ...prevState,
          selectedItemIndex: 0,
        }));
      } else {
        setState((prevState) => ({
          ...prevState,
          selectedItemIndex: selectedItemIndex + 1,
        }));
      }
      return null;
    },
    ArrowUp: () => {
      if (selectedItemIndex <= 0) {
        setState((prevState) => ({
          ...prevState,
          isSelectingSuggestedTerms: false,
          selectedItemIndex: -1,
        }));
      } else {
        setState((prevState) => ({
          ...prevState,
          selectedItemIndex: prevState.selectedItemIndex - 1,
        }));
      }
      return null;
    },
    Escape: () => {
      setState((prevState) => ({
        ...prevState,
        isSelectingSuggestedTerms: false,
        selectedItemIndex: -1,
      }));
    },
    Enter: () => {
      setState((prevState) => ({
        ...prevState,
        isSelectingSuggestedTerms: false,
        selectedItemIndex: -1,
      }));
    },
  };

  const handleKeyUP = (e: React.KeyboardEvent) => {
    e.preventDefault();
    const keyInserted = e.key as KeyEventType;

    if (KeyEventAction[keyInserted]) {
      KeyEventAction[keyInserted]();
    }
    return null;
  };

  useEffect(() => {
    if (focusRef?.current) {
      focusRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      focusRef.current.focus();
    }
    if (selectedItemIndex <= -1) {
      focusRef.current?.blur();
    }
  }, [selectedItemIndex]);

  ...
    return (
    <ListContainer>
      <TermList ref={listRef}>
        {searchTermsArray.map((item, index) => (
          <TermItem
            key={item.sickCd}
            tabIndex={0}
            ref={index === selectedItemIndex ? focusRef : null}
            onKeyUp={(e) => handleKeyUP(e)}
          >
            {index} : {item.sickNm}
          </TermItem>
        ))}
      </TermList>
    </ListContainer>
  );

```

1. `input component`

- `input` 컴포넌트에서 검색어 입력 후 방향키`ArrowDown` 입력시 연관 검색어 리스트로 포커싱 이동
- 검색 목록이 존재하지 않을 경우 `input`에서 `ArrowDown` 입력을 무시

2. `Searched term list component`

- `ArrowDown` `ArrowUp` `Escape` `Enter`의 키보드 입력을 감지해서 `selectedItemIndex`와 `isSelectingSuggestedTerms`의 state를 관리
- `state`로 관리되고 있는 `selectedItemIndex`를 참조하여 `ref`를 list에 추가
- 포커싱이 list의 최상단 이상으로 이동하려고 할때 list의 포커싱을 해제

---

### API

```javascript
// debounce 
import { ChangeEvent } from 'react';

/* eslint-disable no-unused-vars */
const debounceFunction = (callback: (args: ChangeEvent<HTMLInputElement>) => Promise<string>, delay: number) => {
  let timer: ReturnType<typeof setTimeout>;

  return (args: ChangeEvent<HTMLInputElement>) => {
    return new Promise<string>((resolve) => {
      clearTimeout(timer);
      timer = setTimeout(async () => {
        const result = await callback(args);
        resolve(result);
      }, delay);
    });
  };
};

export default debounceFunction;
```

```javascript
// input value

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

```

```javascript
// changeInput
const changeInput = (event: ChangeEvent<HTMLInputElement>): Promise<string> => {
  return new Promise((resolve) => {
    const text = event.target.value;
    resolve(text);
  });
};

```

- 기존 함수를 `setTimeOut`의 `callback`으로 전달하는 함수로 변형 시켜주는 `debounce` 함수 생성
- `input` `change`시 `value` 값을 서버로 전달하는 과정을 delay 시켜서 즉각적인 변화를 제어
- 기능 구현시 `return`을 원시 타입으로 지정 했으나 `setTimeout`의 지연 작동으로 인해 변수의 값 할당에서 지속적인 에러가 발생하여서 `Promise`를 `return`하도록 변경 후 `await`로 지연 작동을 헨들링

---

### Caching

```javascript
// Function Context

const changeInput = (event: ChangeEvent<HTMLInputElement>): Promise<string> => {
  ...
};

const getTerm = async (searchText: string) => {
  ...
};

const addToSessionStorage = async (searchText: string, reponseData: SickArray[]) => {
  try {
    await sessionHandler(searchText, reponseData);
  } catch (error) {
    handleError(error);
  }
};

const deleteOldSession = async (key: string) => {
  try {
    await sessionStorage.removeItem(key);
  } catch (error) {
    handleError(error);
  }
};

const defaultFunction: FunctionType = {
  ...
};

const FunctionProviderContext = createContext<FunctionType>(defaultFunction);
export const SearchFunctionContext = () => useContext(FunctionProviderContext);

export function FunctionContext({ children }: { children: ReactNode }) {
  const MemorizedFunction = useMemo<FunctionType>(() => {
    return defaultFunction;
  }, []);

  return <FunctionProviderContext.Provider value={MemorizedFunction}>{children}</FunctionProviderContext.Provider>;
}
```

```javascript
// State Context

const defaultState: StateType = {
  ...
};

const StateContext = createContext<
  | {
      state: StateType;
      setState: React.Dispatch<React.SetStateAction<StateType>>;
    }
  | undefined
>(undefined);

export const SearchContext = () => {
 ...
};

export function SearchProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StateType>(defaultState);
  const memorizedState = useMemo(() => ({ state, setState }), [state]);

  return <StateContext.Provider value={memorizedState}>{children}</StateContext.Provider>;
}
```

```javascript
// page
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
```

```javascript
// sessionHandler
const sessionHandler = async (inputText: string, termResult: SickArray[]) => {
  try {
    const serializedData = JSON.stringify(termResult);
    sessionStorage.setItem(inputText, serializedData);
  } catch (error) {
    handleError(error);
  }
};

export default sessionHandler;
```

- Context를 `State`, `Function`으로 관심사를 분리하여 구성
- `Function Context`로 관리되는 함수(`getTerm`, `addToSessionStorage`, `deleteOldSession`)을 context를 활용하는 `Component`에서 비동기로 실행
- `Session Storage`에 데이터를 저장하기 위해 포멧팅하는 기능은 관심사 분리를 통해 별도의 파일에 구현
- 

```javascript
// input component

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
        setState((prevState) => ({ ...prevState, cachedId: newCachedArray }));
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleChangeInput = async (e: ChangeEvent<HTMLInputElement>) => {
    ...
     if (formatedText && inputValid) {
        setState((prevState) => ({ ...prevState, input: formatedText }));
        await getTermAndAddToSessionStorage(text);
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
    setTimeout(() => deleteOldTerm(), 10000);
  }, [state.cachedId]);

  return (
    <div>
      <button type="button">뒤로가기</button>
      <input type="text" onChange={handleChangeInput} placeholder="검색창" />
      <button type="button">input 창 삭제</button>
      <button type="submit">검색하기</button>
    </div>
  );
}

export default SearchInput;

```

- DB로부터 받은 값의 `valid`를 판별하여 (response의 길이, 중복된 검색기록) `Function Context`로 관리되는 함수들을 활용하여 캐싱하는 `getTermAndAddToSessionStorage` 구현

- `getTermAndAddToSessionStorage`: (`state`와 `SessionStorage`에 데이터를 저장)
  - db로 데이터를 요청
  - db 요청에 사용된 param으로 기존에 검색 기록`state(cachedId)`이 존재하는지 검사
  - db에서 받은 데이터가 유효한지 검사
  - 두개의 조건을 충족할때 데이터를 `SessionStorage`와 `state`에, param을 `state(cachedId)` 에 저장

- `deleteOldTerm`: (`state`와 `SessionStorage`에 데이터를 삭제)
  - `state(cachedId)`의 첫번째 요소를 확인
  - 추출된 요소를 활용하여 `SessionStorage`에서 삭제
  - 추출된 요소를 `filter()`하여 생성한 새로울 배열을 활용하여 `state(cachedId)`를 최신화
  - `useEffect`와 `setTimeout`을 활용하여 `deleteOldTerm`을 일정한 시간으로 호출

- `handleChangeInput`:
  - 함수 내에서 `input`의 value 값의 `valid`를 판별하여 (빈값, 자음-모음만 존재)`getTermAndAddToSessionStorage`의 실행 여부를 결정

---
session storage 선정 이유

1. 인증이 필요없는 단순 정보 제공 웹 어플리케이션이기 때문에 검색 기록을 브라우저 종료 후에도 남겨 놓을 필요성이 현저히 떨어진다 판단됨
2.

---

### Context

```javascript
// State Context

import React, { ReactNode, createContext, useContext, useMemo, useState } from 'react';
import { StateType } from '../types/context.type';

const defaultState: StateType = {
  input: '',
  searchTermsArray: [],
  cachedId: [],
  inputDelete: false,
  selectedItemIndex: -1,
  isSelectingSuggestedTerms: false,
};

const StateContext = createContext<
  | {
      state: StateType;
      setState: React.Dispatch<React.SetStateAction<StateType>>;
    }
  | undefined
>(undefined);

export const SearchContext = () => {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

export function SearchProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StateType>(defaultState);
  const memorizedState = useMemo(() => ({ state, setState }), [state]);

  return <StateContext.Provider value={memorizedState}>{children}</StateContext.Provider>;
}

```

```javascript
// State Context
import React, { ChangeEvent, ReactNode, createContext, useContext, useMemo } from 'react';
import { FunctionType, SickArray } from '../types/context.type';
import handleError from '../utils/errorHandler';
import { getSearchTerms } from '../api/client';
import { sessionHandler } from '../utils/sessionHandler';

const changeInput = (event: ChangeEvent<HTMLInputElement>): Promise<string> => {
  return new Promise((resolve) => {
    const text = event.target.value;
    resolve(text);
  });
};

const getTerm = async (searchText: string) => {
  try {
    const response = await getSearchTerms(searchText);
    if (response?.status !== 200) {
      throw new Error('fail to get term');
    }
    const result = response?.data;
    return result;
  } catch (error) {
    handleError(error);
    return null;
  }
};

const addToSessionStorage = async (searchText: string, reponseData: SickArray[]) => {
  try {
    await sessionHandler(searchText, reponseData);
  } catch (error) {
    handleError(error);
  }
};

const deleteOldSession = async (key: string) => {
  try {
    await sessionStorage.removeItem(key);
  } catch (error) {
    handleError(error);
  }
};

const defaultFunction: FunctionType = {
  changeInput,
  getTerm,
  addToSessionStorage,
  deleteOldSession,
};
const FunctionProviderContext = createContext<FunctionType>(defaultFunction);
export const SearchFunctionContext = () => useContext(FunctionProviderContext);

export function FunctionContext({ children }: { children: ReactNode }) {
  const MemorizedFunction = useMemo<FunctionType>(() => {
    return defaultFunction;
  }, []);

  return <FunctionProviderContext.Provider value={MemorizedFunction}>{children}</FunctionProviderContext.Provider>;
}

```

### `component`에서 공통으로 사용될 `state`와 `function`이 관심사를 분리

---

#### `state context`

공통적인 데이터를 선언후 `Child Component`들에서 공유  

>  - `input`, `searchTermsArray`, `cachedId`, `inputDelete`, `selectedItemIndex`, `isSelectingSuggestedTerms`

---

#### `function context`

 `Child Component`에서 공통적으로 사용될 DB의 I/O 와 브라우저 cache의 I/O 선언

>  - `changeInput: (event: ChangeEvent<HTMLInputElement>) => Promise<string>;`
>    - 직접 호출해서 사용하지 않고 `debounce`의 `callback`의 요소로 활용
>    - 지연작동을 헨들링하기 위해 return을 `Promise`로 설정
>  - `getTerm: (searchText: string) => Promise<SickArray[]>;`
>    - DB의 직접적인 I/O 기능을 선언
>  - `addToSessionStorage: (searchText: string, responseData: SickArray[]) => Promise<void>;`
>  - `deleteOldSession: (key: string) => void;`
>    - 브라우저의 직접적인 Caching I/O 기능을 선언

---

state, function의 context 사용, 분리 이유

 동일한 state를 사용하는 Child Component들이 존재 할 경우에 Parent Component로 부터 props drilling을 해야한다. 하지만 state의 변경이 일어났을 경우 Parent Component의 모든 Child Component 리렌더링 되어서 불필요한 리렌더링이 발생할 수 밖에 없고, Child Component에 또다른 하위 Component가 존재하고 단순히 props를 전달만 하는 구조라고 한다면 코드의 복잡성이 높아지는 문제가 발생한다.  

  따라서 Context API를 적용해서 props drilling을 해결하기로 결정했다.
   
  필요한 state를 선별하고 구조를 잡는 과정에서 Child Component들에서 공통적으로 작동해야하는 기능들이 존재한다는 것을 알게 되었다 .
  
  하지만 state와 기능을 한 곳에서 관리하는 것은 복잡도가 상승된다고 판단하여 관심사 분리를 통해 state만 관리하는 context, 기능만 관리하는 context로 분리하였다.

  기능을 관리하는 context의 경우 단순한 DB, Cache I/O와 사용자 입력값을 출력하는 함수들로만 구성했고, Child Component에서 이 함수들을 가져와서 좀 더 발전된 기능을 하는 새로운 함수를 선언하는 방식으로 설계했다.

---

### etc

```javascript
// error handler

const handleError = (error: Error | unknown) => {
  let errorMessage = 'Unknown Error';

  if (error instanceof Error) {
    errorMessage = `Occurred Error: ${error.message}`;
  } else {
    const UnoccurredErrorMessage = error as Error;
    errorMessage = `Unoccurred Error: ${UnoccurredErrorMessage.message}`;
  }
  alert(errorMessage);
};
export default handleError;

```

비동기로 작동하는 함수들에서 발생한 에러들을 처리하기 위한 로직