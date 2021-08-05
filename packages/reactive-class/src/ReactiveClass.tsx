/* eslint-disable react-hooks/rules-of-hooks */

import autobind from 'autobind-decorator';
import { produce } from 'immer';
import { AsyncSubject, Unsubscribe } from 'observer-pattern';

interface Selector<T> {
  (): T;
}

interface DataSelector<T, U> {
  (data: T): U;
}

interface VoidCallback {
  (): Promise<void> | void;
}

interface Callback<T> {
  (param: T): Promise<void> | void;
}

@autobind
export class ReactiveClass<T> {
  static readonly notProvideError = 'ReactiveClass.Provider not provided.';
  static subject = new AsyncSubject();

  static subscribe(callback: VoidCallback): Unsubscribe;
  static subscribe<T>(
    selector: Selector<T>,
    callback: Callback<T>
  ): Unsubscribe;
  static subscribe<T>(
    selectorOrCallback: Selector<T> | VoidCallback,
    callback?: Callback<T>
  ): Unsubscribe {
    if (!callback) {
      const cb = selectorOrCallback as VoidCallback;
      return this.subject.subscribe(async () => {
        await cb();
      });
    }

    let prevSelected: T | undefined;
    let selected: T;
    const selector = selectorOrCallback as Selector<T>;
    return this.subject.subscribe(
      async () => {
        await callback(selected);
      },
      () => {
        selected = selector();
        if (selected === prevSelected) return false;
        prevSelected = selected;
        return true;
      }
    );
  }

  private static update() {
    this.subject.update();
  }

  _data: Readonly<T>;

  get data() {
    return this._data;
  }
  set data(data: Readonly<T>) {
    const prevData = this._data;
    this._data = data;
    if (this._data !== prevData) {
      ReactiveClass.update();
    }
  }

  constructor(defaultData: Readonly<T>) {
    this._data = defaultData;
  }

  changeData(callback: (data: T) => Readonly<T> | void) {
    this.data = produce(this.data, callback);
  }

  subscribe(callback: Callback<T>): Unsubscribe;
  subscribe<U>(
    selector: DataSelector<T, U>,
    callback: Callback<U>
  ): Unsubscribe;
  subscribe<U>(
    callbackOrSelector: DataSelector<T, U> | Callback<T>,
    callback?: Callback<U>
  ): Unsubscribe {
    if (!callback) {
      const cb = callbackOrSelector as Callback<T>;
      return ReactiveClass.subscribe(() => this.data, cb);
    }

    const selector = callbackOrSelector as DataSelector<T, U>;
    return ReactiveClass.subscribe(() => selector(this.data), callback);
  }
}
