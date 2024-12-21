export async function waitFor(
  assertion: () => void | Promise<void>,
  maxDuration: number = 1000,
) {
  return new Promise((resolve, reject) => {
    let elapsedTime = 0;

    const interval = setInterval(async () => {
      elapsedTime += 10;

      try {
        await assertion();
        clearInterval(interval);
        resolve(null);
      } catch (e) {
        if (elapsedTime >= maxDuration) {
          reject(e);
        }
      }
    }, 10);
  });
}
