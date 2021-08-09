import { useRouter } from 'next/dist/client/router';
import { HeaderButton } from './HeaderButton';
import { App } from 'src/App';
import { usePopUp } from 'src/hooks/usePopUp';
import { sdk } from 'src/sdk';

export const UserMenu = () => {
  const app = App.useApp();
  const l = app.locale.useSelector((data) => data.l);
  const meData = app.me.useSelector();
  const { PopUpComponent, openPopUp } = usePopUp();
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
        {meData?.penName}
      </HeaderButton>
      <PopUpComponent>
        <HeaderButton
          onClick={async () => {
            await router.push('/repositories');
          }}
          css={{
            padding: '0.5em',
            backgroundColor: 'rgb(230,230,230)',
          }}
        >
          {l?.repositories}
        </HeaderButton>
        <HeaderButton
          onClick={async () => {
            await sdk.Logout();
            document.location.reload();
          }}
          css={{
            padding: '0.5em',
            backgroundColor: 'rgb(230,230,230)',
          }}
        >
          {l?.logout}
        </HeaderButton>
      </PopUpComponent>
    </>
  );
};
