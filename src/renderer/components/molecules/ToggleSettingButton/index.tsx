import { useCallback } from 'react';

import { useModifySetting, useSetting } from '@/renderer/hooks';

import { SettingButton } from '@/renderer/components/atoms/buttons/SettingButton';

export function ToggleSettingButton() {
  const { isSetting } = useSetting();
  const { updateIsSetting } = useModifySetting();

  const handleToggleButtonClick = useCallback(() => {
    updateIsSetting(!isSetting);
  }, [isSetting, updateIsSetting]);

  return <SettingButton onClick={handleToggleButtonClick} />;
}
