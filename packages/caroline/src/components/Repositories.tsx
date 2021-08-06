import Link from 'next/link';
import { App } from 'src/App';

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
