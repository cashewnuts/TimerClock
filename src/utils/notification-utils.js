export default class NotificationUtils {
  static checkSupport() {
    return 'Notification' in window && true;
  }
  static checkServiceWorkerSupport() {
    return 'serviceWorker' in navigator;
  }
  static checkPermission() {
    return Notification.permission === 'granted';
  }
  static requestPermission() {
    return Notification.requestPermission();
  }
  static showNotification(title, option) {
    if (!NotificationUtils.checkSupport()) return;

    if (NotificationUtils.checkServiceWorkerSupport()) {
      return navigator.serviceWorker.ready.then(function(registration) {
        registration.showNotification(title, option);
      });
    }
    return Promise.resolve(new Notification(title, option));
  }
}
