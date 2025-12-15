const CACHE_NAME = 'chamapro-v1';
const urlsToCache = [
  '/', // Importante para o arquivo raiz/splash
  '/index.html',
  '/home.html', // Assumindo que home.html é o destino
  'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700;800&display=swap',
  // Adicione aqui outros arquivos CSS, JS e imagens usados na tela de splash
  '/icons/icon-512x512.png' // Exemplo de um ícone que deve estar em cache
];

// 1. EVENTO DE INSTALAÇÃO: Armazena em cache os recursos estáticos.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Cache Aberto e Recursos Pré-armazenados');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.error('Service Worker: Falha ao pré-armazenar recursos', err);
      })
  );
});

// 2. EVENTO DE ATIVAÇÃO: Limpa caches antigos.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Limpando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 3. EVENTO DE BUSCA (FETCH): Retorna recursos do cache primeiro, ou da rede.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retorna o recurso do cache se ele existir
        if (response) {
          return response;
        }
        // Se não estiver no cache, faz a requisição à rede
        return fetch(event.request);
      })
  );
});