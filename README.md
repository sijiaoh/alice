# alice

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
