import { act } from 'react';
import { renderHook } from '@testing-library/react';
import { z } from 'zod';

import { createMockProblem } from '@/renderer/mock';

import { useModifyEditor } from '.';

const mockProblem = createMockProblem();

const languageSchema = z.union([
  z.literal('C++14'),
  z.literal('C++17'),
  z.literal('Python3'),
  z.literal('node.js'),
  z.literal('java11'),
]);

const saveCodeSchema = z.object({
  data: z.object({
    number: z.string(),
    language: languageSchema,
    code: z.string(),
  }),
});

const saveDefaultCodeSchema = z.object({
  data: z.object({
    language: languageSchema,
    code: z.string(),
  }),
});

const DEFAULT_FILE_DATA = '데이터';
const INITIAL_FILE_DATA = '초기화코드';

const problemData: Record<string, string> = {
  [mockProblem.number]: DEFAULT_FILE_DATA,
};

const problemDefaultData: Partial<Record<z.infer<typeof languageSchema>, string>> = {
  'C++14': INITIAL_FILE_DATA,
};

beforeAll(() => {
  window.electron = {
    platform: 'win32',
    ipcRenderer: {
      on(channel, listener) {
        return () => {};
      },
      once(channel, func) {},
      sendMessage(channel, message) {},
      async invoke(channel, message) {
        switch (channel) {
          case 'save-default-code': {
            try {
              const parseMessage = saveDefaultCodeSchema.parse(message);

              problemDefaultData[parseMessage.data.language] = parseMessage.data.code;

              return { data: { isSaved: true } };
            } catch (e) {
              return { data: undefined };
            }
          }
          case 'save-code': {
            try {
              const parseMessage = saveCodeSchema.parse(message);

              problemData[parseMessage.data.number] = parseMessage.data.code;

              return { data: { isSaved: true } };
            } catch (e) {
              return { data: undefined };
            }
          }

          default:
            return { data: undefined };
        }
      },
    },
  };
});

describe('[Custom Hooks] useModifyEditor', () => {
  describe('코드 저장', () => {
    beforeEach(() => {
      const { result } = renderHook(() => useModifyEditor());

      const { updateEditorValue } = result.current;

      act(() => {
        updateEditorValue(mockProblem, 'C++14', '변경');
      });
    });

    it('문제가 존재하지 않으면, 코드가 저장되지 않아야한다.', () => {
      const { result } = renderHook(() => useModifyEditor());

      const { saveCode, saveDefaultCode } = result.current;

      act(() => {
        saveCode(null, 'C++14');
        saveDefaultCode(null, 'C++14');
      });

      expect(problemData[mockProblem.number]).toBe(DEFAULT_FILE_DATA);
      expect(problemDefaultData['C++14']).toBe(INITIAL_FILE_DATA);
    });

    it('문제가 존재하고, 에디터의 코드가 존재하면, 코드가 저장되어야 한다.', () => {
      const { result } = renderHook(() => useModifyEditor());

      const { saveCode, saveDefaultCode } = result.current;

      act(() => {
        saveCode(mockProblem, 'C++14');
        saveDefaultCode(mockProblem, 'C++14');
      });

      expect(problemData[mockProblem.number]).toBe('변경');
      expect(problemDefaultData['C++14']).toBe('변경');
    });

    it('문제가 존재하고, 에디터의 코드가 공백이더라도, 코드가 저장되어야 한다.', () => {
      const { result } = renderHook(() => useModifyEditor());

      const { saveCode, saveDefaultCode, updateEditorValue } = result.current;

      act(() => {
        updateEditorValue(mockProblem, 'C++14', '');
        saveCode(mockProblem, 'C++14');
        saveDefaultCode(mockProblem, 'C++14');
      });

      expect(problemData[mockProblem.number]).toBe('');
      expect(problemDefaultData['C++14']).toBe('');
    });
  });
});
