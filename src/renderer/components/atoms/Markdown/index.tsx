/* eslint-disable react/no-unstable-nested-components */

import ReactMarkdown from 'react-markdown';
import 'github-markdown-css/github-markdown-light.css';

interface MarkdownProps {
  children: string;
}

export function Markdown({ children }: MarkdownProps) {
  return (
    <ReactMarkdown
      className="markdown-body"
      components={{
        a(props) {
          return <a {...props} target="_blank" />;
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
