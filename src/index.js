import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import TimerClock from './TimerClock';
import ErrorBoundary from './utils/error-boundary';
import NotificationUtils from './utils/notification-utils';

import './styles.css';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js')
    .then(function() {
      console.log('Service worker registered!');
    })
    .catch(function(err) {
      console.log(err);
    });
}

if (NotificationUtils.checkSupport()) {
  if (!NotificationUtils.checkPermission()) {
    NotificationUtils.requestPermission().then(function(permission) {
      // If the user accepts, let's create a notification
      if (permission === 'granted') {
        NotificationUtils.showNotification('Notification Activated!');
      }
    });
  }
}

function App() {
  const [playing, setPlay] = useState(false);
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <div className="flex-center">
        <div
          style={{
            width: '70vw',
            maxWidth: '50em',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <ErrorBoundary>
            {!playing && (
              <button className="play-button" onClick={() => setPlay(true)} />
            )}
            {playing && (
              <button className="stop-button" onClick={() => setPlay(false)} />
            )}
            <TimerClock playing={playing} />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
