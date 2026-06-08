import styled from '@emotion/styled';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import Container from '../../components/container';
import Layout from '../../components/layout';
import PostHeader from '../../components/post-header';
import { ContentContainer } from '../../components/post-body';
import { getAllTags } from '../../lib/api';
import { TagsIndexProps } from '../../lib/types';
import { colours } from '../_app';

const tagColours = [
  colours.pink,
  colours.green,
  colours.purple,
  colours.burgandy,
  colours.azure,
  colours.blueish,
];

export default function TagsIndex({ tags }: TagsIndexProps) {
  const seo = {
    opengraphImage: undefined,
    opengraphTitle: 'Topics - World Of Winfield',
    opengraphDescription: 'Browse all topics on World Of Winfield',
    opengraphSiteName: 'World Of Winfield',
  };

  const sorted = [...tags].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Layout preview={null} seo={seo} title="Topics">
      <Container>
        <article>
          <PostHeader title="Topics" />
          <ContentContainer>
            <Intro>Browse all topics — click a tag to read every post filed under it.</Intro>
            <TagCloud>
              {sorted.map((tag, i) => (
                <TagChip
                  key={tag.slug}
                  href={`/tags/${tag.slug}`}
                  colour={tagColours[i % tagColours.length]}>
                  {tag.name}
                  <PostCount>{tag.count}</PostCount>
                </TagChip>
              ))}
            </TagCloud>
          </ContentContainer>
        </article>
      </Container>
    </Layout>
  );
}

const Intro = styled.p`
  font-size: 1rem;
  color: #666;
  margin-bottom: 2rem;
`;

const TagCloud = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const TagChip = styled(Link)<{ colour: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  background-color: ${(props) => props.colour};
  color: ${colours.white};
  font-weight: bold;
  text-decoration: none;
  font-size: 1rem;

  &:hover {
    opacity: 0.85;
  }
`;

const PostCount = styled.span`
  font-size: 0.8rem;
  opacity: 0.85;
  background-color: rgba(0, 0, 0, 0.2);
  padding: 0.1rem 0.4rem;
`;

export const getStaticProps: GetStaticProps = async () => {
  const tags = await getAllTags();
  return {
    props: { tags },
    revalidate: 3600,
  };
};
