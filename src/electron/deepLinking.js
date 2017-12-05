export default function handleDeepLink(window, url) {
  console.log(url);

  window.webContents.send('navigateFromDeepLink', { url });
}
