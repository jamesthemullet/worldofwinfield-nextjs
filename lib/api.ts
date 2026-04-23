const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

const SEO_FRAGMENT = `
  fragment SEOFields on Post {
    seo {
      opengraphTitle
      opengraphDescription
      opengraphSiteName
      metaKeywords
      opengraphImage {
        uri
        altText
        mediaDetails {
          file
          height
          width
        }
        mediaItemUrl
        sourceUrl
        srcSet
      }
    }
  }
`;

const AUTHOR_FRAGMENT = `
  fragment AuthorFields on Post {
    author {
      node {
        name
        firstName
        lastName
        avatar {
          url
        }
        description
      }
    }
  }
`;

const FEATURED_IMAGE_FRAGMENT = `
  fragment FeaturedImageFields on NodeWithFeaturedImage {
    featuredImage {
      node {
        id
        title
        sourceUrl
        srcSet
        caption
        mediaDetails {
          height
          width
          sizes {
            sourceUrl
            height
            width
          }
        }
      }
    }
  }
`;

async function fetchAPI(query = '', { variables }: Record<string, unknown> = {}) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  if (process.env.WORDPRESS_AUTH_REFRESH_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.WORDPRESS_AUTH_REFRESH_TOKEN}`;
  }

  const apiUrl = (process.env.WORDPRESS_API_URL ?? API_URL) as string;
  const res = await fetch(apiUrl, {
    headers,
    method: 'POST',
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const json = await res.json();
  if (json.errors) {
     
    console.error(json.errors);
    throw new Error('Failed to fetch API');
  }
  return json.data;
}

export async function getPreviewPost(id: string, idType = 'DATABASE_ID') {
  const data = await fetchAPI(
    `
    query PreviewPost($id: ID!, $idType: PostIdType!) {
      post(id: $id, idType: $idType) {
        databaseId
        slug
        status
      }
    }`,
    {
      variables: { id, idType },
    },
  );
  return data.post;
}

export async function getAllPostsWithSlug() {
  const data = await fetchAPI(`
    {
      posts(first: 10000) {
        edges {
          node {
            slug
          }
        }
      }
    }
  `);
  return data?.posts;
}

export async function getFirstPost() {
  const data = await fetchAPI(`
    ${FEATURED_IMAGE_FRAGMENT}
    ${SEO_FRAGMENT}
    {
      posts(first: 1) {
        edges {
          node {
            slug
            title
            ...FeaturedImageFields
            date
            ...SEOFields
          }
        }
      }
    }
  `);
  return data?.posts;
}

export async function getJamesImages({ first = 10, after = null }: { first?: number; after?: string | null } = {}) {
  const data = await fetchAPI(
    `
    query JamesImages($first: Int, $after: String) {
      jamesImages(first: $first, after: $after) {
        edges {
          node {
            title
            featuredImage {
              node {
                title
                mediaDetails {
                  sizes {
                    sourceUrl
                    height
                    width
                  }
                }
                sourceUrl
                srcSet
              }
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `,
    {
      variables: {
        first,
        after,
      },
    },
  );
  return data.jamesImages;
}

export async function getAllPostsForHome(preview: boolean) {
  const data = await fetchAPI(
    `
    ${FEATURED_IMAGE_FRAGMENT}
    ${AUTHOR_FRAGMENT}
    ${SEO_FRAGMENT}
    query AllPosts {
      posts(first: 20, where: { orderby: { field: DATE, order: DESC } }) {
        edges {
          node {
            title
            excerpt
            slug
            date
            ...FeaturedImageFields
            ...AuthorFields
            ...SEOFields
          }
        }
      }
    }
  `,
    {
      variables: {
        onlyEnabled: !preview,
        preview,
      },
    },
  );

  return data?.posts;
}

export async function getPost(id: string, idType = 'SLUG') {
  const data = await fetchAPI(
    `
    ${FEATURED_IMAGE_FRAGMENT}
    ${AUTHOR_FRAGMENT}
    ${SEO_FRAGMENT}
    query Post($id: ID!, $idType: PostIdType!) {
      post(id: $id, idType: $idType) {
        slug
        content
        title
        date
        modified
        ...AuthorFields
        ...SEOFields
        tags {
          edges {
            node {
              name
            }
          }
        }
        ...FeaturedImageFields
      }
    }`,
    {
      variables: { id, idType },
    },
  );
  return data.post;
}

export async function getPostDisplayInfo(ids: string[]) {
  const posts = await Promise.all(
    ids.map((id: string) =>
      fetchAPI(
        `
      ${FEATURED_IMAGE_FRAGMENT}
      query Post($id: ID!, $idType: PostIdType!) {
        post(id: $id, idType: $idType) {
          slug
          title
          date
          ...FeaturedImageFields
        }
      }`,
        {
          variables: { id, idType: 'DATABASE_ID' },
        },
      ).then((data) => data.post),
    ),
  );
  return posts;
}

export async function searchBlogPosts(searchTerm: string) {
  const data = await fetchAPI(
    `
    query SearchBlogPosts($searchTerm: String!) {
      posts(where: { search: $searchTerm }, first: 100) {
        nodes {
          slug
          title
          content
          date
        }
      }
    }`,
    {
      variables: { searchTerm },
    },
  );
  return data.posts.nodes;
}

export async function filterPostsByTag(tag: string) {
  const data = await fetchAPI(
    `
    ${FEATURED_IMAGE_FRAGMENT}
    query filterPostsByTag($tag: String!) {
      posts(where: { tag: $tag }, first: 100) {
        nodes {
          id
          title
          excerpt
          slug
          date
          tags {
            nodes {
              name
            }
          }
          ...FeaturedImageFields
        }
      }
    }`,
    {
      variables: { tag },
    },
  );
  return data.posts.nodes;
}

export async function getPostsByDate(month: number, year: number) {
  const data = await fetchAPI(
    `
    query GetPostsByDate($month: Int!, $year: Int!) {
      posts(where: { dateQuery: { month: $month, year: $year } }, first: 100) {
        nodes {
          title
          date
          slug
        }
      }
    }`,
    {
      variables: { month, year },
    },
  );
  return {
    posts: data.posts.nodes,
    month,
    year,
  };
}

export async function getPostsByTag(tag: string) {
  const data = await fetchAPI(
    `
    query getPostsByTag($tag: String!) {
      posts(where: {tag: $tag}, first: 100) {
        nodes {
          title
          slug
          date
          id
        }
      }
    }`,
    {
      variables: { tag },
    },
  );
  return data.posts.nodes;
}

export async function getRelatedPosts(tag: string, excludeSlug: string) {
  const data = await fetchAPI(
    `
    ${FEATURED_IMAGE_FRAGMENT}
    query GetRelatedPosts($tag: String!) {
      posts(where: { tag: $tag }, first: 4) {
        nodes {
          title
          slug
          date
          excerpt
          ...FeaturedImageFields
        }
      }
    }`,
    {
      variables: { tag },
    },
  );
  return (data.posts.nodes as { slug: string }[])
    .filter((post) => post.slug !== excludeSlug)
    .slice(0, 3);
}

export async function getRandomImage(randomMonth: number, randomYear: number) {
  const data = await fetchAPI(
    `
    ${FEATURED_IMAGE_FRAGMENT}
    query GetRandomImage($randomMonth: Int!, $randomYear: Int!) {
      mediaItems(where: {dateQuery: {month: $randomMonth, year: $randomYear}}, first: 100) {
        edges {
          node {
            id
            title
            mediaDetails {
              sizes {
                sourceUrl
                height
                width
              }
            }
            srcSet
            sourceUrl
          }
        }
      }
    }`,
    {
      variables: { randomMonth, randomYear },
    },
  );
  return {
    images: data.mediaItems.edges,
    randomMonth,
    randomYear,
  };
}
