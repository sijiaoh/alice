import autobind from 'autobind-decorator';
import { Observer, Subject } from './Subject';

@autobind
export class ReactiveClass {
  readonly subject = new Subject();

  constructor() {
    const self = new Proxy(this, {
      set: (target, p: keyof ReactiveClass, value: never) => {
        if (target[p] === value) return true;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line no-param-reassign
        target[p] = value;
        if (p.toString() !== 'reacting' && this.reacting) this.subject.update();
        return true;
      },
    });
    return self;
  }

  destroy() {
    this.subject.destroy();
  }

  subscribe(arg: Observer | (() => void)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.subject.subscribe(arg as any);
  }

  protected reacting = true;
}
