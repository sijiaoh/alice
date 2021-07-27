import { ReactiveClass } from '../../reactive-class/build';
import { sdk } from './sdk';
import { UserType } from 'src/generated/graphql';

class Me extends ReactiveClass implements Omit<UserType, '__typename'> {
  loggedIn = false;
  id = '';
  penName = '';

  constructor() {
    super();
    void this.load();
  }

  async load() {
    if (typeof window === 'undefined') return;

    const me = await sdk
      .Me()
      .then((res) => res.me)
      .catch(() => null);
    if (!me) return;

    this.loggedIn = true;
    this.id = me.id;
    this.penName = me.penName;
  }
}

export const me = new Me();
