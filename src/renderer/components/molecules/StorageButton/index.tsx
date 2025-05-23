import { TransparentButton } from '@/renderer/components/atoms/buttons/TransparentButton';

export function StorageButton() {
  const handleStorageButtonClick = () => {
    window.electron.ipcRenderer.sendMessage('open-source-code-folder', { data: undefined });
  };

  return (
    <TransparentButton size="small" onClick={handleStorageButtonClick}>
      코드 저장소
    </TransparentButton>
  );
}
