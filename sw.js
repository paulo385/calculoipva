// Service Worker do VeículoFácil
// Objetivo: permitir "Adicionar à tela inicial" (PWA instalável) e dar
// uma camada básica de cache para os arquivos principais do site.

const CACHE_NAME = 'veiculofacil-v2';
const CORE_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './main.js',
  './logo.png',
  './logo-icon.png',
  './icon-192.png',
  './icon-512.png',
  './manifest.json',
];

// Instala o service worker e guarda os arquivos principais em cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

// Remove caches antigos quando uma nova versão do SW assume
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Estratégia: tenta a rede primeiro, IGNORANDO o cache HTTP do navegador
// (senão o "network first" pode acabar recebendo uma resposta antiga
// guardada pelo próprio navegador, mesmo estando "na rede")
self.addEventListener('fetch', (event) => {
  // Não interfere em chamadas para outros domínios (CDNs, fontes, etc.)
  if (new URL(event.request.url).origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    fetch(event.request, { cache: 'no-store' })
      .then((response) => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});