import styled from '@emotion/styled';

export const ToggleLanguageLayout = styled.div`
  display: flex;
  position: relative;
  z-index: 10;
`;

export const ToggleLanguageButton = styled.button`
  border: none;
  background: lightgray;
  color: white;
  padding: 0.4rem 0.8rem;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;

  &::after {
    content: '';
    display: inline-block;
    margin-left: 0.255em;
    vertical-align: 0.255em;
    border-top: 0.3em solid;
    border-right: 0.3em solid transparent;
    border-left: 0.3em solid transparent;
  }
`;

export const ToggleLanguageModalBox = styled.div<{ isOpen: boolean }>`
  display: ${(props) => (props.isOpen ? 'block' : 'none')};
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  overflow: hidden;
  box-shadow: 1px 1px 1px 1px rgb(0, 0, 0, 0.2);
`;

export const ToggleLanguageModalList = styled.ul`
  padding: 0.5rem 0;
  margin: 0;
`;

export const ToggleLanguageModalItem = styled.li`
  list-style: none;
`;

export const ToggleLanguageModalItemButton = styled.button`
  width: 100%;
  text-align: left;
  font-size: 0.8rem;
  padding: 0.3rem 0.9rem;
  border: none;
  background-color: transparent;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;
