import Head from 'next/head';
import { Props } from 'src/Props';

const Text = ({ className, children }: Props) => {
  return <div className={className}>{children}</div>;
};

export default function Home() {
  return (
    <>
      <Head>
        <title>Caroline</title>
      </Head>
      <div css={{ color: 'red', ':hover': { color: 'green' } }}>Hello</div>
      <Text css={{ color: 'hotpink', ':hover': { color: 'yellow' } }}>
        text
      </Text>
    </>
  );
}
