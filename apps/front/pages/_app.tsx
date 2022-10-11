// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import 'libs/user/assets/style.css';
import '../styles/global.css';
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
        <ul className="flex flex-row justify-around align-middle items-center underline text-white bg-blue-400">
          <li>
            <Link href="/widget">Widget</Link>
          </li>
          <li>
            <Link href="/page">Page</Link>
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
