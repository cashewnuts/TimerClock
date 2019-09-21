import React from "react";
import clockUtils from "../../utils/clock-utils";

export function SecondHand(props) {
  const seconds = props.time.getSeconds();
  const deg = clockUtils.getTimeDeg60(seconds);
  const { x, y } = clockUtils.getXY(deg);
  const innRadius = props.radius * 0.84;
  const centerX = props.viewport.center.x;
  const centerY = props.viewport.center.y;

  return (
    <line
      x1={0}
      y1={0}
      x2={x * innRadius}
      y2={y * innRadius}
      stroke={props.color}
      strokeWidth="1"
      transform-origin="50% 100%"
      transform={`translate(${centerX} ${centerY})`}
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

  return (
    <line
      x1={0}
      y1={0}
      x2={x * innRadius}
      y2={y * innRadius}
      stroke={props.color}
      strokeWidth="2"
      transform-origin="50% 100%"
      transform={`translate(${centerX} ${centerY})`}
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

  return (
    <line
      x1={0}
      y1={0}
      x2={x * innRadius}
      y2={y * innRadius}
      stroke={props.color}
      strokeWidth="4"
      transform-origin="50% 100%"
      transform={`translate(${centerX} ${centerY})`}
    />
  );
}
