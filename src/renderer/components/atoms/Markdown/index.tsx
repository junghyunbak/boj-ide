/* eslint-disable react/no-unstable-nested-components */

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

import 'github-markdown-css/github-markdown-light.css';

interface MarkdownProps {
  children: string;
}

export function Markdown({ children }: MarkdownProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
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
