import React, { useState } from "react";
import ClockFrame from "./ClockFrame";
import ClockHands from "./ClockHands";
export default function Clock(props) {
  const defaultProps = {
    fill: "#ffdd00",
    stroke: "#ff0000",
    frameColor: "#ffffff"
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
    </g>
  );
}
