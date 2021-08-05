/* eslint-disable react-hooks/rules-of-hooks */

import autobind from 'autobind-decorator';
import { produce } from 'immer';

@autobind
export class ReactiveClass<T> {
  static readonly notProvideError = 'ReactiveClass.Provider not provided.';

  _data: Readonly<T>;

  get data() {
    return this._data;
  }
  set data(data: Readonly<T>) {
    this._data = data;
  }

  constructor(defaultData: Readonly<T>) {
    this._data = defaultData;
  }

  changeData(callback: (data: T) => Readonly<T> | void) {
    this.data = produce(this.data, callback);
  }
}
