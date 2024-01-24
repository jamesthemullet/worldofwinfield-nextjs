type SinglePostProps = {
  slug: string;
  title: string;
  featuredImage: {
    node: {
      sourceUrl: string;
      mediaDetails: {
        height: number;
        width: number;
        sizes: string;
        srcset: string;
      };
    };
  };
  date: string;
  content: string;
  author: AuthorProps;
  categories: {
    edges: {
      node: {
        name: string;
      };
    };
  };
  tags: {
    edges: {
      node: {
        name: string;
      };
    }[];
  };
  seo: seoProps;
};

export type PostProps = {
  post: SinglePostProps;
  posts: {
    edges: {
      node: {
        slug: string;
        title: string;
        featuredImage: {
          node: {
            sourceUrl: string;
            mediaDetails: {
              height: number;
              width: number;
              sizes: string;
              srcset: string;
            };
          };
        };
        date: string;
        author: AuthorProps;
        content: string;
        excerpt: string;
      };
    }[];
  };
  preview: string;
};

export type TagsPostProps = {
  posts: {
    title: string;
    slug: string;
    date: string;
    id: string;
  }[];
  tag: string;
};

export type PostsProps = {
  posts: {
    id: string;
    title: string;
    excerpt: string;
    date: string;
    slug: string;
    featuredImage: {
      node: {
        sourceUrl: string;
        mediaDetails: {
          height: number;
          width: number;
          sizes: string;
          srcset: string;
        };
      };
    };
    tags: {
      edges: {
        node: {
          name: string;
        };
      }[];
    };
    seo: seoProps;
    author: AuthorProps;
    categories: {
      edges: {
        node: {
          name: string;
        };
      };
    };
  }[];
};

export type PageProps = {
  page: SinglePostProps;
};

type AuthorProps = {
  node: {
    name: string;
    firstName: string;
    lastName: string;
    avatar: {
      url: string;
    };
    description: string;
  };
};

export type AvatarProps = {
  author: AuthorProps;
};

export type JamesImagesProps = {
  edges: {
    node: {
      title: string;
      featuredImage: {
        node: {
          mediaDetails: {
            height: number;
            width: number;
            sizes: string;
          };
          sourceUrl: string;
          srcset: string;
        };
      };
    };
  }[];
};

export type IntroProps = {
  jamesImages: JamesImagesProps;
};

export type IndexPageProps = {
  allPosts: {
    edges: {
      node: {
        slug: string;
        title: string;
        featuredImage: {
          node: {
            sourceUrl: string;
            mediaDetails: {
              height: number;
              width: number;
              sizes: string;
              srcset: string;
            };
          };
        };
        date: string;
        content: string;
        author: AuthorProps;
        excerpt: string;
        seo: seoProps;
      };
    }[];
  };
  firstPost: {
    edges: {
      node: {
        slug: string;
        title: string;
        featuredImage: {
          node: {
            sourceUrl: string;
            mediaDetails: {
              height: number;
              width: number;
              sizes: string;
            };
            srcset: string;
          };
        };
        date: string;
        content: string;
        author: AuthorProps;
        excerpt: string;
        seo: seoProps;
      };
    }[];
  };
  preview: string;
  jamesImages: JamesImagesProps;
  randomPosts: {
    slug: string;
    title: string;
    date: string;
    featuredImage: {
      node: {
        mediaDetails: {
          sizes: {
            height: number;
            width: number;
            sizes: string;
          };
          height: number;
          width: number;
        };
        srcSet: string;
        sourceUrl: string;
      };
    };
  };
  randomImageSet: {
    images:
      | {
          edges: {
            node: {
              srcSet: string;
              id: string;
            };
          };
        }[]
      | null;
  };
};

export type TagsProps = {
  tags: {
    edges: {
      node: {
        name: string;
      };
    }[];
  };
};

export type PostTitleProps = {
  backgroundColour?: string;
  children: string;
};

export type PostPreviewProps = {
  slug: string;
  title: string;
  date: string;
  coverImage: {
    node: {
      sourceUrl: string;
      mediaDetails: {
        height: number;
        width: number;
        sizes: string;
        srcset: string;
      };
    };
  };
  featuredImage: {
    node: {
      sourceUrl: string;
      mediaDetails: {
        height: number;
        width: number;
        sizes: string;
        srcset: string;
      };
    };
  };
  excerpt: string;
  author: AuthorProps;
};

export type PostHeaderProps = {
  title: string;
  imageSize?: string;
  coverImage?: {
    node: {
      sourceUrl: string;
      mediaDetails: {
        height: number;
        width: number;
        sizes: string;
        srcset: string;
      };
    };
  };
  date?: string;
  author?: AuthorProps;
  categories?: {
    edges: {
      node: {
        name: string;
      };
    };
  };
  slug?: string;
  heroPost?: boolean;
};

export type PostBodyProps = {
  content: string;
};

export type MoreStoriesProps = {
  posts: {
    node: {
      slug: string;
      title: string;
      featuredImage: {
        node: {
          sourceUrl: string;
          mediaDetails: {
            height: number;
            width: number;
            sizes: string;
            srcset: string;
          };
        };
      };
      date: string;
      author: AuthorProps;
      content: string;
      excerpt: string;
    };
  }[];
};

export type LayoutProps = {
  children: React.ReactNode;
  preview: string;
  seo?: seoProps | null;
};

export type HeroPostProps = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  author: AuthorProps;
  featuredImage: {
    node: {
      sourceUrl: string;
      mediaDetails: {
        height: number;
        width: number;
        sizes: string;
        srcset: string;
      };
    };
  };
  categories?: {
    edges: {
      node: {
        name: string;
      };
    };
  };
};

export type ContainerProps = {
  children: React.ReactNode;
};

export type CategoriesProps = {
  categories?: {
    edges:
      | {
          node: {
            name: string;
          };
        }[]
      | {
          node: {
            name: string;
          };
        };
  };
};

export type AlertProps = {
  preview: string;
};

export type seoProps = {
  opengraphDescription: string;
  opengraphImage: {
    uri: string;
    altText: string;
    mediaItemUrl: string;
    mediaDetails: {
      width: string;
      height: string;
    };
  };
  opengraphTitle: string;
  opengraphSiteName: string;
};

export type SearchBarProps = {
  onSearch: (results: string) => void;
};

export type SearchResultsProps = {
  searchResults: {
    slug: string;
    title: string;
    date: string;
  }[];
};

export type ArchivePageProps = {
  posts: PostsProps;
  month: number;
  year: number;
};
