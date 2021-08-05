import autobind from 'autobind-decorator';
import { v4 } from 'uuid';
import { Observer } from './Observer';

export interface Unsubscribe {
  (): void;
}

@autobind
export class Subject {
  readonly observers: { [id: string]: Observer | undefined } = {};

  subscribe(observer: Observer): Unsubscribe {
    const id = v4();
    this.observers[id] = observer;
    return () => {
      delete this.observers[id];
    };
  }

  update() {
    Object.values(this.observers).forEach((observer) => {
      if (typeof observer === 'function') observer();
      else observer?.onUpdate?.();
    });
  }

  destroy() {
    Object.values(this.observers).forEach((observer) => {
      if (typeof observer === 'function') observer();
      else observer?.onDestroy?.();
    });
  }
}
