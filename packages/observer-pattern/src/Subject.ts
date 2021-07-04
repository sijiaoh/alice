import autobind from 'autobind-decorator';
import { v4 } from 'uuid';
import { Observer } from './Observer';

@autobind
export class Subject {
  observers: { [id: string]: Observer } = {};

  subscribe(observer: Observer) {
    const id = v4();
    this.observers[id] = observer;
    return () => {
      delete this.observers[id];
    };
  }

  update() {
    Object.values(this.observers).forEach((observer: Observer) => {
      if (typeof observer === 'function') observer();
      else observer.onUpdate?.();
    });
  }

  destroy() {
    Object.values(this.observers).forEach((observer: Observer) => {
      if (typeof observer === 'function') observer();
      else observer.onDestroy?.();
    });
  }
}
