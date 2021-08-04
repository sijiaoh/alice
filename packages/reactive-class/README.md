# reactive-class

```tsx
class Cls extends ReactiveClass<{ name: string }> {}

const cls = new Cls();

const unsubscribe = subscribe(() => {
  console.log(cls.data.name);
});
unsubscribe();

subscribe(
  () => cls.data.name,
  (name) => {
    console.log(name);
  }
);

cls.subscribe((data) => {
  console.log(data.name);
});

cls.subscribe(
  () => cls.data.name,
  (name) => {
    console.log(name);
  }
);

const Cmp = () => {
  const clsData = useSelector(() => cls.data);
  return <>{clsData.name}</>;
};

const Cmp = () => {
  const name = useSelector(() => cls.data.name);
  return <>{name}</>;
};
```
