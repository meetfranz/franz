/* eslint no-bitwise: ["error", { "int32Hint": true }] */

import path from 'path';
import fs from 'fs-extra';

const debug = require('debug')('Franz:DarkMode');

const chars = [...'abcdefghijklmnopqrstuvwxyz'];

const ID = [...Array(20)].map(() => chars[Math.random() * chars.length | 0]).join``;

export function injectDarkModeStyle(recipePath) {
  const darkModeStyle = path.join(recipePath, 'darkmode.css');
  if (fs.pathExistsSync(darkModeStyle)) {
    const data = fs.readFileSync(darkModeStyle);
    const styles = document.createElement('style');
    styles.id = ID;
    styles.innerHTML = data.toString();

    document.querySelector('head').appendChild(styles);

    debug('Injected Dark Mode style with ID', ID);
  }
}

export function removeDarkModeStyle() {
  const style = document.querySelector(`#${ID}`);

  if (style) {
    style.remove();

    debug('Removed Dark Mode Style with ID', ID);
  }
}

export function isDarkModeStyleInjected() {
  return !!document.querySelector(`#${ID}`);
}
