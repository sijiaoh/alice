import { useRouter } from 'next/dist/client/router';
import { useSafeState } from 'react-utils';
import { HeaderButton } from './HeaderButton';
import { App } from 'src/App';
import { usePopUp } from 'src/hooks/usePopUp';
import { sdk } from 'src/sdk';

export const DebugLogin = () => {
  const app = App.useApp();
  const l = app.locale.useSelector((data) => data.l);
  const { PopUpComponent, openPopUp } = usePopUp();
  const [id, setId] = useSafeState('debugUser');
  const router = useRouter();

  return (
    <>
      <HeaderButton
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          openPopUp({
            x: rect.x + rect.width,
            y: rect.y + rect.height,
          });
        }}
      >
        {l?.login}
      </HeaderButton>
      <PopUpComponent>
        <HeaderButton
          onClick={async () => {
            await router.push('/api/login/google');
          }}
          css={{
            padding: '0.5em',
            backgroundColor: 'rgb(230,230,230)',
          }}
        >
          Normal login
        </HeaderButton>
        <input
          value={id}
          onChange={(e) => {
            setId(e.target.value);
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
        <HeaderButton
          onClick={async () => {
            await sdk.DebugLogin({ id });
            document.location.reload();
          }}
          css={{
            padding: '0.5em',
            backgroundColor: 'rgb(230,230,230)',
          }}
        >
          Debug login
        </HeaderButton>
      </PopUpComponent>
    </>
  );
};
