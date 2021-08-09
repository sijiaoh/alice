import { useRouter } from 'next/dist/client/router';
import { HeaderButton } from './HeaderButton';
import { HeaderDropdownButton } from './HeaderDropdownButton';
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
        <HeaderDropdownButton
          onClick={async () => {
            await router.push('/repositories');
          }}
        >
          {l?.repositories}
        </HeaderDropdownButton>
        <HeaderDropdownButton
          onClick={async () => {
            await sdk.Logout();
            document.location.reload();
          }}
        >
          {l?.logout}
        </HeaderDropdownButton>
      </PopUpComponent>
    </>
  );
};
