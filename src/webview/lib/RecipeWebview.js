const { ipcRenderer } = require('electron');
const fs = require('fs-extra');

const debug = require('debug')('Franz:Plugin:RecipeWebview');

class RecipeWebview {
  constructor() {
    this.countCache = {
      direct: 0,
      indirect: 0,
    };

    ipcRenderer.on('poll', () => {
      this.loopFunc();

      debug('Poll event');
    });
  }

  loopFunc = () => null;

  /**
   * Initialize the loop
   *
   * @param {Function}        Function that will be executed
   */
  loop(fn) {
    this.loopFunc = fn;
  }

  /**
   * Set the unread message badge
   *
   * @param {int} direct      Set the count of direct messages
   *                          eg. Slack direct mentions, or a
   *                          message to @channel
   * @param {int} indirect    Set a badge that defines there are
   *                          new messages but they do not involve
   *                          me directly to me eg. in a channel
   */
  setBadge(direct = 0, indirect = 0) {
    if (this.countCache.direct === direct
      && this.countCache.indirect === indirect) return;

    const count = {
      direct: direct > 0 ? direct : 0,
      indirect: indirect > 0 ? indirect : 0,
    };


    ipcRenderer.sendToHost('messages', count);
    Object.assign(this.countCache, count);

    debug('Sending badge count to host', count);
  }

  /**
   * Injects the contents of a CSS file into the current webview
   *
   * @param {Array} files     CSS files that should be injected. This must
   *                          be an absolute path to the file
   */
  injectCSS(...files) {
    files.forEach((file) => {
      const data = fs.readFileSync(file);
      const styles = document.createElement('style');
      styles.innerHTML = data.toString();

      document.querySelector('head').appendChild(styles);

      debug('Append styles', styles);
    });
  }

  onNotify(fn) {
    if (typeof fn === 'function') {
      window.Notification.prototype.onNotify = fn;
    }
  }

  initialize(fn) {
    if (typeof fn === 'function') {
      fn();
    }
  }
}

module.exports = RecipeWebview;
