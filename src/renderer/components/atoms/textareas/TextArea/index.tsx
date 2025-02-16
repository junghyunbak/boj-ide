import { css } from '@emotion/react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function TextArea({ ...props }: TextAreaProps) {
  return (
    <textarea
      css={css`
        width: 50%;
        min-height: 100px;
        resize: vertical;
        font-size: 1.125rem;
        line-height: 1.4;
        font-family: 'menlo';
        border: 1px solid lightgray;
        background-color: #f7f7f9;
        padding: 0.5rem;
        outline: none;
        white-space: nowrap;
        &:disabled {
          background-color: #eee;
        }
      `}
      {...props}
    />
  );
}
