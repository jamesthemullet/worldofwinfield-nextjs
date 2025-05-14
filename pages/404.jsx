import Container from '../components/container';
import Layout from '../components/layout';
import Link from 'next/link';
import { colours } from '../pages/_app';
import styled from '@emotion/styled';

export default function Custom404() {
  const words = ['Why', 'are', 'you', 'here?'];
  const blockColours = [
    colours.pink,
    colours.green,
    colours.purple,
    colours.burgandy,
    colours.dark,
    colours.azure,
    colours.blueish,
  ];

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const shuffledColours = shuffleArray(blockColours);

  const seo = {
    opengraphImage: null,
    opengraphTitle: `404 - World Of Winfield`,
    opengraphDescription: `404 - World Of Winfield`,
    opengraphSiteName: `World Of Winfield`,
  };

  return (
    <Layout preview="" seo={seo} title="404 - Page Not Found">
      <Container>
        <article>
          <Grid>
            {words.map((word, index) => (
              <Block backgroundColour={shuffledColours[index]} key={index}>
                <p>{word}</p>
              </Block>
            ))}
          </Grid>
          <Container404>
            <p>The page you are looking for does not exist.</p>
            <Link href="/">Go back to the homepage</Link>
          </Container404>
        </article>
      </Container>
    </Layout>
  );
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const Block = styled.div`
  background-color: ${(props) => props.backgroundColour};
  color: white;
  padding: 0;
  text-align: center;
  font-size: 4rem;
  font-family: 'Oswald', monospace;
  aspect-ratio: 2/1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Container404 = styled.div`
  width: 100%;
  max-width: 100%;
  padding: 0 1rem;
  font-size: 1.125rem;
  line-height: 1.75rem;
  box-sizing: border-box;
  max-width: 60rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 4rem auto 4rem;
`;
