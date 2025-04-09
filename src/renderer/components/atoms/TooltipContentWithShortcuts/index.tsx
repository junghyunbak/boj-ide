import { css } from '@emotion/react';

interface TooltipContentWithShortcutsProps {
  title: string;
  shortCuts: string[];
}

export function TooltipContentWithShortcuts({ title, shortCuts }: TooltipContentWithShortcutsProps) {
  return (
    <p>
      {title}
      <span
        css={(theme) => css`
          color: ${theme.colors.disabledFg};
          padding-left: 0.5rem;
        `}
      >
        {shortCuts.join(' / ')}
      </span>
    </p>
  );
}
