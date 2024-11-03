import { useEffect } from 'react';

import { css } from '@emotion/css';

import { useShallow } from 'zustand/shallow';
import { useStore } from './store';

import { Output } from './components/Output';
import { Layout } from './components/Layout';
import { Editor } from './components/Editor';
import { Header } from './components/Header';

export default function App() {
  const [setProblem] = useStore(useShallow((s) => [s.setProblem]));

  const [setJudgeResult] = useStore(useShallow((s) => [s.setJudgeResult]));

  useEffect(() => {
    window.electron.ipcRenderer.on('load-problem-data', ({ data }) => {
      setProblem(data);
      setJudgeResult(() => []);
    });
  }, [setProblem, setJudgeResult]);

  return (
    <Layout>
      <div
        className={css`
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
        `}
      >
        <Header />

        <Editor />

        <Output />
      </div>
    </Layout>
  );
}
