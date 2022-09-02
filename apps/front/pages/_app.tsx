import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import 'libs/user/assets/style.css';
import { AppProps } from 'next/app';
import Head from 'next/head';
import Link from 'next/link';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Pagecreator</title>
      </Head>
      <main className="app">
        <ul>
          <li>
            <Link href="/widget">See Widget example</Link>
          </li>
          <li>
            <Link href="/page">See Page example</Link>
          </li>
        </ul>
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default CustomApp;
