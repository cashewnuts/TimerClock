let playPlan = [];
let playing = false;
let playCount = 0;
let plan = null;

onmessage = e => {
  if (e.data.error) {
    console.log(e.data.error);
    return;
  }
  const data = e.data;
  const action = e.data.action;
  if (action === 'timer_get_plan') {
    postMessage({
      action: 'ret_' + action,
      payload: plan
    });
  } else if (action === 'timer_setup') {
    const payload = data.payload;
    setupTimer(payload);
    postMessage({
      action: 'ret_' + action
    });
  } else if (action === 'timer_start') {
    console.log('timer_start');
    startTimer();
  } else if (action === 'timer_stop') {
    console.log('timer_stop');
    stopTimer();
  }
};

function setupTimer(payload) {
  console.log('Timer setupl', payload);
  playPlan = payload.plan;
}

function startTimer() {
  playing = true;
  incrementPlan();
  postMessage({
    action: 'timer_start',
    payload: plan
  });
  timerTicker();
}

function stopTimer() {
  playing = false;
  playCount = 0;
  plan = null;
  postMessage({
    action: 'timer_stop',
    payload: null
  });
}

function incrementPlan() {
  const getReminder = utils.getReminderFactory(playPlan.length);
  const now = Date.now();
  const first = playPlan[getReminder(playCount)];
  const second = playPlan[getReminder(playCount + 1)];
  const current = now + first * 1000 * 60;
  const next = current + second * 1000 * 60;
  plan = {
    start: now,
    current,
    next,
    count: playCount,
    focus: playCount % 2 === 0
  };
  playCount += 1;
}

function timerTicker() {
  console.log('timerTicker');
  try {
    if (playing) {
      setTimeout(timerTicker, 1000);
    }
    if (utils.checkPlanExeceeded()) {
      incrementPlan();
      while (!utils.checkPlanExeceeded()) {
        incrementPlan();
      }
      postMessage({
        action: 'timer_update',
        payload: plan
      });
      // TODO notification not supported within web worker
      // utils.showNotification(title, {
      //   vibrate: [1000, 1000, 1000, 1000, 1000]
      // });
    }
  } catch (e) {
    console.log(e);
    setTimeout(timerTicker, 1000);
  }
}

const utils = {
  getReminderFactory(len) {
    return num => num % len;
  },
  checkPlanExeceeded() {
    if (!plan) return false;
    return Date.now() > plan.current;
  }
};
