import { useEffect, useMemo } from 'react';

import { useTheme } from '@emotion/react';

import { EditorState, Prec, type Extension } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import { foldService, indentUnit } from '@codemirror/language';
import { createTheme } from '@uiw/codemirror-themes';
import { indentMore } from '@codemirror/commands';
import { acceptCompletion } from '@codemirror/autocomplete';
import { Vim, getCM, vim } from '@replit/codemirror-vim';
import { javascript } from '@codemirror/lang-javascript';
import { cpp } from '@codemirror/lang-cpp';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';

import { useModifyEditor } from '../useModifyEditor';
import { useProblem } from '../useProblem';
import { useEditor } from '../useEditor';

// TODO: gutter 관련 옵션 커스텀 (강조, 접기)
export function useSetupEditor() {
  const { problem } = useProblem();
  const { editorMode, editorRef, editorCode, editorState, editorFontSize, editorIndentSpace, editorLanguage } =
    useEditor();

  const { saveFile, syncEditorCode, getEditorValue, updateEditorState, updateEditorView } = useModifyEditor();

  const emotionTheme = useTheme();

  const codeExtensions = useMemo<Extension[]>(() => {
    return [
      editorMode === 'vim' && vim(),
      editorLanguage === 'C++14' && cpp(),
      editorLanguage === 'C++17' && cpp(),
      editorLanguage === 'Java11' && java(),
      editorLanguage === 'node.js' && javascript(),
      editorLanguage === 'Python3' && python(),
    ].filter((value) => typeof value === 'object');
  }, [editorLanguage, editorMode]);

  const themeExtensions = useMemo<Extension[]>(() => {
    return [
      EditorView.theme({
        '&': {
          height: '100%',
        },
        '.cm-content': {
          fontSize: `${editorFontSize}px`,
          fontFamily: 'hack',
        },
        '.cm-gutters': {
          fontSize: `${editorFontSize}px`,
          fontFamily: 'hack',
        },
        /**
         * // TODO: extensions로 처리
         */
        '.cm-foldGutter': {
          display: 'none !important',
        },
        '.cm-activeLineGutter': {
          'background-color': 'transparent !important',
        },
      }),
      createTheme({
        theme: emotionTheme.theme,
        settings: emotionTheme.editor.settings,
        styles: emotionTheme.editor.styles,
      }),
    ];
  }, [editorFontSize, emotionTheme]);

  useEffect(() => {
    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        syncEditorCode(update.state.doc.toString());
      }
    });

    const newEditorState = EditorState.create({
      doc: editorCode,
      extensions: [
        Prec.highest(
          keymap.of([
            {
              key: 'Escape',
              run: (editorView) => {
                const cm = getCM(editorView);

                if (cm) {
                  Vim.exitInsertMode(cm);
                }

                return false;
              },
            },
          ]),
        ),
        basicSetup,
        updateListener,
        foldService.of(() => null),
        indentUnit.of(' '.repeat(editorIndentSpace)),
        keymap.of([
          {
            key: 'Tab',
            run: acceptCompletion,
          },
          {
            key: 'Tab',
            run: ({ state, dispatch }) => {
              if (state.selection.ranges.some((r) => !r.empty)) {
                return indentMore({ state, dispatch });
              }

              dispatch(
                state.update(state.replaceSelection(' '.repeat(editorIndentSpace)), {
                  scrollIntoView: true,
                  userEvent: 'input',
                }),
              );

              return true;
            },
          },
        ]),
        keymap.of([
          {
            key: 'Ctrl-s',
            run: () => {
              saveFile();
              return false;
            },
          },
        ]),
        keymap.of([
          {
            key: 'Meta-s',
            run: () => {
              saveFile();
              return false;
            },
          },
        ]),
        ...codeExtensions,
        ...themeExtensions,
      ],
    });

    updateEditorState(newEditorState);
  }, [editorCode, updateEditorState, syncEditorCode, saveFile, codeExtensions, themeExtensions, editorIndentSpace]);

  useEffect(() => {
    if (!editorRef.current) {
      return function cleanup() {};
    }

    const editorView = new EditorView({
      state: editorState,
      parent: editorRef.current,
    });

    updateEditorView(editorView);

    return function cleanup() {
      editorView.destroy();
    };
  }, [editorRef, editorCode, editorState, updateEditorView]);

  /**
   * 문제/언어가 변경되면
   *
   * - 기존 코드 저장
   * - 새로운 코드 로딩
   */
  useEffect(() => {
    if (problem) {
      window.electron.ipcRenderer.invoke('load-code', {
        data: { number: problem.number, language: editorLanguage },
      });
    }

    return function cleanup() {
      saveFile({ problem, language: editorLanguage, silence: true });
    };
  }, [problem, editorLanguage, saveFile, getEditorValue]);
}
