export const isProblemTab = (tab: Tab): tab is ProblemInfo => {
  return 'number' in tab;
};

export const isBookmarkTab = (tab: Tab): tab is BookmarkInfo => {
  return 'url' in tab;
};
