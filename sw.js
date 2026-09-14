/* Service worker kawaii 🩵 — caché con estrategia stale-while-revalidate */
const CACHE = 'enfermeria-kawaii-v1';
const CORE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/mascota.webp',
  './assets/kit.webp',
  './assets/fonendoscopio.webp',
  './assets/utensilios.webp',
  './assets/pacientes.webp',
  './assets/mascota.png',
  './assets/kit.png',
  './assets/fonendoscopio.png',
  './assets/utensilios.png',
  './assets/pacientes.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(CORE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || !e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(
    caches.match(e.request).then(hit => {
      const net = fetch(e.request).then(res => {
        if (res && res.ok) {
          const cl = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, cl));
        }
        return res;
      }).catch(() => hit);
      return hit || net;
    })
  );
});
