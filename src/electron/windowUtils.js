/* eslint import/prefer-default-export: 0 */

import { screen } from 'electron';

export function isPositionValid(position) {
  const displays = screen.getAllDisplays();
  const { x, y } = position;
  return displays.some(({
    workArea,
  }) => x >= workArea.x && x <= workArea.x + workArea.width && y >= workArea.y && y <= workArea.y + workArea.height);
}
