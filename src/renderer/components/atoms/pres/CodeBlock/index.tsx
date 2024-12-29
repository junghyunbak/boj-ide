import { css } from '@emotion/react';

interface CodeBlockProps {
  children?: string;
}

export function CodeBlock({ children }: CodeBlockProps) {
  return (
    <pre
      css={css`
        width: 50%;
        padding: 0.5rem;
        margin: 0;
        background-color: #f7f7f9;
        border: 1px solid lightgray;
        overflow-x: scroll;
        font-size: 1.125rem;
        font-family: 'menlo';
        line-height: 1.4;
      `}
    >
      {children}
    </pre>
  );
}
