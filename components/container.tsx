import { ContainerProps } from '../lib/types';
import styled from '@emotion/styled';

export default function Container({ children }: ContainerProps) {
  return <StyledContainer>{children}</StyledContainer>;
}

const StyledContainer = styled.div`
  max-width: 60rem;
  padding: 0 1rem;
`;
