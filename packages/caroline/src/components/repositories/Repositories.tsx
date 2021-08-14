import Link from 'next/link';
import { Col } from '../Col';
import { Row } from '../Row';
import { App } from 'src/App';

export const Repositories = () => {
  const app = App.useApp();
  const repositoryList = app.repositoryManager.useSelector(
    (data) => data.repositoryList
  );
  return (
    <>
      <Row>
        <Col>
          {repositoryList.map((repo) => (
            <Link href={`/repository/${repo.id}`}>{repo.name}</Link>
          ))}
        </Col>
      </Row>
    </>
  );
};
