import React from 'react';
import { create, act, ReactTestRenderer } from 'react-test-renderer';
import { ReactiveClass } from './ReactiveClass';
import { useSelector } from './useSelector';

describe('useSelector', () => {
  it('will update render', () => {
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
    expect(component.toJSON()).toMatchSnapshot();

    void act(() => {
      some.prop = 'b';
    });
    expect(component.toJSON()).toMatchSnapshot();
  });
});
