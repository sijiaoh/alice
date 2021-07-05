import autobind from 'autobind-decorator';
import { sleep } from 'sleep';
import { v4 } from 'uuid';
import { AsyncObserver } from './AsyncObserver';

@autobind
export class AsyncSubject {
  readonly observerDatas: {
    [id: string]:
      | { observer: AsyncObserver; calling: boolean; reserved: boolean }
      | undefined;
  } = {};

  subscribe(observer: AsyncObserver) {
    const id = v4();
    this.observerDatas[id] = { observer, calling: false, reserved: false };
    return () => {
      delete this.observerDatas[id];
    };
  }

  update() {
    if (this.destroyed)
      throw new Error('Can not call update after called destroy');

    Object.entries(this.observerDatas).forEach(([id, data]) => {
      if (!data) return;
      if (data.calling) {
        // eslint-disable-next-line no-param-reassign
        data.reserved = true;
        return;
      }

      const { observer } = data;

      const call = () => {
        setTimeout(() => {
          void (async () => {
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
          })();
        }, 0);
      };

      // eslint-disable-next-line no-param-reassign
      data.calling = true;
      call();
    });
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

  private destroyed = false;
}
