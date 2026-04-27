import Link from 'next/link';
import Container from '../components/container';
import Layout from '../components/layout';
import styled from '@emotion/styled';

const categories = [
  {
    title: 'Books',
    url: '/favourite-books',
    emoji: '📚',
    description: 'A ranked list of the books I have loved most.',
  },
  {
    title: 'Beers',
    url: '/favourite-beers',
    emoji: '🍺',
    description: 'Craft beers, lagers, and everything in between.',
  },
  {
    title: 'Cheese',
    url: '/favourite-cheese',
    emoji: '🧀',
    description: 'The finest wheels and wedges I have encountered.',
  },
  {
    title: 'Cities',
    url: '/favourite-cities',
    emoji: '🏙️',
    description: 'Places around the world that have left a mark.',
  },
  {
    title: 'Countries',
    url: '/favourite-countries',
    emoji: '🌍',
    description: 'Nations I have visited and would return to.',
  },
  {
    title: 'DJs',
    url: '/favourite-djs',
    emoji: '🎧',
    description: 'The selectors who move a dancefloor.',
  },
  {
    title: 'Movies',
    url: '/favourite-movies',
    emoji: '🎬',
    description: 'Films I keep thinking about long after the credits roll.',
  },
  {
    title: 'Restaurants',
    url: '/favourite-restaurants',
    emoji: '🍽️',
    description: 'Meals and places worth travelling for.',
  },
  {
    title: 'Tracks',
    url: '/favourite-tracks',
    emoji: '🎵',
    description: 'Songs that have soundtracked my life.',
  },
  {
    title: 'Articles',
    url: '/favourite-articles',
    emoji: '📰',
    description: 'Writing from across the web that stuck with me.',
  },
];

const seo = {
  opengraphTitle: 'Favourites | World Of Winfield',
  opengraphDescription: "Browse all of James Winfield's favourites lists.",
  opengraphSiteName: 'World Of Winfield',
};

export default function FavouritesHubPage() {
  return (
    <Layout preview={null} title="Favourites" seo={seo}>
      <Container>
        <HubHeader>Favourites</HubHeader>
        <Intro>Ten lists of things I love — books, beer, music, food, and more.</Intro>
        <Grid>
          {categories.map(({ title, url, emoji, description }) => (
            <Card key={url} href={url}>
              <Emoji>{emoji}</Emoji>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </Card>
          ))}
        </Grid>
      </Container>
    </Layout>
  );
}

const HubHeader = styled.h1`
  font-size: 3rem;
  line-height: 4rem;
  margin: 2rem 0 0.5rem;
`;

const Intro = styled.p`
  margin: 0 0 2rem;
  font-size: 1.125rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.25rem;
  margin-bottom: 3rem;
`;

const Card = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.25rem;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    border-color: #999;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
`;

const Emoji = styled.span`
  font-size: 2rem;
  line-height: 1;
`;

const CardTitle = styled.h2`
  font-size: 1.25rem;
  margin: 0;
`;

const CardDescription = styled.p`
  font-size: 0.9rem;
  margin: 0;
  color: #555;
`;
