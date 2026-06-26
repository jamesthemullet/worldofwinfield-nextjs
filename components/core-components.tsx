import styled from '@emotion/styled';
import { colours } from '../pages/_app';

export const StyledButton = styled.button`
  padding: 10px;
  font-size: 1rem;
  border: none;
  min-width: 100px;
  background-color: ${colours.pink};
  color: ${colours.white};
  font-weight: bold;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    color: ${colours.dark};
  }

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }

  @media (max-width: 768px) {
    flex: 1;
  }
`;

export const StyledInput = styled.input`
  padding: 10px;
  border: none;
  min-width: 100px;
  margin-bottom: 10px;

  &:focus-visible {
    outline: 2px solid ${colours.pink};
    outline-offset: 2px;
  }
`;

export const StyledSelect = styled.select`
  padding: 10px;
  border: none;
  min-width: 100px;
  margin-bottom: 10px;

  &:focus-visible {
    outline: 2px solid ${colours.pink};
    outline-offset: 2px;
  }
`;
