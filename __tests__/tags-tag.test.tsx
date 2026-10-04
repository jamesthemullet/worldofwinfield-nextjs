import { render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import { getAllTags, getPostsByTag } from '../lib/api';
import Post, { getStaticPaths, getStaticProps, stripReadMoreParagraph } from '../pages/tags/[tag]';

const mockRouter = { isFallback: false };

jest.mock('next/router', () => ({
  useRouter: () => mockRouter,
}));

jest.mock('../pages/_app', () => ({
  colours: {
    dark: '#291720',
    white: '#FFFFFF',
    pink: '#D90368',
    purple: '#8884FF',
    burgandy: '#820263',
    green: '#04A777',
    blueish: '#547AA5',
    azure: '#3185FC',
  },
}));

jest.mock('../components/layout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('../components/container', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('../components/post-header', () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

jest.mock('../components/post-title', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="post-title">{children}</div>
  ),
}));

jest.mock('../lib/api', () => ({
  getAllTags: jest.fn(),
  getPostsByTag: jest.fn(),
}));

describe('stripReadMoreParagraph', () => {
  it('removes anchor tags from excerpt HTML', () => {
    const input = '<p>Some text.</p> <a href="/read-more" class="btn">Read More</a>';
    expect(stripReadMoreParagraph(input)).toBe('<p>Some text.</p>');
  });

  it('returns the string unchanged when there are no anchor tags', () => {
    const input = '<p>Just some content here.</p>';
    expect(stripReadMoreParagraph(input)).toBe('<p>Just some content here.</p>');
  });
});

const samplePosts = [
  {
    id: '1',
    title: 'Hello World',
    slug: 'hello-world',
    date: '2024-01-01',
    excerpt: '<p>An excerpt.</p>',
  },
];

describe('Post (tags/[tag] page)', () => {
  beforeEach(() => {
    mockRouter.isFallback = false;
  });

  it('renders the tagged posts and their count', () => {
    render(<Post posts={samplePosts} tag="travel" />);

    expect(screen.getByRole('heading', { name: 'Tagged: travel' })).toBeInTheDocument();
    expect(screen.getByText('1 post tagged with travel')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Hello World' })).toHaveAttribute(
      'href',
      '/hello-world',
    );
  });

  it('uses the plural "posts" for more than one result', () => {
    render(<Post posts={[...samplePosts, { ...samplePosts[0], id: '2' }]} tag="travel" />);

    expect(screen.getByText('2 posts tagged with travel')).toBeInTheDocument();
  });

  it('picks a text colour appropriate to the title-derived background colour', () => {
    // "Hello World" hashes to a light background (azure) and "Second Post" to a
    // dark one (pink) — together they exercise both branches of getTextColour.
    render(
      <Post
        posts={[
          { ...samplePosts[0], id: '1', title: 'Hello World', slug: 'hello-world' },
          { ...samplePosts[0], id: '2', title: 'Second Post', slug: 'second-post' },
        ]}
        tag="travel"
      />,
    );

    const lightBgLink = screen.getByRole('link', { name: 'Continue reading Hello World' });
    const darkBgLink = screen.getByRole('link', { name: 'Continue reading Second Post' });

    expect(lightBgLink).toHaveStyle({ color: '#291720' });
    expect(darkBgLink).toHaveStyle({ color: '#FFFFFF' });
  });

  it('shows "Loading…" while the router is falling back', () => {
    mockRouter.isFallback = true;
    render(<Post posts={undefined as unknown as typeof samplePosts} tag="travel" />);

    expect(screen.getByTestId('post-title')).toHaveTextContent('Loading…');
  });

  it('renders a 404 error page when posts is missing and the router is not falling back', () => {
    render(<Post posts={undefined as unknown as typeof samplePosts} tag="travel" />);

    expect(screen.queryByRole('heading', { name: /Tagged:/ })).not.toBeInTheDocument();
  });
});

describe('getStaticProps', () => {
  const mockedGetPostsByTag = getPostsByTag as jest.MockedFunction<typeof getPostsByTag>;

  beforeEach(() => {
    mockedGetPostsByTag.mockReset();
  });

  it('fetches posts for the requested tag', async () => {
    mockedGetPostsByTag.mockResolvedValueOnce(samplePosts);

    const result = await getStaticProps({
      params: { tag: 'travel' },
    } as unknown as Parameters<typeof getStaticProps>[0]);

    expect(mockedGetPostsByTag).toHaveBeenCalledWith('travel');
    expect(result).toMatchObject({
      props: { posts: samplePosts, tag: 'travel' },
      revalidate: 3600,
    });
  });

  it('falls back to an empty tag string when params are missing', async () => {
    mockedGetPostsByTag.mockResolvedValueOnce([]);

    await getStaticProps({ params: undefined } as unknown as Parameters<typeof getStaticProps>[0]);

    expect(mockedGetPostsByTag).toHaveBeenCalledWith('');
  });

  it('uses the first value when the tag param is an array', async () => {
    mockedGetPostsByTag.mockResolvedValueOnce([]);

    await getStaticProps({
      params: { tag: ['travel', 'music'] },
    } as unknown as Parameters<typeof getStaticProps>[0]);

    expect(mockedGetPostsByTag).toHaveBeenCalledWith('travel');
  });
});

describe('getStaticPaths', () => {
  const mockedGetAllTags = getAllTags as jest.MockedFunction<typeof getAllTags>;

  beforeEach(() => {
    mockedGetAllTags.mockReset();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('builds a path for every tag when the fetch succeeds', async () => {
    mockedGetAllTags.mockResolvedValueOnce([
      { name: 'Travel', slug: 'travel', count: 3 },
      { name: 'Music', slug: 'music', count: 2 },
    ]);

    const result = await getStaticPaths({} as never);

    expect(result).toEqual({
      paths: [{ params: { tag: 'travel' } }, { params: { tag: 'music' } }],
      fallback: 'blocking',
    });
  });

  it('returns an empty path list and logs the error when the fetch fails', async () => {
    mockedGetAllTags.mockRejectedValueOnce(new Error('WordPress is down'));

    const result = await getStaticPaths({} as never);

    expect(result).toEqual({ paths: [], fallback: 'blocking' });
    expect(console.error).toHaveBeenCalledWith(
      'getStaticPaths: failed to fetch tags from WordPress',
      expect.any(Error),
    );
  });
});
