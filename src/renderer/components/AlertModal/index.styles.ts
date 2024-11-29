import styled from '@emotion/styled';
import { color } from '@/styles';

export const AlertModalLayout = styled.div`
  position: absolute;
  inset: 0;

  z-index: 9999;

  display: flex;
  justify-content: center;
  align-items: center;
`;

export const AlertModalDimmedBox = styled.div`
  position: absolute;
  inset: 0;

  background-color: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(4px);
`;

export const AlertModalContentBox = styled.div`
  min-width: 50%;
  max-width: 90%;
  min-height: 20%;
  max-height: 90%;

  position: absolute;

  display: flex;
  flex-direction: column;

  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.2);

  background-color: white;
`;

export const AlertModalContentHeaderBox = styled.div`
  display: flex;
  justify-content: end;
  width: 100%;
  border-bottom: 1px solid lightgray;
  padding: 0.5rem;
`;

export const AlertModalContentHeaderCloseButton = styled.button`
  border: none;
  margin: 0;
  background-color: ${color.primaryBg};
  font-size: 0.875rem;
  color: white;
  cursor: pointer;
  padding: 0.4rem 0.8rem;
`;

export const AlertModalContentMarkdownBox = styled.div`
  flex: 1;
  padding: 2rem;
  overflow-y: scroll;
  color: ${color.text};
  font-size: 0.875rem;

  h1,
  h2,
  h3 {
    font-weight: 500;
    padding-bottom: 0.3125rem;
  }

  h3 {
    margin: 1rem 0;
  }

  .headline {
    box-sizing: border-box;
    border-bottom: 1px dotted #eee;
    padding-top: 1rem;

    h1,
    h2 {
      margin: 0 0 -2px 0;
      display: inline-block;
      border-bottom: 2px solid ${color.primaryText};
    }
  }

  img {
    width: 100%;
  }

  a {
    color: ${color.primaryText};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  code {
    background-color: rgba(0, 0, 0, 0.1);
    padding: 0.1563rem;
    font-family: open-sans;
    font-size: 0.75rem;
    line-height: 0.75rem;
    display: inline-block;
  }
`;
