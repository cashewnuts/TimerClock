import moment from 'moment';
const PLAY_PLAN = [25, 5, 25, 5, 25, 5, 25, 20];

export default class TimerTickerService {
  constructor(worker, options) {
    this.worker = worker;
    const { setPlan } = options || {};
    this.setPlan = setPlan;
    this.plan = null;
  }

  waitReady() {
    return this.worker.ready();
  }

  setupEventListeners() {
    this.worker.addListener(event => {
      console.log('from sw', event.data);
      const data = event.data;
      if (data.error) {
        console.log('ERROR:', data.error);
      }
      if (data.action === 'ret_timer_get_plan') {
        const plan = data.payload;
        this.setSwPlan(plan);
      } else if (data.action === 'timer_start') {
        const plan = data.payload;
        this.setSwPlan(plan);
      } else if (data.action === 'timer_stop') {
        const plan = data.payload;
        this.setSwPlan(plan);
      } else if (data.action === 'timer_update') {
        const plan = data.payload;
        this.setSwPlan(plan);
        this.worker.postMessage({
          action: 'notification',
          payload: {
            title: 'Timer Update!',
            options: {}
          }
        });
      }
    });
  }

  initialPostMessage() {
    this.worker.postMessage({
      action: 'timer_setup',
      payload: {
        plan: PLAY_PLAN
      }
    });
    this.worker.postMessage({
      action: 'timer_get_plan',
      payload: {
        playing: !!this.plan
      }
    });
  }

  startTimer() {
    console.log('startTimer');
    this.worker.postMessage({
      action: 'timer_start'
    });
  }
  stopTimer() {
    console.log('startTimer');
    this.worker.postMessage({
      action: 'timer_stop'
    });
  }
  setSwPlan(plan) {
    const isPlay = !!plan;
    if (isPlay) {
      this.plan = {
        start: moment(plan.start),
        current: moment(plan.current),
        next: moment(plan.next),
        count: plan.count,
        focus: plan.focus
      };
      this.setPlan(this.plan);
    } else {
      this.plan = null;
      this.setPlan(this.plan);
    }
  }
}
