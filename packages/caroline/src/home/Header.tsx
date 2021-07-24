import { css, Global } from '@emotion/react';
import { useRouter } from 'next/dist/client/router';
import { Attributes } from 'react';

import { HeaderButton } from './HeaderButton';

const height = '2.5em';

export const Header = () => {
  const partsCss: Attributes['css'] = {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
  };

  const router = useRouter();

  const toTitle = async () => {
    await router.push('/');
  };

  const login = async () => {
    await router.push('/login/google');
  };

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
          <HeaderButton on={toTitle}>Caroline</HeaderButton>
        </div>
        <div css={partsCss}>
          <HeaderButton on={login}>Login</HeaderButton>
        </div>
      </div>
    </>
  );
};
