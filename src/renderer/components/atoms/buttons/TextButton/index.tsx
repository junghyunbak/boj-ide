import { color } from '@/renderer/styles';
import { css } from '@emotion/react';

interface TextButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  testId?: string;
}

export function TextButton({ testId, ...props }: TextButtonProps) {
  return (
    <button
      type="button"
      css={css`
        border: none;
        background: none;
        color: ${color.primaryText};
        padding: 0;
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
      `}
      {...props}
      data-testid={testId}
    />
  );
}
