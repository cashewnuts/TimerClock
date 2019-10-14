import React, { useState, useEffect } from 'react';
import ClockFrame from './ClockFrame';
import ClockHands from './ClockHands';

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

  return (
    <>
      <svg
        viewBox={`${viewport.top} ${viewport.left} ${viewport.width} ${
          viewport.height
        }`}
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <ClockComponent time={now} viewport={viewport} plan={props.plan} />
      </svg>
    </>
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
