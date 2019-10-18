export default class WorkerService {
  static is_iOS() {
    return ['iPhone', 'iPad', 'iPod'].includes(navigator.platform);
  }
  static checkSharedService() {
    return false;
  }
  constructor() {
    this.isReady = false;
    if (WorkerService.checkSharedService()) {
      const sWorker = new SharedWorker('/shared-worker.js');
      console.log('SharedWorker.port.start()');
      this.worker = sWorker;
      this.isReady = true;
    } else {
      this.worker = new Worker('/worker.js');
    }
  }
  ready() {
    if (WorkerService.checkSharedService()) {
      return Promise.resolve(true);
    } else {
      const timeoutchecker = Date.now();
      this.addListener(e => {
        if (e.data.action === 'ready') {
          this.isReady = true;
        }
      });
      return new Promise((resolve, reject) => {
        const checkReady = () => {
          if (this.isReady) {
            return resolve(true);
          } else if (Date.now() - timeoutchecker > 30000) {
            reject('WebWorker setup timeout');
          }
          setTimeout(checkReady, 500);
        };
        checkReady();
      });
    }
  }
  postMessage(msg) {
    console.log('post', msg);
    if (WorkerService.checkSharedService()) {
      this.worker.port.postMessage(msg);
    } else {
      this.worker.postMessage(msg);
    }
  }
  addListener(fn) {
    console.log('addListener', fn);
    const listener = e => {
      console.log('listen', e.data);
      const result = fn(e);
      if (result) {
        e.ports[0].postMessage(result);
      }
    };
    try {
      if (WorkerService.checkSharedService()) {
        this.worker.port.onmessage = listener;
        this.worker.port.start();
      } else {
        this.worker.onmessage = listener;
      }
    } catch (e) {
      console.log(e);
    }
  }
}
