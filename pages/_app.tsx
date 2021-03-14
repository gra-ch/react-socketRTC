import type { AppProps } from 'next/app'
import Head from 'next/head';
import axios from 'axios';
import 'tailwindcss/tailwind.css';

function MyApp({ Component, pageProps }: AppProps) {
  axios.defaults.baseURL = 'http://localhost:3000/api/';
  return (
    <>
    <Head>
		<script type="text/javascript" src="/static/libsignal-protocol.js"></script>
		</Head>
    <Component {...pageProps} />
    </>
  )
}

export default MyApp