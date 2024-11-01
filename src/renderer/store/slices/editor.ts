import { type StateCreator } from 'zustand';

type EditorSlice = {
  code: string;
  setCode: (code: string) => void;

  mode: EditorMode;
  setMode: (mode: EditorMode) => void;

  ext: CodeInfo['ext'];
  setExt: (ext: CodeInfo['ext']) => void;
};

export const createEditorSlice: StateCreator<EditorSlice> = (set): EditorSlice => ({
  code: '',
  setCode(code) {
    set(() => ({ code }));
  },

  mode: 'normal',
  setMode(mode) {
    set(() => ({ mode }));
  },

  ext: 'js',
  setExt(ext) {
    set(() => ({ ext }));
  },
});
