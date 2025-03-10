import { useModifyTour } from '@/renderer/hooks';

import { TransparentButton } from '@/renderer/components/atoms/buttons/TransparentButton';

export function TourButton() {
  const { openTourStep } = useModifyTour();

  return (
    <TransparentButton size="small" onClick={() => openTourStep()}>
      가이드
    </TransparentButton>
  );
}
