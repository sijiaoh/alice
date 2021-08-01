/* eslint-disable react-hooks/rules-of-hooks */

import autobind from 'autobind-decorator';
import { produce } from 'immer';
import React, { useEffect } from 'react';
import { Props } from 'react-utils';
import {
  atom,
  RecoilState,
  useRecoilCallback,
  RecoilValue,
  Loadable,
  useRecoilState,
  RecoilRoot,
  useRecoilTransactionObserver_UNSTABLE,
} from 'recoil';

@autobind
export class ReactiveClass<T> {
  static readonly notProvideError = 'ReactiveClass.Provider not provided.';
  static get?: <U>(recoilValue: RecoilValue<U>) => Loadable<U>;
  static set?: <U>(
    recoilVal: RecoilState<U>,
    valOrUpdater: U | ((currVal: U) => U)
  ) => void;

  static Component({ children }: Props) {
    const initialize = useRecoilCallback(({ snapshot, set }) => {
      ReactiveClass.get = snapshot.getLoadable;
      ReactiveClass.set = set;
      return () => {};
    });
    useRecoilTransactionObserver_UNSTABLE(({ snapshot }) => {
      ReactiveClass.get = snapshot.getLoadable;
    });
    // jest用呼び出し。
    useEffect(() => {
      initialize();
    }, [initialize]);
    return <>{children}</>;
  }

  static Provider({ children }: Props) {
    const { Component } = ReactiveClass;
    return (
      <RecoilRoot>
        <Component>{children}</Component>
      </RecoilRoot>
    );
  }

  readonly state: RecoilState<T>;

  constructor(key: string, defaultStore: T) {
    this.state = atom({ key, default: defaultStore });
  }

  getState() {
    if (!ReactiveClass.get) throw new Error(ReactiveClass.notProvideError);
    return ReactiveClass.get(this.state).getValue();
  }

  setState(state: T) {
    if (!ReactiveClass.set) throw new Error(ReactiveClass.notProvideError);
    ReactiveClass.set(this.state, state);
  }

  changeState(callback: (state: T) => T | void) {
    this.setState(produce(this.getState(), callback));
  }

  useState() {
    return useRecoilState(this.state);
  }
}
