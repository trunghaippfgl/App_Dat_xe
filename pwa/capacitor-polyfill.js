// capacitor-polyfill.js
(function () {
  if (!window.Capacitor || !window.Capacitor.isNativePlatform || !window.Capacitor.isNativePlatform()) {
    return; // đang chạy trên web/Chrome thường -> giữ nguyên API gốc, không đụng gì
  }

  var Plugins = window.Capacitor.Plugins || {};
  var Geo = Plugins.Geolocation;
  var LocalNoti = Plugins.LocalNotifications;

  // --- Polyfill navigator.geolocation ---
  if (Geo) {
    navigator.geolocation.getCurrentPosition = function (success, error, options) {
      Geo.getCurrentPosition(options).then(success).catch(function (e) { error && error(e); });
    };
    navigator.geolocation.watchPosition = function (success, error, options) {
      var watchId = null;
      Geo.watchPosition(options || {}, function (pos, err) {
        if (err) { error && error(err); return; }
        success(pos);
      }).then(function (id) { watchId = id; });
      return watchId;
    };
    navigator.geolocation.clearWatch = function (watchId) {
      if (watchId) Geo.clearWatch({ id: watchId });
    };
  }

  // --- Polyfill window.Notification ---
  if (LocalNoti) {
    var fakeNotification = function (title, options) {
      LocalNoti.schedule({
        notifications: [{ title: title, body: (options && options.body) || '', id: Date.now() % 2147483647 }]
      });
    };
    fakeNotification.permission = 'default';
    fakeNotification.requestPermission = function () {
      return LocalNoti.requestPermissions().then(function (result) {
        fakeNotification.permission = (result.display === 'granted') ? 'granted' : 'denied';
        return fakeNotification.permission;
      });
    };
    window.Notification = fakeNotification;
  }
})();
// ĐOẠN DEBUG TẠM THỜI - xoá sau khi kiểm tra xong
setTimeout(function () {
  var msg = 'Capacitor: ' + (!!window.Capacitor) + '\n' +
    'Native: ' + (window.Capacitor ? window.Capacitor.isNativePlatform() : 'N/A') + '\n' +
    'Platform: ' + (window.Capacitor ? window.Capacitor.getPlatform() : 'N/A') + '\n' +
    'Geolocation plugin: ' + (window.Capacitor && window.Capacitor.Plugins ? !!window.Capacitor.Plugins.Geolocation : 'N/A') + '\n' +
    'LocalNotifications plugin: ' + (window.Capacitor && window.Capacitor.Plugins ? !!window.Capacitor.Plugins.LocalNotifications : 'N/A');
  alert(msg);
}, 2000);
