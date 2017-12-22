export default function handleDeepLink(window, rawUrl) {
  const url = rawUrl.replace('franz://', '');

  console.log('handleDeepLink', url);

  if (!url) return;

  window.webContents.send('navigateFromDeepLink', { url });
}
