import { css } from '@emotion/css';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/shallow';
import { Endpoints } from '@octokit/types';
import { color } from '../../../styles';
import { useStore } from '../../store';

export function Footer() {
  const [newReleases, setNewReleases] = useState<
    Endpoints['GET /repos/{owner}/{repo}/releases']['response']['data'] | null
  >(null);

  const [oldReleases, setOldReleases] = useStore(useShallow((s) => [s.oldReleases, s.setOldReleases]));

  const [setMessage] = useStore(useShallow((s) => [s.setMessage]));

  const getReleases = async () => {
    const data = (await fetch('https://api.github.com/repos/junghyunbak/boj-ide/releases').then((response) =>
      response.json(),
    )) as Endpoints['GET /repos/{owner}/{repo}/releases']['response']['data'];

    return data;
  };

  useEffect(() => {
    (async () => {
      setNewReleases(await getReleases());
    })();
  }, []);

  const handleReleaseButtonClick = () => {
    if (!newReleases) {
      return;
    }

    setMessage(
      newReleases
        .map((v) => {
          return [`## ${v.name}`, v.body, `[download](${v.html_url})`, '---'].join('\n\n');
        })
        .join('\n\n'),
    );

    setOldReleases(newReleases);
  };

  const isStale = (() => {
    if (!oldReleases || !newReleases) {
      return false;
    }

    const [oldRelease] = oldReleases;
    const [newRelease] = newReleases;

    return oldRelease.id !== newRelease.id;
  })();

  return (
    <div
      className={css`
        width: 100%;
        height: 35px;
        border-top: 1px solid lightgray;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 0.5rem;
        overflow: hidden;
      `}
    >
      <div
        className={css`
          button {
            border: none;
            background-color: transparent;
            font-size: 0.75rem;
            color: ${color.text};
            cursor: pointer;
            padding: 2px 4px;

            &:hover {
              color: ${color.primaryText};
              background-color: rgba(0, 0, 0, 0.1);
            }
          }
        `}
      >
        <button
          type="button"
          onClick={() => {
            window.electron.ipcRenderer.sendMessage('open-source-code-folder');
          }}
        >
          코드 저장소
        </button>

        <button
          type="button"
          onClick={() => {
            window.open('https://boj-ide.gitbook.io/boj-ide-docs', '_blank');
          }}
        >
          메뉴얼
        </button>
      </div>

      <button
        type="button"
        className={css`
          margin: 0;
          font-size: 0.75rem;
          color: ${color.text};
          position: relative;
          border: none;
          background: none;
          cursor: pointer;
          padding: 2px 4px;
          &:hover {
            color: ${color.primaryText};
            background-color: rgba(0, 0, 0, 0.1);
          }
        `}
        onClick={handleReleaseButtonClick}
      >
        {isStale && (
          <div
            className={css`
              position: absolute;
              right: -5px;
              top: -5px;
              width: 15px;
              height: 15px;
              background-color: red;
              border-radius: 9999px;
              color: white;
              display: flex;
              justify-content: center;
              align-items: center;
            `}
          >
            !
          </div>
        )}
        v1.3.7
      </button>
    </div>
  );
}
