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

export type IntroProps = {
  jamesImages: {
    edges: {
      node: {
        title: string;
        featuredImage: {
          node: {
            id: string;
            uri: string;
            mediaDetails: {
              height: number;
              width: number;
              sizes: {
                name: string;
                sourceUrl: string;
              }[];
            };
          };
        };
      };
    }[];
  };
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
      };
    }[];
  };
  preview: string;
  jamesImages: {
    edges: {
      node: {
        title: string;
        featuredImage: {
          node: {
            id: string;
            uri: string;
            mediaDetails: {
              height: number;
              width: number;
              sizes: {
                name: string;
                sourceUrl: string;
              }[];
            };
          };
        };
      };
    }[];
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
  canonical: string;
  focuskw: string;
  metaDesc: string;
  metaKeywords: string;
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
  opengraphUrl: string;
  opengraphSiteName: string;
  title: string;
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
