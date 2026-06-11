import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import HomepageBlock from './homepage-block';

jest.mock('next/image', () => (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <img {...props} />
));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    children,
    href,
    'aria-label': ariaLabel,
  }: {
    children: React.ReactNode;
    href: string;
    'aria-label'?: string;
  }) => (
    <a href={href} aria-label={ariaLabel}>
      {children}
    </a>
  ),
}));

jest.mock('../pages/_app', () => ({
  colours: {
    purple: '#8884FF',
    pink: '#D90368',
    burgandy: '#820263',
    dark: '#291720',
    green: '#04A777',
    white: '#FFFFFF',
    blueish: '#547AA5',
    azure: '#3185FC',
  },
}));

jest.mock('./search-results', () => ({
  formatDate: (date: string) => `formatted:${date}`,
}));

const mockJamesImages = {
  edges: [
    {
      node: {
        title: 'James Photo',
        featuredImage: {
          node: {
            mediaDetails: { height: 100, width: 100, sizes: '' },
            sourceUrl: 'https://example.com/james.jpg',
            srcset: '',
          },
        },
      },
    },
  ],
};

const baseProps = {
  title: 'Test Block',
  url: '/test',
  size: 1 as const,
  jamesImages: mockJamesImages,
};

describe('HomepageBlock', () => {
  describe('icon mode', () => {
    it('renders the title text and icon image', () => {
      const { container } = render(<HomepageBlock {...baseProps} icon="star" />);
      expect(screen.getByText('Test Block')).toBeInTheDocument();
      expect(container.querySelector('img')).toHaveAttribute('src', '/icons/star.png');
    });

    it('links to the url with aria-label', () => {
      render(<HomepageBlock {...baseProps} icon="star" />);
      expect(screen.getByRole('link', { name: 'Test Block' })).toHaveAttribute('href', '/test');
    });

    it('falls back to "/" when url is null', () => {
      render(<HomepageBlock {...baseProps} url={null} icon="star" />);
      expect(screen.getByRole('link', { name: 'Test Block' })).toHaveAttribute('href', '/');
    });
  });

  describe('image mode', () => {
    const imageProps = {
      image: { node: { sourceUrl: 'https://example.com/photo.jpg' } },
    };

    it('renders a linked image when url and image are provided (size 1)', () => {
      const { container } = render(<HomepageBlock {...baseProps} {...imageProps} />);
      expect(screen.getByRole('link', { name: 'Test Block' })).toHaveAttribute('href', '/test');
      expect(container.querySelector('img')).toHaveAttribute('src', 'https://example.com/photo.jpg');
    });

    it('renders image at size 2 dimensions', () => {
      const { container } = render(<HomepageBlock {...baseProps} {...imageProps} size={2} />);
      const img = container.querySelector('img');
      expect(img).toHaveAttribute('width', '474');
      expect(img).toHaveAttribute('height', '474');
    });

    it('renders image at size 3 dimensions', () => {
      const { container } = render(<HomepageBlock {...baseProps} {...imageProps} size={3} />);
      const img = container.querySelector('img');
      expect(img).toHaveAttribute('width', '840');
      expect(img).toHaveAttribute('height', '840');
    });

    it('does not render a link image when title is "random photo"', () => {
      render(<HomepageBlock {...baseProps} {...imageProps} title="random photo" />);
      expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });

    it('renders no image when image prop is absent', () => {
      const { container } = render(<HomepageBlock {...baseProps} />);
      expect(container.querySelector('img')).not.toBeInTheDocument();
    });
  });

  describe('placeholder title', () => {
    it('uses jamesImages as the image source', () => {
      const { container } = render(<HomepageBlock {...baseProps} title="placeholder" size={1} />);
      expect(container.querySelector('img')).toHaveAttribute('src', 'https://example.com/james.jpg');
    });
  });

  describe('date and title overlay', () => {
    it('shows formatted date and title when url and date are provided', () => {
      render(<HomepageBlock {...baseProps} date="2024-01-15" />);
      expect(screen.getByText('Test Block')).toBeInTheDocument();
      expect(screen.getByText('formatted:2024-01-15')).toBeInTheDocument();
    });

    it('does not show overlay when url is missing', () => {
      render(<HomepageBlock {...baseProps} url={null} date="2024-01-15" />);
      expect(screen.queryByText('formatted:2024-01-15')).not.toBeInTheDocument();
    });

    it('does not show overlay when date is missing', () => {
      render(<HomepageBlock {...baseProps} />);
      expect(screen.queryByText('Test Block')).not.toBeInTheDocument();
    });
  });

  describe('label badge', () => {
    it('renders the label when provided', () => {
      render(<HomepageBlock {...baseProps} label="New" />);
      expect(screen.getByText('New')).toBeInTheDocument();
    });

    it('renders no badge when label is omitted', () => {
      render(<HomepageBlock {...baseProps} />);
      expect(screen.queryByText('New')).not.toBeInTheDocument();
    });
  });

  describe('loading strategy', () => {
    const imageProps = { image: { node: { sourceUrl: 'https://example.com/photo.jpg' } } };

    it('uses eager loading for block-1- className', () => {
      const { container } = render(
        <HomepageBlock {...baseProps} {...imageProps} className="block-1-1" />,
      );
      expect(container.querySelector('img')).toHaveAttribute('loading', 'eager');
    });

    it('uses eager loading for block-2- className', () => {
      const { container } = render(
        <HomepageBlock {...baseProps} {...imageProps} className="block-2-3" />,
      );
      expect(container.querySelector('img')).toHaveAttribute('loading', 'eager');
    });

    it('uses lazy loading for other classNames', () => {
      const { container } = render(
        <HomepageBlock {...baseProps} {...imageProps} className="block-3-1" />,
      );
      expect(container.querySelector('img')).toHaveAttribute('loading', 'lazy');
    });
  });
});
