/* eslint-disable react-hooks/rules-of-hooks */

import autobind from 'autobind-decorator';
import { produce } from 'immer';
import React, { useEffect, useState } from 'react';
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
    const dummy = useRecoilCallback(({ snapshot, set }) => {
      ReactiveClass.get = snapshot.getLoadable;
      ReactiveClass.set = set;
      return () => {};
    });

    useRecoilTransactionObserver_UNSTABLE(({ snapshot }) => {
      ReactiveClass.get = snapshot.getLoadable;
    });

    const [initialized, setInitialized] = useState(false);
    useEffect(() => {
      // jest用呼び出し。
      dummy();
      setInitialized(true);
    }, [dummy]);

    return <>{initialized ? children : null}</>;
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

  get data() {
    return this.getData();
  }
  set data(data: Readonly<T>) {
    this.setData(data);
  }

  constructor(key: string, defaultStore: Readonly<T>) {
    this.state = atom({ key, default: defaultStore });
  }

  getData() {
    if (!ReactiveClass.get) throw new Error(ReactiveClass.notProvideError);
    return ReactiveClass.get(this.state).getValue();
  }

  setData(state: Readonly<T>) {
    if (!ReactiveClass.set) throw new Error(ReactiveClass.notProvideError);
    ReactiveClass.set(this.state, state);
  }

  changeValue(callback: (state: T) => Readonly<T> | void) {
    this.setData(produce(this.getData(), callback));
  }

  useState() {
    return useRecoilState(this.state);
  }
}
