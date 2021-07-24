import { css, Global } from '@emotion/react';

const height = '1.5rem';

export const Header = () => {
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
        }}
      >
        Header
      </div>
    </>
  );
};
