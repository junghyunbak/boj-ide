import { SettingButton } from '@/renderer/components/atoms/buttons/SettingButton';
import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

export function SettingToggleButton() {
  const [isSetting, setIsSetting] = useStore(useShallow((s) => [s.isSetting, s.setIsSetting]));

  const handleToggleButtonClick = () => {
    setIsSetting(!isSetting);
  };

  return <SettingButton onClick={handleToggleButtonClick} />;
}
