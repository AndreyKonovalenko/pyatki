export async function mapWithLimit<T, R>(
  items: T[],
  limit: number,
  worker: (item: T, index: number) => Promise<R>,
): Promise<PromiseSettledResult<R>[]> {
  const results: PromiseSettledResult<R>[] = new Array(items.length);
  let cursor = 0;
  let active = 0;
  let finished = 0;

  return new Promise(resolve => {
    if (items.length === 0) return resolve(results);
    const launch = () => {
      while (active < limit && cursor < items.length) {
        const i = cursor++;
        active++;

        (async () => {
          try {
            const value = await worker(items[i], i);
            results[i] = { status: 'fulfilled', value };
          } catch (reason) {
            results[i] = { status: 'rejected', reason };
          } finally {
            active--;
            finished++;
            if (finished === items.length) resolve(results);
            else launch();
          }
        })();
      }
    };
    launch();
  });
}
