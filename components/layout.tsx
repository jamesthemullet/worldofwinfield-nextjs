import Alert from './alert';
import Footer from './footer';
import Meta from './meta';
import { LayoutProps } from '../lib/types';

export default function Layout({ preview, children, seo }: LayoutProps) {
  console.log(3, seo);
  return (
    <>
      <Meta seo={seo} />
      <div>
        <Alert preview={preview} />
        <main>{children}</main>
      </div>
      <Footer />
    </>
  );
}
