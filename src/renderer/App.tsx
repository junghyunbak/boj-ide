import React, { createContext, useEffect, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';

import { Layout } from './components/Layout';

import './App.css';
import { Output } from './components/Output';

type ProblemData = {
  problemNumber: number;
  inputs: string[];
  outputs: string[];
};

type Ext = 'js' | 'cpp';

export const problemContext = createContext<ProblemData | null>(null);

export const judgeContext = createContext<{
  isJudging: boolean;
  setIsJudging: React.Dispatch<React.SetStateAction<boolean>>;
} | null>(null);

export const codeContext = createContext<{
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
  ext: Ext;
  setExt: React.Dispatch<React.SetStateAction<string>>;
} | null>(null);

function Hello() {
  const [problemData, setProblemData] = useState<ProblemData | null>(null);

  const [isJudging, setIsJudging] = useState(false);

  const [code, setCode] = useState('');

  const [ext, setExt] = useState<Ext>('js');

  useEffect(() => {
    window.electron.ipcRenderer.on(
      'load-problem-data',
      (problemData: ProblemData) => {
        setProblemData(problemData);
      },
    );
  }, []);

  return (
    <codeContext.Provider value={{ code, setCode, ext, setExt }}>
      <problemContext.Provider value={problemData}>
        <judgeContext.Provider value={{ isJudging, setIsJudging }}>
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p>{problemData?.problemNumber || '문제 페이지로 이동하세요.'}</p>
              <button
                type="button"
                disabled={isJudging}
                onClick={() => {
                  setIsJudging(true);
                }}
              >
                제출하기
              </button>
            </div>

            <textarea
              style={{ height: '50%', width: '100%' }}
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />

            <Output />
          </div>
        </judgeContext.Provider>
      </problemContext.Provider>
    </codeContext.Provider>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Hello />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}
