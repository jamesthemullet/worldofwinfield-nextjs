import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';
import createEmotionServer from '@emotion/server/create-instance';
import createCache from '@emotion/cache';

const EMOTION_KEY = 'css';

function createEmotionCache() {
  return createCache({ key: EMOTION_KEY });
}

export default function MyDocument({ emotionStyleTags }: { emotionStyleTags: React.ReactNode }) {
  return (
    <Html lang="en">
      <Head>
        <link
          rel="preload"
          href="/fonts/Oswald-VariableFont_rght.ttf"
          as="font"
          type="font/truetype"
          crossOrigin="anonymous"
        />
        {emotionStyleTags}
      </Head>
      <body style={{ margin: 0, padding: 0, fontFamily: 'sans-serif', fontSize: '1.2rem', lineHeight: '1.5', color: '#333', backgroundColor: '#fff' }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  const originalRenderPage = ctx.renderPage;
  ctx.renderPage = () =>
    originalRenderPage({
       
      enhanceApp: (App: any) =>
         
        function EnhancedApp(props: any) {
          return <App emotionCache={cache} {...props} />;
        },
    });

  const initialProps = await Document.getInitialProps(ctx);
  const emotionStyles = extractCriticalToChunks(initialProps.html);
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(' ')}`}
      key={style.key}
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));

  return {
    ...initialProps,
    emotionStyleTags,
  };
};
