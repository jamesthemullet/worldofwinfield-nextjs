export type PostProps = {
  post: {
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
  };
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
  excerpt: string;
  author: AuthorProps;
};

export type PostHeaderProps = {
  title: string;
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
  date: string;
  author: AuthorProps;
  categories: {
    edges: {
      node: {
        name: string;
      };
    };
  };
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
