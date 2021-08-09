import { useCallback, useRef, useMemo } from 'react';
import { Props, useSafeState } from 'react-utils';
import { Vector } from 'src/Vector';
import { PopUp } from 'src/components/PopUp';

export const usePopUp = () => {
  const [popUpPos, setPopUpPos] = useSafeState<Vector | undefined>(undefined);
  const closePopUp = useCallback(() => {
    setPopUpPos(undefined);
  }, [setPopUpPos]);
  const addedEventListenerRef = useRef(false);

  return useMemo(
    () => ({
      PopUpComponent: ({ className, children }: Props) =>
        popUpPos ? (
          <PopUp
            className={className}
            position={popUpPos}
            placement="left-start"
          >
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
    }),
    [closePopUp, popUpPos, setPopUpPos]
  );
};
