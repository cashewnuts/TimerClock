import React, { useState, useEffect } from 'react';
import moment from 'moment';
import ClockFrame from './ClockFrame';
import ClockHands from './ClockHands';
import NotificationUtils from './utils/notification-utils';

export const viewport = {
  top: 0,
  left: 0,
  right: 110,
  bottom: 110,
  center: {
    x: 55,
    y: 55
  },
  width: 110,
  height: 110
};

const PLAY_PLAN = [25, 5, 25, 5, 25, 5, 25, 20];

export default function TimerClock(props) {
  const [now, setNow] = useState(new Date());

  let tmpSec = new Date().getSeconds();
  const loopEffect = () => {
    const id = setTimeout(() => {
      const iNow = new Date();
      if (iNow.getSeconds() !== tmpSec) {
        tmpSec = iNow.getSeconds();
        setNow(iNow);
      } else {
        setTimeout(loopEffect, 50);
      }
    }, 50);
    return () => {
      clearTimeout(id);
    };
  };
  useEffect(loopEffect, [now]);

  const [playCount, setPlayCount] = useState(0);
  const [plan, setPlan] = useState(null);
  const getReminder = (len => num => num % len)(PLAY_PLAN.length);
  /**
   * Manage initialization of timer
   */
  useEffect(() => {
    if (props.playing) {
      const first = PLAY_PLAN[getReminder(playCount)];
      const second = PLAY_PLAN[getReminder(playCount + 1)];
      const current = moment().add(first, 'minutes');
      const next = moment(current).add(second, 'minutes');
      setPlan({
        current,
        next,
        focus: playCount % 2 === 0
      });
      setPlayCount(playCount + 1);
    } else {
      setPlan(null);
      setPlayCount(0);
    }
  }, [props.playing]);

  /**
   * Manage timer transition
   */
  useEffect(() => {
    if (now && plan && now.getTime() > plan.current.valueOf()) {
      const second = PLAY_PLAN[getReminder(playCount + 1)];
      setPlan({
        current: plan.next,
        next: moment(plan.next).add(second, 'minutes'),
        focus: playCount % 2 === 0
      });
      const nextPlayCount = playCount === PLAY_PLAN.length ? 0 : playCount + 1;
      setPlayCount(nextPlayCount);
    }
  }, [now, plan]);

  /**
   * Manage Notification
   */
  useEffect(() => {
    if (NotificationUtils.checkSupport()) {
      if (!plan) return;
      console.log('Notification');
      if (plan.focus) {
        NotificationUtils.showNotification('Get Focus!');
      } else {
        NotificationUtils.showNotification('Relax');
      }
    }
  }, [plan]);

  return (
    <svg
      viewBox={`${viewport.top} ${viewport.left} ${viewport.width} ${
        viewport.height
      }`}
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <rect width="100%" height="100%" fill="#999999" />
      <ClockComponent time={now} viewport={viewport} plan={plan} />
    </svg>
  );
}

function ClockComponent(props) {
  const defaultProps = {
    fill: '#ffdd00',
    stroke: '#ff0000',
    frameColor: '#ffffff'
  };
  props = {
    ...defaultProps,
    ...props
  };
  const [radius, setRadius] = useState(props.viewport.center.x - 5);

  return (
    <g>
      <circle
        cx={props.viewport.center.x}
        cy={props.viewport.center.y}
        r={radius}
        fill={props.fill}
      />
      <ClockFrame {...props} radius={radius} />
      <ClockHands {...props} color={props.stroke} radius={radius} />
      {props.children}
    </g>
  );
}
