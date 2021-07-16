import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Caroline</title>
      </Head>
      <div css={{ color: 'red', ':hover': { color: 'green' } }}>Hello</div>
    </>
  );
}
