// Breakfree 오프라인용 서비스 워커. 앱 파일을 한 번 받아 두고, 인터넷이 없어도 열리게 한다.
// 앱 파일을 고치면 VERSION을 올린다 (그래야 새 파일을 다시 받는다).
const VERSION = 'bf-v4';
const FILES = [
  './', './index.html', './manifest.webmanifest',
  './fonts/PressStart2P-latin.woff2', './fonts/Galmuri11.woff2',
  './icons/icon-192.png', './icons/icon-512.png',
  './privacy/ko.html', './privacy/en.html', './privacy/ja.html'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// 같은 주소의 파일만: 받아 둔 것이 있으면 그걸 주고, 없으면 인터넷에서 받는다
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(r => r || fetch(e.request)));
});
