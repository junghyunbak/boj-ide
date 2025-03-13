import { act } from 'react';
import { renderHook } from '@testing-library/react';

import { ThemeProvider } from '@emotion/react';

import { themes } from '@/renderer/styles';

import { useEditor } from '../useEditor';
import { useModifyEditor } from '.';

describe('[Custom Hooks] 에디터 상태 수정 훅', () => {
  it('에디터 내용을 동기화 할 경우, 리렌더링이 발생하지 않아야 한다.', () => {
    const all: any[] = [];

    const { result } = renderHook(
      () => {
        const value = { ...useEditor(), ...useModifyEditor() };
        all.push(value);
        return value;
      },
      { wrapper: ({ children }) => <ThemeProvider theme={themes['baekjoon']}>{children}</ThemeProvider> },
    );

    act(() => {
      result.current.syncEditorCode('');
      result.current.syncEditorCode('1');
      result.current.syncEditorCode('12');
      result.current.syncEditorCode('123');
      result.current.syncEditorCode('1234');
    });

    expect(all.length).toBe(1);
    expect(result.current.getEditorValue()).toBe('1234');
  });
});
