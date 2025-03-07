import { css } from '@emotion/react';

interface CodeBlockProps {
  children?: string;
}

export function CodeBlock({ children }: CodeBlockProps) {
  return (
    <pre
      css={(theme) => css`
        width: 100%;
        height: 100%;

        padding: 0.5rem;
        margin: 0;

        background-color: ${theme.colors.code};

        border: 1px solid ${theme.colors.border};

        font-size: 1.125rem;
        font-family: 'menlo';
        line-height: 1.4;

        overflow-x: scroll;
      `}
    >
      {children}
    </pre>
  );
}
