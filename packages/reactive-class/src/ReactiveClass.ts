import autobind from 'autobind-decorator';
import { Subject } from 'rxjs';

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

  get observable() {
    return this.subject.asObservable();
  }

  private subject = new Subject<this>();
}
