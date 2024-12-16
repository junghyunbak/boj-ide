import { css } from '@emotion/react';
import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { color, size } from '@/styles';
import { SaveCodeButton } from './SaveCodeButton';
import { ExecuteCodeButton } from './ExecuteCodeButton';
import { SubmitCodeButton } from './SubmitCodeButton';
import { ToggleLanguage } from './ToggleLanguage';
import { AICreateButton } from './AICreateButton';

export function Header() {
  const [isSetting, setIsSetting] = useStore(useShallow((s) => [s.isSetting, s.setIsSetting]));

  return (
    <div
      css={css`
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        border-bottom: 1px solid lightgray;
        height: ${size.EDITOR_HEADER_HEIGHT}px;
        min-height: ${size.EDITOR_HEADER_HEIGHT}px;
        color: ${color.text};
        padding: 0 0.5rem;
      `}
    >
      <div>
        <ToggleLanguage />
      </div>

      <div
        css={css`
          display: flex;
          align-items: center;
          gap: 0.5rem;
          height: 100%;
        `}
      >
        <button
          type="button"
          onClick={() => {
            setIsSetting(!isSetting);
          }}
          css={css`
            border: 0;
            background: none;
            color: gray;
            cursor: pointer;
          `}
        >
          <FontAwesomeIcon size="xl" icon={faGear} />
        </button>

        <AICreateButton />
        <SaveCodeButton />
        <ExecuteCodeButton />
        <div
          css={css`
            border-left: 1px solid lightgray;
            height: 100%;
          `}
        />
        <SubmitCodeButton />
      </div>
    </div>
  );
}
