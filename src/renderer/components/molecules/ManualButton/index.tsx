import { TransparentButton } from '@/renderer/components/atoms/buttons/TransparentButton';

export function ManualButton() {
  const handleManualButtonClick = () => {
    window.open('https://boj-ide.gitbook.io/boj-ide-docs', '_blank');
  };

  return (
    <TransparentButton size="small" onClick={handleManualButtonClick}>
      메뉴얼
    </TransparentButton>
  );
}
