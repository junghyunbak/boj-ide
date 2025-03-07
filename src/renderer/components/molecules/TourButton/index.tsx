import { TransparentButton } from '@/renderer/components/atoms/buttons/TransparentButton';
import { useTour } from '@/renderer/hooks/useTour';

export function TourButton() {
  const { openTourStep } = useTour();

  return (
    <TransparentButton size="small" onClick={() => openTourStep()}>
      가이드
    </TransparentButton>
  );
}
