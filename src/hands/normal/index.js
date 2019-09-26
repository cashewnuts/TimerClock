import React from "react";
import clockUtils from "../../utils/clock-utils";

export function SecondHand(props) {
  let time = props.time;
  const seconds = time.getSeconds();
  const deg = clockUtils.getTimeDeg60(seconds);
  const { x, y } = clockUtils.getXY(deg);
  const innRadius = props.radius * 0.84;
  const centerX = props.viewport.center.x;
  const centerY = props.viewport.center.y;
  const x2 = x * innRadius + centerX;
  const y2 = y * innRadius + centerY;

  return (
    <line
      x1={centerX}
      y1={centerY}
      x2={x2}
      y2={y2}
      stroke={props.color}
      strokeWidth="1"
    />
  );
}
export function MinuteHand(props) {
  let minutes = props.time.getMinutes();
  const seconds = props.time.getSeconds();
  minutes += seconds / 60;
  const deg = clockUtils.getTimeDeg60(minutes);
  const { x, y } = clockUtils.getXY(deg);
  const innRadius = props.radius * 0.76;
  const centerX = props.viewport.center.x;
  const centerY = props.viewport.center.y;
  const x2 = x * innRadius + centerX;
  const y2 = y * innRadius + centerY;

  return (
    <line
      x1={centerX}
      y1={centerY}
      x2={x2}
      y2={y2}
      stroke={props.color}
      strokeWidth="2"
    />
  );
}
export function HourHand(props) {
  let hours = props.time.getHours();
  const minutes = props.time.getMinutes();
  hours += minutes / 60;
  const deg = clockUtils.getTimeDeg12(hours);
  const { x, y } = clockUtils.getXY(deg);
  const innRadius = props.radius * 0.6;
  const centerX = props.viewport.center.x;
  const centerY = props.viewport.center.y;
  const x2 = x * innRadius + centerX;
  const y2 = y * innRadius + centerY;

  return (
    <line
      x1={centerX}
      y1={centerY}
      x2={x2}
      y2={y2}
      stroke={props.color}
      strokeWidth="4"
    />
  );
}
