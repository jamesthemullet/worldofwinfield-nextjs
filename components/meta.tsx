import Head from 'next/head';
import { useRouter } from 'next/router';

type seoProps = {
  seo?: {
    opengraphDescription: string;
    opengraphImage?: {
      uri: string;
      altText: string;
      mediaItemUrl: string;
      mediaDetails: {
        width: string;
        height: string;
      };
    } | null;
    opengraphTitle: string;
    opengraphSiteName: string;
    metaKeywords?: string;
  };
  title?: string;
  ogType?: string;
  articleDate?: string;
  articleModified?: string;
  articleAuthor?: string;
};

export default function Meta({ seo, title, ogType = 'article', articleDate, articleModified, articleAuthor }: seoProps) {
  const router = useRouter();
  const currentUrl = router.asPath;
  const siteAddress = 'https://www.worldofwinfield.co.uk';
  const defaultImageUrl = '/images/jameswinfieldcover.png';

  const { opengraphImage, opengraphTitle, opengraphDescription, opengraphSiteName, metaKeywords } = seo || {};
  const canonicalUrl = `${siteAddress}${currentUrl}`;

  return (
    <Head>
      <title>{title || opengraphTitle}</title>
      <link rel="canonical" href={canonicalUrl} />
      <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
      <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#000000" />
      <link rel="shortcut icon" href="/favicon/favicon.ico" />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="msapplication-config" content="/favicon/browserconfig.xml" />
      <meta name="theme-color" content="#000" />
      <meta property="og:locale" content="en_GB" />
      <meta property="og:type" content={ogType} />
      <meta
        property="og:title"
        content={opengraphTitle ? opengraphTitle : 'World Of Winfield - all about James Winfield'}
      />
      <meta
        property="og:description"
        content={
          opengraphDescription
            ? opengraphDescription
            : 'World Of Winfield - all about James Winfield'
        }
      />
      <meta
        property="og:site_name"
        content={opengraphSiteName ? opengraphSiteName : 'World Of Winfield'}
      />
      <meta property="og:url" content={canonicalUrl} />
      <meta
        property="og:image"
        content={opengraphImage?.mediaItemUrl ? opengraphImage?.mediaItemUrl : defaultImageUrl}
      />
      <meta property="og:image:width" content={opengraphImage?.mediaDetails?.width} />
      <meta property="og:image:height" content={opengraphImage?.mediaDetails?.height} />
      {opengraphImage?.altText && <meta property="og:image:alt" content={opengraphImage.altText} />}
      {ogType === 'article' && articleDate && (
        <meta property="article:published_time" content={articleDate} />
      )}
      {ogType === 'article' && articleModified && (
        <meta property="article:modified_time" content={articleModified} />
      )}
      {ogType === 'article' && articleAuthor && (
        <meta property="article:author" content={articleAuthor} />
      )}
      {metaKeywords && <meta name="keywords" content={metaKeywords} />}
      <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
      <meta
        name="description"
        content={
          opengraphDescription
            ? opengraphDescription
            : 'World Of Winfield - all about James Winfield'
        }
      />
    </Head>
  );
}
