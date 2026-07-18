import createCache, { EmotionCache } from '@emotion/cache';
import createEmotionServer from '@emotion/server/create-instance';
import type { AppProps } from 'next/app';
import type { AppType } from 'next/dist/shared/lib/utils';
import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document';
import type { ComponentType } from 'react';

const EMOTION_KEY = 'css';

function createEmotionCache() {
  return createCache({ key: EMOTION_KEY });
}

export default function MyDocument({ emotionStyleTags }: { emotionStyleTags: React.ReactNode }) {
  return (
    <Html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="preload"
          href="/fonts/Oswald-VariableFont_rght.ttf"
          as="font"
          type="font/truetype"
          crossOrigin="anonymous"
        />
        {emotionStyleTags}
      </Head>
      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily: 'sans-serif',
          fontSize: '1.2rem',
          lineHeight: '1.5',
          color: '#333',
          backgroundColor: '#fff',
        }}>
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
      // Cast required: Next.js Enhancer<AppType> expects (AppType) => AppType, but we return
      // a wrapper that passes an extra emotionCache prop — no way to express this without assertion.
      enhanceApp: (App: AppType) =>
        function EnhancedApp(props: AppProps) {
          const TypedApp = App as ComponentType<AppProps & { emotionCache: EmotionCache }>;
          return <TypedApp emotionCache={cache} {...props} />;
        } as unknown as AppType,
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
