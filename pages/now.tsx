import Container from '../components/container';
import PostHeader from '../components/post-header';
import Layout from '../components/layout';
import styled from '@emotion/styled';

export default function NowPage() {
  return (
    <Layout preview={null} title="Now">
      <Container>
        <PostContainer>
          <StyledPostHeader>
            <PostHeader title="Now" />
          </StyledPostHeader>
          <NowContent>
            <LastUpdated>Last updated: April 2026</LastUpdated>

            <Section>
              <SectionHeading>📍 Where I am</SectionHeading>
              <p>London. Croydon, to be exact.</p>
            </Section>

            <Section>
              <SectionHeading>💼 What I'm working on</SectionHeading>
              <p>At work, an internal merchandising app at M&S.</p>
              <p>
                On the side I've started making a site called <strong>Croydon Chicken Mile</strong>{' '}
                just for a laugh — to celebrate the best chicken shops in the country. There's a
                serious amount of talent out there and someone has to document it.
              </p>
            </Section>

            <Section>
              <SectionHeading>🤖 What I'm learning</SectionHeading>
              <p>
                Kind of obsessed with Claude Code at the moment and trying to actually integrate
                myself into the AI ecosystem rather than just messing about with it. Also still
                slowly chugging away at Spanish.
              </p>
            </Section>

            <Section>
              <SectionHeading>📖 What I'm reading</SectionHeading>
              <p>
                The book I'm reading is too naff to share. But my favourite blog at the moment is{' '}
                <a href="https://jmarriott.substack.com/" target="_blank" rel="noopener noreferrer">
                  Cultural Capital by James Marriott
                </a>
                .
              </p>
            </Section>

            <Section>
              <SectionHeading>✈️ What's next</SectionHeading>
              <p>
                Hoping to go to Japan next month...assuming sufficient jet fuel. Was booked for May
                2020 but you know what happened then.
              </p>
            </Section>

            <Footer>
              <p>
                This is a{' '}
                <a href="https://nownownow.com/about" target="_blank" rel="noopener noreferrer">
                  /now page
                </a>
                . If you have one too, I'd love to know.
              </p>
            </Footer>
          </NowContent>
        </PostContainer>
      </Container>
    </Layout>
  );
}

const PostContainer = styled.article`
  h1 {
    font-size: 3rem;
    line-height: 4rem;
  }
`;

const StyledPostHeader = styled.div`
  margin: 0 auto;
`;

const NowContent = styled.div`
  max-width: 680px;
  margin: 2rem auto 4rem;
  padding: 0 1rem;
  font-size: 1.15rem;
  line-height: 1.75;

  a {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    margin: 1rem;
  }
`;

const LastUpdated = styled.p`
  font-size: 0.9rem;
  color: #767676;
  margin-bottom: 2rem;
`;

const Section = styled.section`
  margin-bottom: 2.5rem;

  p + p {
    margin-top: 1rem;
  }
`;

const SectionHeading = styled.h2`
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 0.75rem;
`;

const Footer = styled.div`
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid #999;
  font-size: 0.9rem;
  color: #767676;

  a {
    color: #4d7299;
  }
`;
