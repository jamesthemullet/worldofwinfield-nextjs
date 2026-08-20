import { render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import type { PostProps } from '../lib/types';
import PostPage from '../pages/[slug]';

const mockRouter = { isFallback: false };

jest.mock('next/router', () => ({
  useRouter: () => mockRouter,
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
  default: ({ title }: { title: string }) => <div data-testid="post-header">{title}</div>,
}));

jest.mock('../components/post-title', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="post-title">{children}</div>
  ),
}));

jest.mock('../components/post-body', () => ({
  __esModule: true,
  default: ({ content }: { content: string }) => (
    <div data-testid="post-body" dangerouslySetInnerHTML={{ __html: content }} />
  ),
}));

jest.mock('../components/pre-post', () => ({
  __esModule: true,
  default: () => <div data-testid="pre-post" />,
}));

jest.mock('../components/tags', () => ({
  __esModule: true,
  default: ({ tags }: { tags: { edges: { node: { name: string } }[] } }) => (
    <div data-testid="tags">
      {tags.edges.map((e) => (
        <span key={e.node.name}>{e.node.name}</span>
      ))}
    </div>
  ),
}));

jest.mock('../components/share-bar', () => ({
  __esModule: true,
  default: () => <div data-testid="share-bar" />,
}));

jest.mock('../components/related-posts', () => ({
  __esModule: true,
  default: ({ posts }: { posts: { title: string; slug: string }[] }) => (
    <div data-testid="related-posts">
      {posts.map((p) => (
        <div key={p.slug}>{p.title}</div>
      ))}
    </div>
  ),
}));

jest.mock('../components/post-navigation', () => ({
  __esModule: true,
  default: () => <div data-testid="post-navigation" />,
}));

jest.mock('../components/section-separator', () => ({
  __esModule: true,
  default: () => <div data-testid="section-separator" />,
}));

jest.mock('../pages/404', () => ({
  __esModule: true,
  default: () => <div data-testid="custom-404">Page not found</div>,
}));

const mockPost = {
  slug: 'my-test-post',
  title: 'My Test Post',
  featuredImage: {
    node: {
      sourceUrl: '/post.jpg',
      mediaDetails: { height: 100, width: 100, sizes: '', srcset: '' },
      caption: 'Test caption',
    },
  },
  date: '2024-01-15T00:00:00',
  modified: '2024-01-16T00:00:00',
  content: '<p>Post content here</p>',
  author: {
    node: {
      name: 'James Winfield',
      firstName: 'James',
      lastName: 'Winfield',
      avatar: { url: '/avatar.jpg' },
      description: 'Writer',
    },
  },
  categories: { edges: { node: { name: 'Travel' } } },
  tags: { edges: [] },
  seo: {
    opengraphDescription: 'Post description',
    opengraphImage: null,
    opengraphTitle: 'My Test Post',
    opengraphSiteName: 'World Of Winfield',
  },
};

const makeProps = (overrides: Partial<PostProps> = {}): PostProps =>
  ({
    post: mockPost,
    preview: false,
    relatedPosts: [],
    adjacentPosts: { previousPost: null, nextPost: null },
    ...overrides,
  }) as unknown as PostProps;

describe('Post page ([slug].tsx)', () => {
  beforeEach(() => {
    mockRouter.isFallback = false;
  });

  it('shows a loading title when router is in fallback state', () => {
    mockRouter.isFallback = true;
    render(<PostPage {...makeProps()} />);
    expect(screen.getByTestId('post-title')).toHaveTextContent('Loading…');
    expect(screen.queryByTestId('post-header')).not.toBeInTheDocument();
  });

  it('shows the 404 page when the post has no slug', () => {
    render(<PostPage {...makeProps({ post: { ...mockPost, slug: '' } as typeof mockPost })} />);
    expect(screen.getByTestId('custom-404')).toBeInTheDocument();
  });

  it('renders the post header with the post title', () => {
    render(<PostPage {...makeProps()} />);
    expect(screen.getByTestId('post-header')).toHaveTextContent('My Test Post');
  });

  it('renders the post body with post content', () => {
    render(<PostPage {...makeProps()} />);
    expect(screen.getByTestId('post-body')).toBeInTheDocument();
    expect(screen.getByText('Post content here')).toBeInTheDocument();
  });

  it('renders related posts when relatedPosts is non-empty', () => {
    const relatedPosts = [
      {
        title: 'Related Post A',
        slug: 'related-a',
        date: '2023-01-01',
        excerpt: 'Excerpt A',
        featuredImage: null,
      },
    ];
    render(<PostPage {...makeProps({ relatedPosts })} />);
    expect(screen.getByTestId('related-posts')).toBeInTheDocument();
    expect(screen.getByText('Related Post A')).toBeInTheDocument();
  });

  it('does not render related posts when relatedPosts is empty', () => {
    render(<PostPage {...makeProps({ relatedPosts: [] })} />);
    expect(screen.queryByTestId('related-posts')).not.toBeInTheDocument();
  });

  it('renders tags when the post has tags', () => {
    const postWithTags = {
      ...mockPost,
      tags: { edges: [{ node: { name: 'music' } }, { node: { name: 'culture' } }] },
    };
    render(<PostPage {...makeProps({ post: postWithTags as typeof mockPost })} />);
    expect(screen.getByTestId('tags')).toBeInTheDocument();
    expect(screen.getByText('music')).toBeInTheDocument();
    expect(screen.getByText('culture')).toBeInTheDocument();
  });

  it('does not render tags when the post has no tags', () => {
    render(<PostPage {...makeProps()} />);
    expect(screen.queryByTestId('tags')).not.toBeInTheDocument();
  });
});
