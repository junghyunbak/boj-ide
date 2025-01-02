import { PenButton } from '@/renderer/components/atoms/buttons/PenButton';
import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

export function PaintButton() {
  const [isPaintOpen, setIsPaintOpen] = useStore(useShallow((s) => [s.isPaintOpen, s.setIsPaintOpen]));

  const handleTogglePaintButtonClick = () => {
    setIsPaintOpen(!isPaintOpen);
  };

  return <PenButton onClick={handleTogglePaintButtonClick} />;
}
