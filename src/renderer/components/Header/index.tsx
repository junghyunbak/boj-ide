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
import { SubmitButton } from '../core/button/SubmitButton';

export function Header() {
  const [problem] = useStore(useShallow((s) => [s.problem]));
  const [isSetting, setIsSetting] = useStore(useShallow((s) => [s.isSetting, s.setIsSetting]));
  const [setConfirm] = useStore(useShallow((s) => [s.setConfirm]));

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

        <SubmitButton
          type="button"
          secondary
          onClick={() => {
            setConfirm('기존의 코드가 삭제됩니다.\n계속하시겠습니까?', () => {
              if (!problem) {
                return;
              }

              const { lang, setCode } = useStore.getState();

              setCode('');

              window.electron.ipcRenderer.sendMessage('create-input-template', {
                data: { ...problem, language: lang },
              });
            });
          }}
        >
          AI 입력 생성
        </SubmitButton>

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
