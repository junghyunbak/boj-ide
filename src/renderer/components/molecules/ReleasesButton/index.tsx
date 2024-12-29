import { useState, useEffect } from 'react';
import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';
import { RELEASE_VERSION } from '@/constants';
import { TransparentButton } from '@/renderer/components/atoms/buttons/TransparentButton';
import { Exclamation } from '@/renderer/components/atoms/Exclamation';
import { css } from '@emotion/react';
import { type Endpoints } from '@octokit/types';

export function ReleasesButton() {
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
          return [`## ${v.name}`, v.body, `[다운로드](${v.html_url})`].join('\n\n');
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
      css={css`
        position: relative;
      `}
    >
      <TransparentButton onClick={handleReleaseButtonClick} size="small">{`v${RELEASE_VERSION}`}</TransparentButton>
      <div
        css={css`
          position: absolute;
          right: -5px;
          top: -5px;
        `}
      >
        {isStale && <Exclamation />}
      </div>
    </div>
  );
}
