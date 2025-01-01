import { css } from '@emotion/react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function TextInput({ value, onChange }: TextInputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      css={css`
        width: 100%;
        border: 1px solid lightgray;
        background-color: white;
        padding: 0.5rem;
        outline: none;
      `}
      placeholder="문제 번호"
    />
  );
}
