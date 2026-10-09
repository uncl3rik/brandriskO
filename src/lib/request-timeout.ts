// AbortController works in older mobile browsers that lack AbortSignal.any/timeout.
export function requestTimeout(milliseconds: number) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), milliseconds);
  return {
    signal: controller.signal,
    dispose() { clearTimeout(timer); controller.abort(); },
  };
}
