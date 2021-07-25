import { ReactiveClass } from 'reactive-class';
import { ja } from './ja';

export type Lang = 'ja' | 'en' | 'cn';

export class Locale extends ReactiveClass {
  lang: Lang = 'ja';
  l: typeof ja | undefined;
  private prevLang: Lang | undefined;

  constructor() {
    super();
    this.setReactiveProps(['lang', 'l']);
    void this.changeLanguage(this.lang);
    this.subscribe(async () => {
      await this.changeLanguage(this.lang);
    });
  }

  async changeLanguage(lang: Lang) {
    if (typeof window === 'undefined' || this.lang === this.prevLang) return;

    this.prevLang = this.lang;
    this.lang = lang;

    switch (lang) {
      case 'ja':
        this.l = await import('./ja').then((c) => c.ja);
        break;
      default:
        this.l = await import('./ja').then((c) => c.ja);
        break;
    }
  }

  useL() {
    return this.useSelector(() => this.l);
  }
}

export const locale = new Locale();
