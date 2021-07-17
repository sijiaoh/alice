import { useIsBrowser } from 'react-utils';

const Editor = () => {
  return <p>Client side only render</p>;
};

export default function Wrapper() {
  const isBrowser = useIsBrowser();
  return isBrowser ? <Editor /> : null;
}
