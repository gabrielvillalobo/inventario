/* Recuento Mina Clavero · service worker */
var CACHE='recuento-v2';
var ARCHIVOS=['./','./index.html','./manifest.webmanifest','./productos.json',
  './icon-180.png','./icon-192.png','./icon-512.png','./icon-512-maskable.png',
  'https://cdn.jsdelivr.net/npm/@zxing/library@0.21.3/umd/index.min.js'];

self.addEventListener('install',function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){
    return Promise.all(ARCHIVOS.map(function(u){
      return c.add(new Request(u,{mode:u.indexOf('http')===0?'no-cors':'same-origin'})).catch(function(){});
    }));
  }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.map(function(k){ return k===CACHE?null:caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener('fetch',function(e){
  var req=e.request;
  if(req.method!=='GET') return;
  e.respondWith(
    caches.match(req,{ignoreVary:true}).then(function(guardado){
      var red=fetch(req).then(function(res){
        if(res && (res.status===200||res.type==='opaque')){
          var copia=res.clone();
          caches.open(CACHE).then(function(c){ c.put(req,copia); });
        }
        return res;
      }).catch(function(){ return guardado; });
      return guardado || red;
    })
  );
});
