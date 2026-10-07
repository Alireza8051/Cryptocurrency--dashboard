// Service Worker - داشبورد تحلیل تتر

self.addEventListener('install', (event) => {
    console.log('✅ Service Worker نصب شد');
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('✅ Service Worker فعال شد');
    event.waitUntil(clients.claim());
});

// گوش دادن به پیام‌های ارسالی از صفحه اصلی
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
        const { title, body, tag, icon } = event.data.payload;
        
        self.registration.showNotification(title, {
            body: body,
            icon: icon || 'icon-192.png',
            badge: 'icon-192.png',
            tag: tag || 'tether-signal',
            requireInteraction: true, // اعلان تا وقتی کاربر کلیک نکند، باقی می‌ماند
            vibrate: [200, 100, 200], // ویبره برای اندروید
            dir: 'rtl',
            lang: 'fa'
        });
    }
});

// کلیک روی اعلان
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            // اگر صفحه باز است، فوکوس کن
            for (let client of clientList) {
                if ('focus' in client) return client.focus();
            }
            // اگر بسته است، باز کن
            if (clients.openWindow) return clients.openWindow('./index.html');
        })
    );
});
