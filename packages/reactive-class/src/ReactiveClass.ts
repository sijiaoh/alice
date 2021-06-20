import autobind from 'autobind-decorator';
import { Observer, Subject } from 'rxjs';

@autobind
export class ReactiveClass {
  constructor() {
    const self = new Proxy(this, {
      set: (target, p: keyof ReactiveClass, value: never) => {
        if (target[p] === value) return true;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line no-param-reassign
        target[p] = value;
        if (p.toString() !== 'reacting' && this.reacting) this.subject.next();
        return true;
      },
    });
    return self;
  }

  destroy() {
    this.subject.complete();
  }

  subscribe(arg: Partial<Observer<void>> | (() => void)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const subscription = this.subject.subscribe(arg as any);
    return () => subscription.unsubscribe();
  }

  get observable() {
    return this.subject.asObservable();
  }

  private subject = new Subject<void>();
  protected reacting = true;
}
