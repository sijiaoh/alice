import autobind from 'autobind-decorator';
import { ReactiveClass } from 'reactive-class';
import { ja } from './ja';

export type Lang = 'ja' | 'en' | 'cn';

@autobind
export class Locale extends ReactiveClass<{
  lang: Lang;
  l: typeof ja | undefined;
}> {
  private prevLang: Lang | undefined;

  constructor() {
    super(Locale.name, { lang: 'ja', l: undefined });
    void this.changeLanguage(this.data.lang);
  }

  async changeLanguage(lang: Lang) {
    const { data } = this;
    if (typeof window === 'undefined' || lang === this.prevLang) return;

    this.prevLang = data.lang;
    const newLang = lang;

    let newL: typeof ja;
    switch (lang) {
      case 'ja':
        newL = await import('./ja').then((c) => c.ja);
        break;
      default:
        newL = await import('./ja').then((c) => c.ja);
        break;
    }

    this.changeValue((value) => {
      value.lang = newLang;
      value.l = newL;
    });
  }
}
