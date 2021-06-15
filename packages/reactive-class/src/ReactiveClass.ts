export interface Store {
  onChange: () => void;
}

export interface ReactiveClassConstructorParams {
  store: Store;
}

export class ReactiveClass {
  constructor({ store }: ReactiveClassConstructorParams) {
    this.store = store;
    return new Proxy(this, {
      set: (target, p: keyof ReactiveClass, value: never) => {
        // eslint-disable-next-line no-param-reassign
        target[p] = value;
        this.store.onChange();
        return true;
      },
    });
  }

  private store: Store;
}
