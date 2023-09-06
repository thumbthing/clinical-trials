
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
- 키보드 만으로 추천 검색어로 이동가능 하도록 구현

```javascript

```

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

- 기존 함수를 `setTimeOut`의 `callback`로 전달하는 함수로 변형 시켜주는 `debounce` 함수 생성
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
- `handleChangeInput` 함수 내에서 `input`의 value 값의 `valid`를 판별하여 (빈값, 자음-모음만 존재)`getTermAndAddToSessionStorage`의 실행 여부를 결정
- `deleteOldTerm`를 선언하여 `state`로 관리되고 있는 과거 검색 기록의 첫번째 요소를 활용하여 `Session Storage`와 `state`를 변겅하는 함수를 선언
- `useEffect`를 통해 캐싱된 검색기록의 `state` 배열을 변경-`Session Storage`에 존재하는 캐싱된 데이터를 일정시간 마다 삭제, dependency array의 변경을 감지하여 지속적으로 삭제하도록 구현

---