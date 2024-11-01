import { useEffect } from 'react';

import { useShallow } from 'zustand/shallow';
import { useStore } from './store';

import { Output } from './components/Output';
import { Layout } from './components/Layout';
import { Editor } from './components/Editor';
import { Header } from './components/Header';

import './App.css';

export default function App() {
  const [setProblem] = useStore(useShallow((s) => [s.setProblem]));

  useEffect(() => {
    window.electron.ipcRenderer.on('load-problem-data', ({ data }) => {
      setProblem(data);
    });
  }, [setProblem]);

  return (
    <Layout>
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Header />

        <Editor />

        <Output />
      </div>
    </Layout>
  );
}
