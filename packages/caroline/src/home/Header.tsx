import { css, Global } from '@emotion/react';
import { useRouter } from 'next/dist/client/router';
import { Attributes } from 'react';
import { useSafeState } from 'react-utils';
import { HeaderButton } from './HeaderButton';
import { App } from 'src/App';
import { Vector } from 'src/Vector';
import { PopUp } from 'src/components/PopUp';

export const Header = () => {
  const router = useRouter();
  const height = '2.5em';
  const partsCss: Attributes['css'] = {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
  };
  const app = App.useApp();
  const l = app.locale.useSelector((data) => data.l);
  const meData = app.me.useSelector();
  const [popUpPos, setPopUpPos] = useSafeState<Vector | undefined>(undefined);

  const dropdown = popUpPos ? (
    <PopUp position={popUpPos} placement="left-start">
      <HeaderButton
        onClick={async () => {
          await router.push('/repositories');
        }}
        css={{ padding: '0.5em', backgroundColor: 'rgb(230,230,230)' }}
      >
        {l?.repositories}
      </HeaderButton>
    </PopUp>
  ) : null;

  return (
    <>
      <Global
        styles={css({
          body: { paddingTop: height },
        })}
      />

      <div
        css={{
          position: 'fixed',
          top: 0,
          width: '100%',
          height,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div css={partsCss}>
          <HeaderButton
            onClick={async () => {
              await router.push('/');
            }}
          >
            {l?.title}
          </HeaderButton>
        </div>
        <div css={partsCss}>
          {meData ? (
            <>
              <HeaderButton
                onClick={(e) => {
                  if (popUpPos) {
                    setPopUpPos(undefined);
                  } else {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setPopUpPos({
                      x: rect.x + rect.width,
                      y: rect.y + rect.height,
                    });
                  }
                }}
              >
                {meData.penName}
              </HeaderButton>
              {dropdown}
            </>
          ) : (
            <HeaderButton
              onClick={async () => {
                await router.push('/api/login/google');
              }}
            >
              {l?.login}
            </HeaderButton>
          )}
        </div>
      </div>
    </>
  );
};
