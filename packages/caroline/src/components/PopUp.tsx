import { Placement } from '@popperjs/core';
import React, { useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { usePopper } from 'react-popper';
import { Props, useSafeState } from 'react-utils';
import { Vector } from 'src/Vector';

export const PopUp = ({
  className,
  position,
  placement,
  children,
}: Props<{
  position: Vector;
  placement?: Placement;
}>) => {
  const virtualElement = useMemo(
    () => ({
      getBoundingClientRect: () => {
        const { x } = position;
        const { y } = position;

        return {
          width: 0,
          height: 0,
          top: y,
          right: x,
          bottom: y,
          left: x,
        };
      },
    }),
    [position]
  );

  const [ref, setRef] = useSafeState<HTMLDivElement | null>(null);
  const { styles, attributes, update } = usePopper(virtualElement, ref, {
    placement,
  });

  useEffect(() => {
    update?.();
  }, [update]);

  return useMemo(
    () => (
      <>
        {createPortal(
          <div
            ref={setRef}
            className={className}
            style={styles.popper}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...attributes.popper}
          >
            {children}
          </div>,
          document.querySelector('#pop-ups')!
        )}
      </>
    ),
    [className, attributes.popper, children, setRef, styles.popper]
  );
};
