export default function handleDeepLink(window, rawUrl) {
  const url = rawUrl.replace('franz://', '');

  window.webContents.send('navigateFromDeepLink', { url });
}
