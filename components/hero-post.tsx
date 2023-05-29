import Avatar from "./avatar";
import Date from "./date";
import CoverImage from "./cover-image";
import Link from "next/link";

export default function HeroPost({
  title,
  coverImage,
  date,
  excerpt,
  author,
  slug,
}) {
  return (
    <section>
      <div>
        {coverImage && (
          <CoverImage title={title} coverImage={coverImage} slug={slug} />
        )}
      </div>
      <div>
        <div>
          <h3>
            <Link
              href={`/posts/${slug}`}
              dangerouslySetInnerHTML={{ __html: title }}
            ></Link>
          </h3>
          <div>
            <Date dateString={date} />
          </div>
        </div>
        <div>
          <div dangerouslySetInnerHTML={{ __html: excerpt }} />
          <Avatar author={author} />
        </div>
      </div>
    </section>
  );
}
