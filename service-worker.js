// Nombre del caché 
const CACHE_NAME = 'mi-app-cache-v1';

// Archivos que se deben cachear para que la aplicación funcione offline
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icono.png',  // Asegúrate de que el icono se llame así y esté en la misma carpeta
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.13/jspdf.plugin.autotable.min.js',
];

// Instalación del Service Worker
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Archivos cacheados correctamente');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activar el Service Worker y borrar caché antigua
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Borrando caché antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptar las solicitudes para servir los archivos desde la caché si están disponibles
self.addEventListener('fetch', function(event) {
  if (event.request.mode === 'navigate') {
    // Siempre servimos el index.html para las navegaciones
    event.respondWith(
      caches.match('/index.html').then(function(response) {
        return response || fetch('/index.html');
      })
    );
  } else {
    // Para todos los otros archivos, servimos desde la caché o hacemos una solicitud de red
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          return response || fetch(event.request);
        })
    );
  }
});
