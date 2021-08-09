import { Props } from 'react-utils';
import { HeaderButton, HeaderButtonOnClick } from './HeaderButton';

export const HeaderDropdownButton = ({
  onClick,
  children,
}: Props<{ onClick: HeaderButtonOnClick }>) => {
  return (
    <HeaderButton
      onClick={onClick}
      css={{
        padding: '0.5em',
        backgroundColor: 'rgb(230,230,230)',
      }}
    >
      {children}
    </HeaderButton>
  );
};
