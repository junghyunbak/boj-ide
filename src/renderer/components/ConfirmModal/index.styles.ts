import styled from '@emotion/styled';
import { color } from '@/styles';

export const ConfirmModalLayout = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  position: absolute;
  inset: 0;
`;

export const ConfirmModalContentBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  background-color: white;

  padding: 1rem;

  border: 1px solid lightgray;
`;

export const ConfirmModalMessagePre = styled.pre`
  text-align: center;
  margin: 0;
  color: ${color.text};
`;

export const ConfirmModalYesOrNoBox = styled.div`
  display: flex;
  gap: 0.5rem;
`;
