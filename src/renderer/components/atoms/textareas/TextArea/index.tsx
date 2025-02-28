import { css } from '@emotion/react';
import { forwardRef } from 'react';
import Color from 'color';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(({ ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      css={(theme) => css`
        width: 100%;
        height: 100%;
        resize: none;
        font-size: 1.125rem;
        line-height: 1.4;
        font-family: 'menlo';
        border: 1px solid ${theme.colors.border};
        background-color: ${theme.colors.code};
        color: ${theme.colors.fg};
        padding: 0.5rem;
        outline: none;
        white-space: nowrap;

        &:disabled {
          background-color: ${Color(theme.colors.code).darken(0.1).toString()};
        }

        &:read-only {
          white-space: pre-wrap;
        }
      `}
      spellCheck="false"
      {...props}
    />
  );
});
