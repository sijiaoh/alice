import Head from 'next/head';
import { Props } from 'react-utils';
import { Col } from './Col';
import { Header } from './Header';
import { Row } from './Row';

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
      <Row>
        <Col css={{ backgroundColor: 'lightgray' }}>
          <div css={{ color: 'red', ':hover': { color: 'green' } }}>Hello</div>
        </Col>
      </Row>
      <Row>
        <Col css={{ backgroundColor: 'lightpink' }}>
          <Text css={{ color: 'hotpink', ':hover': { color: 'yellow' } }}>
            text
          </Text>
        </Col>
      </Row>
    </>
  );
};
