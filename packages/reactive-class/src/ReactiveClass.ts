import autobind from 'autobind-decorator';
import { Observer, Subject } from 'rxjs';

@autobind
export class ReactiveClass {
  constructor() {
    const self = new Proxy(this, {
      set: (target, p: keyof ReactiveClass, value: never) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line no-param-reassign
        target[p] = value;
        this.subject.next(self);
        return true;
      },
    });
    return self;
  }

  destroy() {
    this.subject.complete();
  }

  subscribe(arg: Partial<Observer<this>> | ((value: this) => void)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const subscription = this.subject.subscribe(arg as any);
    return () => subscription.unsubscribe();
  }

  get observable() {
    return this.subject.asObservable();
  }

  private subject = new Subject<this>();
}
