import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const API_URL = publicRuntimeConfig.NEXT_PUBLIC_WORDPRESS_API_URL;

async function fetchAPI(query = '', { variables }: Record<string, unknown> = {}) {
  const headers = { 'Content-Type': 'application/json' };

  if (process.env.WORDPRESS_AUTH_REFRESH_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.WORDPRESS_AUTH_REFRESH_TOKEN}`;
  }

  const apiUrl = process.env.WORDPRESS_API_URL ?? API_URL;
  // WPGraphQL Plugin must be enabled
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
              metaDesc
              focuskw
              title
              canonical
              metaKeywords
              opengraphTitle
              opengraphDescription
              opengraphUrl
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

export async function getPostAndMorePosts(slug, preview, previewData) {
  const postPreview = preview && previewData?.post;
  // The slug may be the id of an unpublished post
  const isId = Number.isInteger(Number(slug));
  const isSamePost = isId ? Number(slug) === postPreview.id : slug === postPreview.slug;
  const isDraft = isSamePost && postPreview?.status === 'draft';
  const isRevision = isSamePost && postPreview?.status === 'publish';
  const data = await fetchAPI(
    `
    fragment AuthorFields on User {
      name
      firstName
      lastName
      avatar {
        url
      }
    }
    fragment PostFields on Post {
      title
      excerpt
      slug
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
      author {
        node {
          ...AuthorFields
        }
      }
      categories {
        edges {
          node {
            name
          }
        }
      }
      tags {
        edges {
          node {
            name
          }
        }
      }
      seo {
        metaDesc
        focuskw
        title
        canonical
        metaKeywords
        opengraphTitle
        opengraphDescription
        opengraphUrl
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
    query PostBySlug($id: ID!, $idType: PostIdType!) {
      post(id: $id, idType: $idType) {
        ...PostFields
        content
        ${
          // Only some of the fields of a revision are considered as there are some inconsistencies
          isRevision
            ? `
        revisions(first: 1, where: { orderby: { field: MODIFIED, order: DESC } }) {
          edges {
            node {
              title
              excerpt
              content
              author {
                node {
                  ...AuthorFields
                }
              }
            }
          }
        }
        `
            : ''
        }
      }
      posts(first: 3, where: { orderby: { field: DATE, order: DESC } }) {
        edges {
          node {
            ...PostFields
          }
        }
      }
    }
  `,
    {
      variables: {
        id: isDraft ? postPreview.id : slug,
        idType: isDraft ? 'DATABASE_ID' : 'SLUG',
      },
    }
  );

  // Draft posts may not have an slug
  if (isDraft) data.post.slug = postPreview.id;
  // Apply a revision (changes in a published post)
  if (isRevision && data.post.revisions) {
    const revision = data.post.revisions.edges[0]?.node;

    if (revision) Object.assign(data.post, revision);
    delete data.post.revisions;
  }

  // Filter out the main post
  data.posts.edges = data.posts.edges.filter(({ node }) => node.slug !== slug);
  // If there are still 3 posts, remove the last one
  if (data.posts.edges.length > 2) data.posts.edges.pop();

  return data;
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
          metaDesc
          focuskw
          title
          canonical
          metaKeywords
          opengraphTitle
          opengraphDescription
          opengraphUrl
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
