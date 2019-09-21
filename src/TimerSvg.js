import React, { useState, useEffect } from "react";
import TimerClock from "./TimerClock";

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

export default function TimerSvg(props) {
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
    <svg
      viewBox={`${viewport.top} ${viewport.left} ${viewport.width} ${
        viewport.height
      }`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="100%" height="100%" fill="#999999" />
      <TimerClock time={now} viewport={viewport} />
    </svg>
  );
}
