import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { SettingButton } from '@/renderer/components/atoms/buttons/SettingButton';

export function SettingToggleButton() {
  const [isSetting, setIsSetting] = useStore(useShallow((s) => [s.isSetting, s.setIsSetting]));

  const handleToggleButtonClick = () => {
    setIsSetting(!isSetting);
  };

  return <SettingButton onClick={handleToggleButtonClick} />;
}
