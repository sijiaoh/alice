import autobind from 'autobind-decorator';
import { ReactiveClass } from '../../reactive-class/build';
import { sdk } from './sdk';
import { UserType } from 'src/generated/graphql';

type MeData = Omit<UserType, '__typename'> | undefined;

@autobind
export class Me extends ReactiveClass<MeData> {
  constructor() {
    super(Me.name, undefined);
    void this.load();
  }

  async load() {
    if (typeof window === 'undefined') return;

    const me = await sdk
      .Me()
      .then((res) => res.me)
      .catch(() => null);
    if (!me) return;

    this.data = {
      id: me.id,
      penName: me.penName,
    };
  }
}
