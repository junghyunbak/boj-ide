import { css } from '@emotion/react';

interface SearchListProps extends React.PropsWithChildren {
  listType: '최근 항목' | '검색 결과';
}

export function SearchList({ listType, children }: SearchListProps) {
  return (
    <div
      css={(theme) => css`
        margin: 0;
        padding: 0;

        display: flex;
        flex-direction: column;

        position: relative;

        &:not(:first-child) {
          border-top: 1px solid ${theme.colors.primaryfg};
          padding-top: 4px;
          margin-top: 4px;

          &::before {
            content: '${listType}';
            position: absolute;
            top: 0;
            right: 30px;
            color: ${theme.colors.primaryfg};
          }
        }
      `}
    >
      {children}
    </div>
  );
}
