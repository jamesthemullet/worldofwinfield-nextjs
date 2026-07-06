import styled from '@emotion/styled';
import type { GetStaticProps } from 'next';
import Link from 'next/link';
import Container from '../../components/container';
import Layout from '../../components/layout';
import PostHeader from '../../components/post-header';
import { getAllTags } from '../../lib/api';
import type { TagIndexPageProps } from '../../lib/types';
import { colours } from '../_app';

const blockColours = [
  colours.pink,
  colours.green,
  colours.purple,
  colours.burgandy,
  colours.azure,
  colours.blueish,
  colours.dark,
];

const lightBackgrounds = new Set([colours.purple, colours.green, colours.blueish, colours.azure]);

const getColourFromName = (name: string): string => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) & 0xffffffff;
  }
  return blockColours[Math.abs(hash) % blockColours.length];
};

const getTextColour = (bg: string): string => (lightBackgrounds.has(bg) ? colours.dark : colours.white);

export default function TagsIndex({ tags }: TagIndexPageProps) {
  const seo = {
    opengraphTitle: 'Browse All Topics - World Of Winfield',
    opengraphDescription: 'Browse all topics covered on World Of Winfield',
    opengraphSiteName: 'World Of Winfield',
    opengraphImage: undefined,
  };

  return (
    <Layout preview={null} seo={seo} title="Browse All Topics">
      <Container>
        <PostHeader title="Browse All Topics" />
        <TagGrid>
          {tags.map((tag) => {
            const bg = getColourFromName(tag.name);
            return (
              <TagTile
                key={tag.name}
                href={`/tags/${encodeURIComponent(tag.name)}`}
                colour={bg}
                textcolour={getTextColour(bg)}>
                <TagName>{tag.name}</TagName>
                <TagCount>
                  {tag.count} {tag.count === 1 ? 'post' : 'posts'}
                </TagCount>
              </TagTile>
            );
          })}
        </TagGrid>
      </Container>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const tags = await getAllTags();

  return {
    props: { tags },
    revalidate: 3600,
  };
};

const TagGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  padding: 2rem 0;

  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
`;

const TagTile = styled(Link)<{ colour: string; textcolour: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.colour};
  color: ${(props) => props.textcolour};
  text-decoration: none;
  padding: 1.5rem 1rem;
  min-height: 100px;
  text-align: center;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 0.85;
  }
`;

const TagName = styled.span`
  font-family: 'Oswald', sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: capitalize;
`;

const TagCount = styled.span`
  font-size: 0.9rem;
  margin-top: 0.4rem;
`;
