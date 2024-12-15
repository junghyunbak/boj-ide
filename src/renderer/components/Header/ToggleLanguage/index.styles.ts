import styled from '@emotion/styled';

export const ToggleLanguageLayout = styled.div`
  display: flex;
  position: relative;
  z-index: 10;
`;

export const ToggleLanguageButton = styled.button<{ isActive: boolean }>`
  border: 1px solid #ccc;
  color: #333;
  padding: 0.4rem 0.8rem;
  font-weight: 500;
  white-space: nowrap;
  box-shadow: ${(props) => (props.isActive ? 'inset 0 3px 5px rgba(0, 0, 0, 0.125)' : 'none')};
  background: ${(props) => (props.isActive ? '#e6e6e6' : 'none')};
  cursor: pointer;

  &:hover {
    background-color: #e6e6e6;
  }

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
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
  border: 1px solid rgba(0, 0, 0, 0.15);
  margin: 2px 0 0;
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
