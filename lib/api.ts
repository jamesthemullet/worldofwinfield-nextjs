import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const API_URL = publicRuntimeConfig.NEXT_PUBLIC_WORDPRESS_API_URL;

async function fetchAPI(query = '', { variables }: Record<string, unknown> = {}) {
  const headers = { 'Content-Type': 'application/json' };

  if (process.env.WORDPRESS_AUTH_REFRESH_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.WORDPRESS_AUTH_REFRESH_TOKEN}`;
  }

  const apiUrl = process.env.WORDPRESS_API_URL ?? API_URL;
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
    // eslint-disable-next-line no-console
    console.error(json.errors);
    throw new Error('Failed to fetch API');
  }
  return json.data;
}

export async function getPreviewPost(id, idType = 'DATABASE_ID') {
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
    }
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
    {
      posts(first: 1) {
        edges {
          node {
            slug
            title
            featuredImage {
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
            date
            seo {
              opengraphTitle
              opengraphDescription
              opengraphSiteName
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
        }
      }
    }
  `);
  return data?.posts;
}

export async function getJamesImages({ first = 10, after = null }) {
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
    }
  );
  return data.jamesImages;
}

export async function getAllPostsForHome(preview) {
  const data = await fetchAPI(
    `
    query AllPosts {
      posts(first: 20, where: { orderby: { field: DATE, order: DESC } }) {
        edges {
          node {
            title
            excerpt
            slug
            date
            featuredImage {
              node {
                sourceUrl
                mediaDetails {
                  height
                  width
                }
              }
            }
            author {
              node {
                name
                firstName
                lastName
                avatar {
                  url
                }
              }
            }
            seo {
              opengraphTitle
              opengraphDescription
              opengraphSiteName
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
        }
      }
    }
  `,
    {
      variables: {
        onlyEnabled: !preview,
        preview,
      },
    }
  );

  return data?.posts;
}

export async function getPage(id, idType = 'DATABASE_ID') {
  const data = await fetchAPI(
    `
    query Page($id: ID!, $idType: PageIdType!) {
      page(id: $id, idType: $idType) {
        slug
        content
        title
        date
        seo {
          metaKeywords
          opengraphTitle
          opengraphDescription
          opengraphSiteName
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
    }`,
    {
      variables: { id, idType },
    }
  );
  return data.page;
}

export async function getPost(id, idType = 'SLUG') {
  const data = await fetchAPI(
    `
    query Post($id: ID!, $idType: PostIdType!) {
      post(id: $id, idType: $idType) {
        slug
        content
        title
        date
        seo {
          metaKeywords
          opengraphTitle
          opengraphDescription
          opengraphSiteName
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
        tags {
          edges {
            node {
              name
            }
          }
        }
        featuredImage {
          node {
            id
            title
            mediaDetails {
              sizes {
                sourceUrl
                height
                width
              }
              height
              width
            }
            srcSet
            sourceUrl
          }
        }
      }
    }`,
    {
      variables: { id, idType },
    }
  );
  return data.post;
}

export async function getPostDisplayInfo(ids, idType = 'DATABASE_ID') {
  const posts = [];
  for (const id of ids) {
    const data = await fetchAPI(
      `
      query Post($id: ID!, $idType: PostIdType!) {
        post(id: $id, idType: $idType) {
          slug
          title
          date
          featuredImage {
            node {
              mediaDetails {
                sizes {
                  height
                  width
                  sourceUrl
                }
                height
                width
              }
              srcSet
              sourceUrl
            }
          }
        }
      }`,
      {
        variables: { id, idType: 'DATABASE_ID' },
      }
    );
    posts.push(data.post);
  }
  return posts;
}

export async function searchBlogPosts(searchTerm) {
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
    }
  );
  return data.posts.nodes;
}

export async function filterPostsByTag(tag) {
  const data = await fetchAPI(
    `
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
          featuredImage {
            node {
              mediaDetails {
                sizes {
                  height
                  width
                  sourceUrl
                }
                height
                width
              }
              srcSet
              sourceUrl
            }
          }
        }
      }
    }`,
    {
      variables: { tag },
    }
  );
  return data.posts.nodes;
}

export async function getPostsByDate(month, year) {
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
    }
  );
  return {
    posts: data.posts.nodes,
    month,
    year,
  };
}

export async function getPostsByTag(tag) {
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
    }
  );
  return data.posts.nodes;
}

export async function getRandomImage(randomMonth, randomYear) {
  const data = await fetchAPI(
    `
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
    }
  );
  return {
    images: data.mediaItems.edges,
    randomMonth,
    randomYear,
  };
}
