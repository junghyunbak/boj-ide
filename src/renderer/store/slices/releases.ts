import { type StateCreator } from 'zustand';
import { type Endpoints } from '@octokit/types';

type ReleasesSlice = {
  oldReleases: Endpoints['GET /repos/{owner}/{repo}/releases']['response']['data'] | null;
  setOldReleases: (releases: Endpoints['GET /repos/{owner}/{repo}/releases']['response']['data']) => void;
};

export const createReleasesSlice: StateCreator<ReleasesSlice> = (set): ReleasesSlice => ({
  oldReleases: null,
  setOldReleases(releases) {
    set(() => ({ oldReleases: releases }));
  },
});
