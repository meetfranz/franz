export default function handleDeepLink(window, rawUrl) {
  const url = rawUrl.replace('franz://', '');

  if (!url) return;

  window.webContents.send('navigateFromDeepLink', { url });
}
