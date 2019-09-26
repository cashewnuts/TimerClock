import React, { useEffect, useState } from 'react';
import clockUtils from '../../utils/clock-utils';

const COLOR = {
  FocusColor: '#00ff00',
  RelaxColor: '#888888'
};
const FOCUS_COLOR = '#00ff00';
export default function TimerGuage(props) {
  const viewport = props.viewport;
  const center = viewport.center;
  const [curStart, setCurStart] = useState(null);
  const [curEnd, setCurEnd] = useState(null);
  const [nextEnd, setNextEnd] = useState(null);
  const [curColor, setCurColor] = useState(null);
  const [nextColor, setNextColor] = useState(null);
  useEffect(() => {
    const plan = props.plan;
    if (plan) {
      const multiplyXY = (obj, times) => {
        return {
          x: obj.x * times,
          y: obj.y * times
        };
      };
      const startMinutes = clockUtils.getFineMinutes(new Date());
      const curStart = clockUtils.getXY(clockUtils.getTimeDeg60(startMinutes));
      setCurStart(multiplyXY(curStart, props.radius));
      const curMinutes = clockUtils.getFineMinutes(plan.current.toDate());
      const curEnd = clockUtils.getXY(clockUtils.getTimeDeg60(curMinutes));
      setCurEnd(multiplyXY(curEnd, props.radius));
      const nextMinutes = clockUtils.getFineMinutes(plan.next.toDate());
      const nextEnd = clockUtils.getXY(clockUtils.getTimeDeg60(nextMinutes));
      setNextEnd(multiplyXY(nextEnd, props.radius));
      setCurColor(plan.focus ? COLOR.FocusColor : COLOR.RelaxColor);
      setNextColor(plan.focus ? COLOR.RelaxColor : COLOR.FocusColor);
    } else {
      setCurStart(null);
      setCurEnd(null);
      setNextEnd(null);
      setCurColor(null);
      setNextColor(null);
    }
  }, [props.plan]);
  return (
    <g>
      <mask id="timerCircleMask">
        <circle cx="55" cy="55" r="50" fill="white" />
        <circle cx="55" cy="55" r="38" fill="black" />
      </mask>
      {curEnd && (
        <path
          d={`
          M${center.x} ${center.y} ${center.x + curStart.x} ${center.y +
            curStart.y}
          A50 50 0 0 1 ${center.x + curEnd.x} ${center.y + curEnd.y}Z`}
          fill={curColor}
          mask="url(#timerCircleMask)"
        />
      )}
      {nextEnd && (
        <path
          d={`M${center.x} ${center.y}
            L${center.x + curEnd.x} ${center.y + curEnd.y}
            A50 50 0 0 1 ${center.x + nextEnd.x} ${center.y + nextEnd.y}Z`}
          fill={nextColor}
          mask="url(#timerCircleMask)"
        />
      )}
    </g>
  );
}
