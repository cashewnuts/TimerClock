import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import TimerClock from "./TimerClock";
import ErrorBoundary from "./utils/error-boundary";
import NotificationUtils from "./utils/notification-utils";
import SwService from "./services/sw-service";
import WorkerService from "./services/worker-service";
import TimerTickerService from "./services/timer-ticker-service";

import "./styles.css";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then(function() {
      console.log("Service worker registered!");

      SwService.postMessage("hello from index.js").then(console.log);
    })
    .catch(function(err) {
      console.log(err);
    });
}

if (NotificationUtils.checkSupport()) {
  if (!NotificationUtils.checkPermission()) {
    NotificationUtils.requestPermission().then(function(permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        NotificationUtils.showNotification("Notification Activated!");
      }
    });
  }
}

const worker = new WorkerService();

function App() {
  const [plan, setPlan] = useState(null);
  let timerTicker = useRef(null);
  useEffect(() => {
    timerTicker.current = new TimerTickerService(worker, {
      setPlan
    });
    timerTicker.current.initialPostMessage();
  }, []);
  return (
    <div className="App">
      <div className="app-container flex-center">
        <div
          style={{
            width: "70vw",
            maxWidth: "50em",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <ErrorBoundary>
            {!plan && (
              <button
                className="play-button"
                onClick={() => timerTicker.current.startTimer()}
              />
            )}
            {plan && (
              <button
                className="stop-button"
                onClick={() => timerTicker.current.stopTimer()}
              />
            )}
            <TimerClock plan={plan} />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
