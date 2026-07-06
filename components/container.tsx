import styled from '@emotion/styled';
import type { ContainerProps } from '../lib/types';

export default function Container({ children }: ContainerProps): JSX.Element {
  return <StyledContainer>{children}</StyledContainer>;
}

const StyledContainer = styled.div`
  width: 100%;
`;
