import autobind from 'autobind-decorator';

/**
 * テスト用Store。
 */
@autobind
export class MemoryStore {
  async getValue(key: string) {
    return Promise.resolve(this.data[key]);
  }
  async setValue(key: string, value: string) {
    await Promise.resolve(
      (() => {
        this.data[key] = value;
      })()
    );
  }
  async removeValue(key: string) {
    await Promise.resolve(
      (() => {
        delete this.data[key];
      })()
    );
  }
  data: { [key: string]: string | undefined } = {};
}
