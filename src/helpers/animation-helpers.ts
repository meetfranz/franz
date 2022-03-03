export function easeInOutSine(time: number, startValue: number, change: number, duration: number) {
  return -change / 2 * (Math.cos(Math.PI * time / duration) - 1) + startValue;
}
