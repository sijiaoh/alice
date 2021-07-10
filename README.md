# alice

## Startup

```bash
yarn
cp envrc.sample .envrc
yarn bootstrap
```

## gitattributes

[gitattributes.io](https://gitattributes.io/api/visualstudio%2Cunity%2Cweb%2Ccsharp%2Cc%2B%2B%2Clua)を使用しているが、重複している項目が多い。

`node scripts/remove-duplicate-lines-from-gitattributes.js`

で重複を取り除いた後、binary 項目を lfs に置換して使用する。

## setTimeout ＋ Promise のテスト

reactive-class のテストは runAllTimers だけだとうまく動かない。

```ts
// reactive-classでゴニョゴニョ。

// 反映。
jest.runAllTimers();
await Promise.resolve();

// チェック。
```

https://qiita.com/sijiaoh/items/03628eeed29902c21e4c
