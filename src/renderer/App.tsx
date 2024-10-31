import React, { createContext, useEffect, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';

import { vim } from '@replit/codemirror-vim';
import { javascript } from '@codemirror/lang-javascript';
import ReactCodeMirror from '@uiw/react-codemirror';

import { Output } from './components/Output';
import { Layout } from './components/Layout';

import './App.css';

export const problemContext = createContext<ProblemInfo | null>(null);

export const judgeContext = createContext<{
  isJudging: boolean;
  setIsJudging: React.Dispatch<React.SetStateAction<boolean>>;
} | null>(null);

export const codeContext = createContext<{
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
  ext: CodeInfo['ext'];
  setExt: React.Dispatch<React.SetStateAction<string>>;
} | null>(null);

function Hello() {
  const [problemInfo, setProblemInfo] = useState<ProblemInfo | null>(null);

  const [isJudging, setIsJudging] = useState(false);

  const [code, setCode] = useState('');

  const [ext, setExt] = useState<CodeInfo['ext']>('js');

  useEffect(() => {
    window.electron.ipcRenderer.on('load-problem-data', ({ data }) => {
      setProblemInfo(data);
    });

    window.electron.ipcRenderer.on('load-code-result', ({ data }) => {
      setCode(data.code);
    });

    window.electron.ipcRenderer.on('save-code-result', ({ data: { isSaved } }) => {
      alert(isSaved ? '저장이 완료되었습니다.' : '저장에 실패하였습니다.');
    });
  }, []);

  /**
   * 문제 정보가 변경되면 소스코드를 로딩
   */
  useEffect(() => {
    // [ ]: context가 null값을 가지지 않도록 처리?
    if (!problemInfo) {
      return;
    }

    window.electron.ipcRenderer.sendMessage('load-code', { data: { number: problemInfo.number, ext } });
  }, [problemInfo, ext]);

  const handleSaveButtonClick = () => {
    if (!problemInfo) {
      return;
    }

    window.electron.ipcRenderer.sendMessage('save-code', { data: { number: problemInfo.number, ext, code } });
  };

  const handleSubmitButtonClick = () => {
    setIsJudging(true);
  };

  return (
    <codeContext.Provider value={{ code, setCode, ext, setExt }}>
      <problemContext.Provider value={problemInfo}>
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
              <p>{problemInfo?.number || '문제 페이지로 이동하세요.'}</p>

              <button type="button" onClick={handleSaveButtonClick}>
                저장하기
              </button>

              <button type="button" onClick={handleSubmitButtonClick} disabled={isJudging}>
                제출하기
              </button>
            </div>

            <div
              style={{
                width: '100%',
                height: '50%',
                background: 'white',
                overflow: 'hidden',
              }}
            >
              <ReactCodeMirror
                extensions={[javascript(), vim()]}
                value={code}
                onChange={(v) => {
                  setCode(v);
                }}
              />
            </div>

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
