import autobind from 'autobind-decorator';
import { sleep } from 'sleep';
import { v4 } from 'uuid';
import { AsyncObserver } from './AsyncObserver';
import { Unsubscribe } from './Subject';

interface CheckUpdate {
  (): Promise<boolean> | boolean;
}

type ObserverData =
  | {
      observer: AsyncObserver;
      calling: boolean;
      reserved: boolean;
      checkUpdate: CheckUpdate;
    }
  | undefined;

@autobind
export class AsyncSubject {
  readonly observerDatas: {
    [id: string]: ObserverData;
  } = {};

  subscribe(
    observer: AsyncObserver,
    checkUpdate: CheckUpdate = () => true
  ): Unsubscribe {
    const id = v4();
    this.observerDatas[id] = {
      observer,
      calling: false,
      reserved: false,
      checkUpdate,
    };
    return () => {
      delete this.observerDatas[id];
    };
  }

  execAndSubscribe(
    observer: AsyncObserver,
    checkUpdate: CheckUpdate = () => true
  ): Unsubscribe {
    const id = v4();
    const data = { observer, calling: false, reserved: false, checkUpdate };
    this.observerDatas[id] = data;

    void this.updateObserver([id, data], checkUpdate);

    return () => {
      delete this.observerDatas[id];
    };
  }

  update(checkUpdate: CheckUpdate = () => true) {
    if (this.destroyed)
      throw new Error('Can not call update after called destroy');

    Object.entries(this.observerDatas).forEach(
      (entry) => void this.updateObserver(entry, checkUpdate)
    );
  }

  async destroy() {
    this.destroyed = true;
    const promises = Object.keys(this.observerDatas).map(async (id) => {
      // eslint-disable-next-line no-await-in-loop
      while (this.observerDatas[id]?.calling) await sleep(1);

      const data = this.observerDatas[id];
      if (!data) return;

      const { observer } = data;
      if (typeof observer !== 'function') await observer.onDestroy?.();
    });
    await Promise.all(promises);
  }

  private async updateObserver(
    [id, data]: [string, ObserverData],
    checkUpdate: CheckUpdate
  ) {
    if (!data) return;
    if (!(await checkUpdate())) return;
    if (!(await data.checkUpdate())) return;
    if (data.calling) {
      data.reserved = true;
      return;
    }

    const { observer } = data;

    const call = () => {
      const core = async () => {
        const d = this.observerDatas[id];
        if (!d) return;
        d.reserved = false;

        if (typeof observer === 'function') await observer();
        else await observer.onUpdate?.();

        // await中に削除される可能性を考慮する。
        const newData = this.observerDatas[id];
        if (!newData) return;

        if (newData.reserved) call();
        else newData.calling = false;
      };

      if (process.env.ENV !== 'test') {
        setTimeout(() => {
          void core();
        }, 0);
      } else {
        void core();
      }
    };

    data.calling = true;
    call();
  }

  private destroyed = false;
}
