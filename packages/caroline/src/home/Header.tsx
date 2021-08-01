import { css, Global } from '@emotion/react';
import { useRouter } from 'next/dist/client/router';
import { Attributes } from 'react';
import { HeaderButton } from './HeaderButton';
import { App } from 'src/App';

export const Header = () => {
  const router = useRouter();
  const height = '2.5em';
  const partsCss: Attributes['css'] = {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
  };
  const app = App.useApp();
  const [{ l }] = app.locale.useState();
  const [meValue] = app.me.useState();

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
          {meValue ? (
            meValue.penName
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
