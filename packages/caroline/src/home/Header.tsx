import { css, Global } from '@emotion/react';
import { useRouter } from 'next/dist/client/router';
import { Attributes } from 'react';
import { HeaderButton } from './HeaderButton';
import { locale } from 'src/locale/locale';
import { me } from 'src/me';

export const Header = () => {
  const router = useRouter();
  const height = '2.5em';
  const partsCss: Attributes['css'] = {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
  };
  const l = locale.useL();
  me.useSelector();

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
          {me.loggedIn ? (
            me.penName
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
