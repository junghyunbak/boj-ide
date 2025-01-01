import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';
import { RELEASE_VERSION } from '@/constants';
import { TransparentButton } from '@/renderer/components/atoms/buttons/TransparentButton';
import { type Endpoints } from '@octokit/types';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

type GithubReleases = Endpoints['GET /repos/{owner}/{repo}/releases']['response']['data'];

export function ReleasesButton() {
  const { data: releases } = useQuery({
    queryKey: ['github-releases'],
    queryFn: async () => {
      const { data } = await axios.get<GithubReleases>('https://api.github.com/repos/junghyunbak/boj-ide/releases');

      return data;
    },
  });

  const [setMessage] = useStore(useShallow((s) => [s.setMessage]));

  const handleReleaseButtonClick = () => {
    if (releases) {
      setMessage(
        releases
          .map((v) => {
            return [`## ${v.name}`, v.body, `[다운로드](${v.html_url})`].join('\n\n');
          })
          .join('\n\n'),
      );
    }
  };

  return <TransparentButton onClick={handleReleaseButtonClick} size="small">{`v${RELEASE_VERSION}`}</TransparentButton>;
}
