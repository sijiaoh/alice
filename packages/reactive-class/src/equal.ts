// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const equal = (a: any, b: any) => {
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.every((_, index) => a[index] === b[index]);
  }
  if (typeof a === 'object' && typeof b === 'object') {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    return (
      aKeys.length === bKeys.length && aKeys.every((key) => a[key] === b[key])
    );
  }
  return a === b;
};
