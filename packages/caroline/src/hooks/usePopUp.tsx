import { useCallback, useRef } from 'react';
import { Props, useSafeState } from 'react-utils';
import { PopUp } from 'src/components/PopUp';
import { Vector } from 'src/Vector';

export const usePopUp = () => {
  const [popUpPos, setPopUpPos] = useSafeState<Vector | undefined>(undefined);
  const closePopUp = useCallback(() => {
    setPopUpPos(undefined);
  }, []);
  const addedEventListenerRef = useRef(false);

  return {
    PopUpComponent: ({ className, children }: Props) =>
      popUpPos ? (
        <PopUp className={className} position={popUpPos} placement="left-start">
          {children}
        </PopUp>
      ) : null,
    openPopUp: (position: Vector) => {
      if (addedEventListenerRef.current) {
        document.removeEventListener('click', closePopUp);
        addedEventListenerRef.current = false;
      }
      setTimeout(() => {
        if (addedEventListenerRef.current) {
          document.removeEventListener('click', closePopUp);
          addedEventListenerRef.current = false;
        }
        document.addEventListener('click', closePopUp);
        addedEventListenerRef.current = true;
      }, 0);
      if (popUpPos) {
        setPopUpPos(undefined);
      } else {
        setPopUpPos(position);
      }
    },
  };
};
