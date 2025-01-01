import { RELEASE_VERSION } from '@/constants';
import { TransparentButton } from '@/renderer/components/atoms/buttons/TransparentButton';
import { type Endpoints } from '@octokit/types';
import { useQuery } from '@tanstack/react-query';
import { useAlertModalController } from '@/renderer/hooks';
import axios from 'axios';

type GithubReleases = Endpoints['GET /repos/{owner}/{repo}/releases']['response']['data'];

export function ReleasesButton() {
  const { data: releases, isError } = useQuery({
    queryKey: ['github-releases'],
    queryFn: async () => {
      const { data } = await axios.get<GithubReleases>('https://api.github.com/repos/junghyunbak/boj-ide/releases');

      return data;
    },
  });

  const { fireAlertModal } = useAlertModalController();

  const handleReleaseButtonClick = () => {
    if (!releases || isError) {
      return;
    }

    const content = releases
      .map((v) => {
        return [`## ${v.name}`, v.body, `[다운로드](${v.html_url})`].join('\n\n');
      })
      .join('\n\n');

    fireAlertModal('Releases', content);
  };

  return <TransparentButton onClick={handleReleaseButtonClick} size="small">{`v${RELEASE_VERSION}`}</TransparentButton>;
}
