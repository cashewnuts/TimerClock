export default class WorkerService {
  static is_iOS() {
    return ['iPhone', 'iPad', 'iPod'].includes(navigator.platform);
  }
  static checkSharedService() {
    return !!SharedWorker;
  }
  constructor() {
    if (WorkerService.checkSharedService()) {
      const sWorker = new SharedWorker('shared-worker.js');
      console.log('SharedWorker.port.start()');
      this.worker = sWorker;
    } else {
      this.worker = new Worker('worker.js');
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
