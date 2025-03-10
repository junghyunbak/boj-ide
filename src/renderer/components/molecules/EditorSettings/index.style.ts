import styled from '@emotion/styled';

export const SettingLayout = styled.div`
  width: 100%;
  height: 100%;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
`;

export const SettingCloseButtonBox = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
`;

export const SettingTitleBox = styled.div`
  display: flex;
  border-bottom: 1px dotted ${({ theme }) => theme.colors.border};
  margin: 1rem 0;
`;

export const SettingTitleParagraph = styled.p`
  font-size: 1.5rem;
  margin-bottom: -2px;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid ${({ theme }) => theme.colors.primarybg};
`;

export const SettingGroupBox = styled.div`
  display: flex;
`;

export const SettingGroupLabelBox = styled.div`
  width: 25%;
  display: flex;
  justify-content: right;
  padding: 0.25rem 1rem;
`;

export const SettingGroupControleBox = styled.div`
  width: 50%;
  padding: 0.25rem 1rem;

  select {
    border: 1px solid ${({ theme }) => theme.colors.border};
    background: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.fg};
    outline: none;
    padding: 0.25rem;
    font-size: 1rem;
    cursor: pointer;
  }
`;
