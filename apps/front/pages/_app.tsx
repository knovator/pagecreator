// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import 'libs/user/assets/style.css';
import '../styles/style.css';
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
        <ul className="flex flex-row space-x-2 underline text-blue-700">
          <li>
            <Link href="/widget">See Widget example</Link>
          </li>
          <li>
            <Link href="/page">See Page example</Link>
          </li>
          <li>
            <Link href="/flipkart">Flipkart</Link>
          </li>
        </ul>
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default CustomApp;
