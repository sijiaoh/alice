export const sleep = async (timeout: number) => {
  if (timeout <= 0) return;
  await new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, timeout);
  });
};
