import autobind from 'autobind-decorator';
import { Unsubscribe } from '../../observer-pattern/build';
import { ReactiveClass } from '../../reactive-class/build';
// eslint-disable-next-line import/no-cycle
import { App } from './App';
import { sdk } from './sdk';
import { UserType } from 'src/generated/graphql';

type MeData = Omit<UserType, '__typename'> | undefined;

@autobind
export class Me extends ReactiveClass<MeData> {
  unsubscribeTranslate?: Unsubscribe;

  constructor() {
    super(undefined);
    void this.load();
  }

  async load() {
    if (typeof window === 'undefined') return;

    const me = await sdk
      .Me()
      .then((res) => res.me)
      .catch(() => {
        return null;
      });
    if (!me) return;

    this.unsubscribeTranslate?.();
    this.unsubscribeTranslate = ReactiveClass.subscribe(
      () => ({
        l: App.instance.locale.data.l,
        meData: this.data,
      }),
      ({ l }) => {
        this.changeData((data) => {
          if (data?.penName !== 'defaultPenName') return;
          if (!l) return;
          data.penName = l.defaultPenName;
        });
      }
    );

    this.data = {
      id: me.id,
      penName: me.penName,
    };
  }
}
