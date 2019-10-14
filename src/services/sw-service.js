export default class ServiceWorkerService {
  static is_iOS() {
    return ['iPhone', 'iPad', 'iPod'].includes(navigator.platform);
  }
  static postMessage(msg) {
    return new Promise(function(resolve, reject) {
      // Create a Message Channel
      var msg_chan = new MessageChannel();

      // Handler for recieving message reply from service worker
      msg_chan.port1.onmessage = function(event) {
        if (!event.data) return resolve();
        if (event.data.error) {
          reject(event.data.error);
        } else {
          resolve(event.data);
        }
      };

      // Send message to service worker along with port for reply
      navigator.serviceWorker.controller.postMessage(msg, [msg_chan.port2]);
    });
  }

  static addListener(fn) {
    const listener = e => {
      const result = fn(e);
      if (result) {
        e.ports[0].postMessage(result);
      }
    };
    navigator.serviceWorker.addEventListener('message', listener);
  }
}
