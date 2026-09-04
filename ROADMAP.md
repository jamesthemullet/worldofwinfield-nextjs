# Product Roadmap — World of Winfield

The site already has real breadth — blog, favourites, goals, an interactive travel map — but
these sections don't reference each other, so a visitor reading a blog post has no path into the
rest of the site. Everything below is scored against four jobs:

- **Acquisition** — brings new visitors in
- **Engagement** — deepens a single visit
- **Retention** — earns a repeat visit
- **Fun** — no metric, just delight

Every feature is broken into a **PR sequence** — each step small enough for a human to review in
about 15 minutes. Genuinely atomic changes are left as one PR.

## Now (ship in weeks — reuses existing infra)

### 1. Related posts — *Engagement, Retention*
"You might also like" links at the bottom of a blog post, so a visit doesn't dead-end after one
article.

1. Pure function matching posts by shared tags/topic (reads whatever metadata posts already
   carry) + tests.
2. Component rendering the related-posts list on the post page.

### 2. Travel map → blog cross-links — *Engagement, Fun*
Where the travel map shows a visited country/city that's also the subject of a blog post,
clicking it should surface that post — improving an existing page rather than building a new one.

1. A matching function keying map locations to blog posts by place name/tag — pure function +
   tests.
2. Wire matched posts into the map's existing click/hover interaction.

### 3. Article structured data — *Acquisition, SEO*
Article/Person structured data on blog posts and the homepage so search engines understand
authorship and content type, complementing the existing `next-sitemap` setup.

1. **One PR.** A single JSON-LD block added to the post template and homepage from fields that
   already exist.

## Next (this quarter — moderate new build)

### 4. Favourites → blog cross-links — *Engagement*
Where a favourite (a book, film, album) is discussed in a blog post, link between the favourite
entry and the post.

1. A matching function keying posts to favourite entries by title/tag — pure function + tests.
2. "Mentioned in a post" callout on the favourite entry, and a "see this favourite" link on the
   post.

---
*World of Winfield — product roadmap, 2 September 2026*
