import React from "react";
import { SecondHand, MinuteHand, HourHand } from "./hands/normal";

export default function ClockHands(props) {
  return (
    <g>
      <SecondHand {...props} />
      <MinuteHand {...props} />
      <HourHand {...props} />
    </g>
  );
}
