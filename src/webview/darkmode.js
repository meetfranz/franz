import path from 'path';
import fs from 'fs-extra';

const ID = 'franz-theme-dark-mode';

export function injectDarkModeStyle(recipePath) {
  const darkModeStyle = path.join(recipePath, 'darkmode.css');
  if (fs.pathExistsSync(darkModeStyle)) {
    const data = fs.readFileSync(darkModeStyle);
    const styles = document.createElement('style');
    styles.id = ID;
    styles.innerHTML = data.toString();

    document.querySelector('head').appendChild(styles);
  }
}

export function removeDarkModeStyle() {
  const style = document.querySelector(`#${ID}`);

  if (style) {
    style.remove();
  }
}

export function isDarkModeStyleInjected() {
  return !!document.querySelector(`#${ID}`);
}
