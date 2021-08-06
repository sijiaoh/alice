import { App } from 'src/App';
import Link from 'next/link';

export const Repositories = () => {
  const app = App.useApp();
  const repositoryList = app.repositoryManager.useSelector(
    (data) => data.repositoryList
  );
  return (
    <>
      {repositoryList.map((repo) => (
        <Link href={`/repository/${repo.id}`}>{repo.name}</Link>
      ))}
    </>
  );
};
