import styled from '@emotion/styled';
import Link from 'next/link';
import { AdjacentPost } from '../lib/types';
import { colours } from '../pages/_app';

type PostNavigationProps = {
  previousPost: AdjacentPost | null;
  nextPost: AdjacentPost | null;
};

export default function PostNavigation({ previousPost, nextPost }: PostNavigationProps) {
  if (!previousPost && !nextPost) return null;

  return (
    <Nav aria-label="Post navigation">
      <NavItem>
        {previousPost && (
          <NavLink href={`/${previousPost.slug}`}>
            <NavDirection>← Older</NavDirection>
            <NavTitle>{previousPost.title}</NavTitle>
          </NavLink>
        )}
      </NavItem>
      <NavItem $align="right">
        {nextPost && (
          <NavLink href={`/${nextPost.slug}`} $align="right">
            <NavDirection>Newer →</NavDirection>
            <NavTitle>{nextPost.title}</NavTitle>
          </NavLink>
        )}
      </NavItem>
    </Nav>
  );
}

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  max-width: 60rem;
  margin: 2rem auto 0;
  padding: 1.5rem 1rem;
  border-top: 2px solid ${colours.dark};
`;

const NavItem = styled.div<{ $align?: string }>`
  flex: 1;
  display: flex;
  justify-content: ${({ $align }) => ($align === 'right' ? 'flex-end' : 'flex-start')};
`;

const NavLink = styled(Link)<{ $align?: string }>`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  text-decoration: none;
  max-width: 20rem;
  text-align: ${({ $align }) => ($align === 'right' ? 'right' : 'left')};

  &:hover span:last-child {
    color: ${colours.pink};
  }
`;

const NavDirection = styled.span`
  font-family: 'Oswald', sans-serif;
  font-size: 0.75rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #666;
`;

const NavTitle = styled.span`
  font-family: 'Oswald', sans-serif;
  font-size: 1rem;
  color: ${colours.dark};
  line-height: 1.3;
  transition: color 0.2s ease;
`;
