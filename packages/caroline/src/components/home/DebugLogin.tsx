import { useRouter } from 'next/dist/client/router';
import { useSafeState } from 'react-utils';
import { HeaderButton } from './HeaderButton';
import { HeaderDropdownButton } from './HeaderDropdownButton';
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
        <HeaderDropdownButton
          onClick={async () => {
            await router.push('/api/login/google');
          }}
        >
          Normal login
        </HeaderDropdownButton>
        <input
          value={id}
          onChange={(e) => {
            setId(e.target.value);
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
        <HeaderDropdownButton
          onClick={async () => {
            await sdk.DebugLogin({ id });
            document.location.reload();
          }}
        >
          Debug login
        </HeaderDropdownButton>
      </PopUpComponent>
    </>
  );
};
