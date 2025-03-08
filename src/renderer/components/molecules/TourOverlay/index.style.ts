import { zIndex } from '@/renderer/styles';
import styled from '@emotion/styled';

export const TourLayout = styled.div`
  position: fixed;
  inset: 0;
  z-index: ${zIndex.overlay.tourBackground};
`;

export const TourDimmedBox = styled.div`
  position: fixed;
  background: #172334;
  opacity: 0.8;
  z-index: ${zIndex.overlay.tourBackground};
`;

export const TourPopoverLayout = styled.div`
  position: fixed;
  z-index: ${zIndex.overlay.tourPopover};
  padding: 0.5rem;
`;

export const TourPopoverBox = styled.div`
  min-width: 150px;
  min-height: 150px;
  background-color: white;
  box-shadow: 0px 0px 8px 2px rgb(0 0 0 / 10%);
  padding: 1rem;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;
