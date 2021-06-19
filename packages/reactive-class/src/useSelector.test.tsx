import React from 'react';
import { create, act, ReactTestRenderer } from 'react-test-renderer';
import { Subject } from 'rxjs';
import { ReactiveClass } from './ReactiveClass';
import { useSelector } from './useSelector';

describe('useSelector', () => {
  it('update render when reactive class changed', () => {
    class Some extends ReactiveClass {
      prop = 'a';
    }
    const some = new Some();

    const Component = ({ s }: { s: Some }) => {
      const prop = useSelector(s, (ls) => ls.prop);
      return <>{prop}</>;
    };

    let component!: ReactTestRenderer;
    void act(() => {
      component = create(<Component s={some} />);
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(((some as any).subject as Subject<Some>).observers.length).toBe(1);
    expect(component.toJSON()).toMatchSnapshot();

    void act(() => {
      some.prop = 'b';
    });
    expect(component.toJSON()).toMatchSnapshot();

    void act(() => {
      component.unmount();
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(((some as any).subject as Subject<Some>).observers.length).toBe(0);
    expect(component.toJSON()).toMatchSnapshot();
  });
});
