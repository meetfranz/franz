export function onVisibilityChange(cb) {
  let isVisible = true;

  if (!cb) {
    throw new Error('no callback given');
  }

  function focused() {
    if (!isVisible) {
      cb(isVisible = true);
    }
  }

  function unfocused() {
    if (isVisible) {
      cb(isVisible = false);
    }
  }

  document.addEventListener('visibilitychange', () => { (document.hidden ? unfocused : focused)(); });

  window.onpageshow = focused;
  window.onfocus = focused;

  window.onpagehid = unfocused;
  window.onblur = unfocused;
}
