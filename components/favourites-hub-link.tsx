import styled from '@emotion/styled';
import Link from 'next/link';

const FavouritesHubLink = () => (
  <Wrapper>
    <Link href="/favourites">← Back to all favourites</Link>
  </Wrapper>
);

export default FavouritesHubLink;

const Wrapper = styled.div`
  border-top: 1px solid #e5e5e5;
  margin-top: 2.5rem;
  padding-top: 1.25rem;

  a {
    font-size: 0.95rem;
    color: inherit;
    text-decoration: underline;

    &:hover {
      opacity: 0.7;
    }
  }
`;
