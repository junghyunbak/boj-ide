/* eslint-disable react/no-unstable-nested-components */
import { css } from '@emotion/react';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface MarkdownProps {
  children: string;
}

export function Markdown({ children }: MarkdownProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        a(props) {
          return <a {...props} target="_blank" />;
        },
      }}
      css={(theme) => css`
        img {
          max-width: 100%;
        }

        p {
          margin: 1rem 0;
        }

        code {
          background: ${theme.colors.code};
          padding: 2px 4px;
          border: 1px solid ${theme.colors.border};
          border-radius: 4px;
          font-family: hack;
        }

        a {
          color: ${theme.colors.primaryfg};
        }
      `}
    >
      {children}
    </ReactMarkdown>
  );
}
