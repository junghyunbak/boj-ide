/* eslint-disable react/no-unstable-nested-components */
import { useEffect, useState } from 'react';

import { css, useTheme } from '@emotion/react';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

import { createHighlighterCore } from 'shiki/dist/core-unwasm.mjs';
import { bundledThemes } from 'shiki/dist/themes.mjs';
import { bundledLanguages } from 'shiki/dist/langs.mjs';
import { createJavaScriptRegexEngine } from 'shiki';

interface MarkdownProps {
  children: string;
}

export function Markdown({ children }: MarkdownProps) {
  const [highlighter, setHighlighter] = useState<Awaited<ReturnType<typeof createHighlighterCore>> | null>(null);
  const emotionTheme = useTheme();

  useEffect(() => {
    (async () => {
      setHighlighter(
        await createHighlighterCore({
          engine: createJavaScriptRegexEngine(),
          themes: [bundledThemes['solarized-dark'], bundledThemes['solarized-light']],
          langs: [bundledLanguages.zsh],
        }),
      );
    })();
  }, []);

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        a(props) {
          return <a {...props} target="_blank" />;
        },
        code(props) {
          // eslint-disable-next-line react/prop-types
          const match = /language-(\w+)/.exec(props?.className || '');

          if (highlighter && match && match[1] === 'zsh') {
            return (
              // eslint-disable-next-line react/no-danger
              <div
                dangerouslySetInnerHTML={{
                  __html: highlighter.codeToHtml(String(props.children).trim(), {
                    lang: match[1],
                    theme: emotionTheme.theme === 'light' ? 'solarized-light' : 'solarized-dark',
                  }),
                }}
                css={(theme) => css`
                  pre {
                    background-color: ${theme.colors.code} !important;
                    border: 1px solid ${theme.colors.border} !important;
                    padding: 2px 4px;
                    border-radius: 4px;

                    code {
                      font-family: hack;
                    }
                  }
                `}
              />
            );
          }

          return (
            <code
              css={(theme) => css`
                background: ${theme.colors.code};
                border: 1px solid ${theme.colors.border};
                padding: 2px 4px;
                border-radius: 4px;
                font-family: hack;
              `}
            >
              {props.children}
            </code>
          );
        },
      }}
      css={(theme) => css`
        img {
          max-width: 100%;
        }

        p {
          margin: 1rem 0;
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
