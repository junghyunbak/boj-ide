/* eslint-disable no-bitwise */

export function adjustTransparency(hexColor: string, bgColor: string, alpha: number) {
  function hexToRgb(hex: string) {
    const bigint = parseInt(hex.slice(1), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
  }

  const [r, g, b] = hexToRgb(hexColor);
  const [br, bg, bb] = hexToRgb(bgColor);

  const newR = Math.round((r - (1 - alpha) * br) / alpha);
  const newG = Math.round((g - (1 - alpha) * bg) / alpha);
  const newB = Math.round((b - (1 - alpha) * bb) / alpha);

  return `rgba(${newR}, ${newG}, ${newB}, ${alpha})`;
}
