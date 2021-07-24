import Head from 'next/head';
import { Props } from 'react-utils';
import { Header } from './Header';

const Text = ({ className, children }: Props) => {
  return <div className={className}>{children}</div>;
};

export const Home = () => {
  return (
    <>
      <Head>
        <title>Caroline</title>
      </Head>
      <Header />
      <div css={{ color: 'red', ':hover': { color: 'green' } }}>Hello</div>
      <Text css={{ color: 'hotpink', ':hover': { color: 'yellow' } }}>
        text
      </Text>
    </>
  );
};
