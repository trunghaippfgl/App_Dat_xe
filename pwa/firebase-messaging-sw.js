importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBb8uSsLuChx4OYONl2fFFFwDSbSncZBpI",
  authDomain: "hainguyen-ffb25.firebaseapp.com",
  projectId: "hainguyen-ffb25",
  storageBucket: "hainguyen-ffb25.firebasestorage.app",
  messagingSenderId: "837257334024",
  appId: "1:837257334024:web:583b46747d823b4c83f0bd"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = (payload.notification && payload.notification.title) || 'Thông báo mới';
  const body = (payload.notification && payload.notification.body) || '';
  self.registration.showNotification(title, {
    body: body,
    icon: 'admin-icon-192.png'
  });
});
