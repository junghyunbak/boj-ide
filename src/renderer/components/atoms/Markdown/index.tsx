/* eslint-disable react/no-unstable-nested-components */

import { color } from '@/styles';
import { css } from '@emotion/react';
import ReactMarkdown from 'react-markdown';

interface MarkdownProps {
  children: string;
}

export function Markdown({ children }: MarkdownProps) {
  return (
    <ReactMarkdown
      components={{
        h1(props) {
          return (
            <div className="headline">
              <h1 {...props} />
            </div>
          );
        },
        h2(props) {
          return (
            <div className="headline">
              <h2 {...props} />
            </div>
          );
        },
        a(props) {
          return <a {...props} target="_blank" />;
        },
      }}
      css={css`
        h1,
        h2,
        h3 {
          font-weight: 500;
          padding-bottom: 0.3125rem;
        }

        h3 {
          margin: 1rem 0;
        }

        .headline {
          box-sizing: border-box;
          border-bottom: 1px dotted #eee;
          padding-top: 1rem;

          h1,
          h2 {
            margin: 0 0 -2px 0;
            display: inline-block;
            border-bottom: 2px solid ${color.primaryText};
          }
        }

        img {
          width: 100%;
        }

        a {
          color: ${color.primaryText};
          text-decoration: none;

          &:hover {
            text-decoration: underline;
          }
        }

        code {
          background-color: rgba(0, 0, 0, 0.1);
          padding: 0.1563rem;
          font-family: open-sans;
          font-size: 0.75rem;
          line-height: 0.75rem;
          display: inline-block;
        }
      `}
    >
      {children}
    </ReactMarkdown>
  );
}
