import autobind from 'autobind-decorator';
import { AsyncObserver, AsyncSubject } from 'observer-pattern';

@autobind
export class ReactiveClass {
  readonly subject = new AsyncSubject();

  constructor() {
    const self = new Proxy(this, {
      set: (target, p: keyof ReactiveClass, value: never) => {
        if (target[p] === value) return true;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line no-param-reassign
        target[p] = value;
        if (
          p.toString() !== 'reacting' &&
          this.reacting &&
          (this.reactiveProps === null || this.reactiveProps.includes(p))
        )
          this.subject.update();
        return true;
      },
    });
    return self;
  }

  subscribe(arg: AsyncObserver) {
    return this.subject.subscribe(arg);
  }

  async destroy() {
    await this.subject.destroy();
  }

  setReactiveProps(props: (keyof this)[]) {
    this.reactiveProps = props as (keyof ReactiveClass)[];
  }

  private reactiveProps: (keyof ReactiveClass)[] | null = null;
  protected reacting = true;
}
