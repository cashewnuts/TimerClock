importScripts("/resources/js/idb-keyval.js");

let playPlan = [];
let playCount = 0;
let plan = null;
let ports = [];
let notifMsgs = [];

const planStore = new idbKeyval.Store("plan-store", "plan");
const IDB = {
  get(key) {
    return idbKeyval.get(key, planStore);
  },
  set(key, val) {
    return idbKeyval.set(key, val, planStore);
  }
};

console.log("shared-worker init");

const postMessage = msg => {
  ports.forEach(port => port.postMessage(msg));
};

self.onconnect = function(e) {
  console.log("shared-worker onconnect");
  const port = e.ports[0];

  const p1 = IDB.get("playCount").then(c => (playCount = c));
  const p2 = IDB.get("playPlan").then(plan => (playPlan = plan));
  const p3 = IDB.get("plan").then(curPlan => {
    plan = curPlan;
  });
  const p4 = IDB.get("notifMsgs").then(msgs => (notifMsgs = msgs || []));

  Promise.all([p1, p2, p3, p4]).then(() => {
    port.addEventListener("message", function(event) {
      console.log("worker msg", event);
      messageHandler(event);
    });

    port.start(); // Required when using addEventListener. Otherwise called implicitly by onmessage setter.
    if (ports.indexOf(port) === -1) {
      ports.push(port);
    }
  });
};

function messageHandler(e) {
  if (e.data.error) {
    console.log(e.data.error);
    return;
  }
  const data = e.data;
  const action = e.data.action;
  if (action === "timer_get_plan") {
    const playing = data.payload.playing;
    if (playing && !plan) {
      startTimer(false);
    } else {
      if (plan) timerTicker();
      postMessage({
        action: "ret_" + action,
        payload: plan
      });
    }
  } else if (action === "timer_setup") {
    const payload = data.payload;
    setupTimer(payload);
    postMessage({
      action: "ret_" + action
    });
  } else if (action === "timer_start") {
    console.log("timer_start");
    startTimer(true);
  } else if (action === "timer_stop") {
    console.log("timer_stop");
    stopTimer();
  } else if (action === "notification") {
    console.log("notification");
    notify(data.payload);
  }
}

function notify(msg) {
  let id;
  if (msg) {
    notifMsgs.push(msg);
    id = msg.title;
  }
  const loopMsg = _id => {
    let targetMsgs = notifMsgs;
    if (_id) {
      targetMsgs = notifMsgs.filter(msg => msg.title === _id);
      if (targetMsgs.length >= 2) {
        const loopMax = targetMsgs.length - 1;
        for (const _idx in targetMsgs) {
          if (_idx >= loopMax) break;
          const msg = targetMsgs[_idx];
          utils.removeElement(notifMsgs, msg);
        }
      } else if (targetMsgs.length === 1) {
        const msg = targetMsgs[0];
        utils.removeElement(notifMsgs, msg);
        new Notification(msg.title, msg.options);
      }
    } else {
      const msg = notifMsgs.pop();
      new Notification(msg.title, msg.options);
    }
    if (notifMsgs && notifMsgs.length !== 0) {
      setTimeout(loopMsg.bind(this, _id), 1000);
    }
    IDB.set("notifMsgs", notifMsgs);
  };
  setTimeout(loopMsg.bind(this, id), 3000);
}

function setupTimer(payload) {
  console.log("Timer setupl", payload);
  playPlan = payload.plan;
}

function startTimer(increment) {
  if (increment) {
    incrementPlan();
  }
  IDB.set("playCount", playCount);
  IDB.set("plan", plan);
  postMessage({
    action: "timer_start",
    payload: plan
  });
  timerTicker();
}

function stopTimer() {
  playCount = 0;
  plan = null;
  IDB.set("playCount", playCount);
  IDB.set("plan", plan);
  postMessage({
    action: "timer_stop",
    payload: null
  });
}

function incrementPlan() {
  console.log("incrementPlan", plan);
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
  console.log("timerTicker");
  try {
    if (!plan) return;
    setTimeout(timerTicker, 1000);
    if (utils.checkPlanExeceeded()) {
      incrementPlan();
      while (utils.checkPlanExeceeded()) {
        incrementPlan();
      }
      IDB.set("playCount", playCount);
      IDB.set("plan", plan);
      postMessage({
        action: "timer_update",
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
    return Date.now() > plan.current;
  },
  removeElement(arr, elm) {
    const idx = arr.indexOf(elm);
    if (idx > -1) {
      arr.splice(idx, 1);
    }
  }
};
