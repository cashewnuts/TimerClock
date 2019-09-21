import React from "react";
import clockUtils from "./utils/clock-utils";

export default function ClockFrame(props) {
  const ticks = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  return (
    <g>
      <defs>
        <mask id="donutmask">
          <circle
            id="outer"
            cx={props.viewport.center.x}
            cy={props.viewport.center.x}
            r={props.radius + 1}
            fill="white"
          />
          <circle
            id="inner"
            cx={props.viewport.center.x}
            cy={props.viewport.center.x}
            r={props.radius - 1}
          />
        </mask>
        <filter id="tick-shadow" filterUnits="userSpaceOnUse">
          <feGaussianBlur in="SourceAlpha" stdDeviation="0.5" />
          <feOffset dx="0.5" dy="0.5" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.5" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="frame-shadow" filterUnits="userSpaceOnUse">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
          <feOffset dx="0.5" dy="0.5" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.5" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {ticks.map((t, idx) => {
        const radius = props.radius;
        const innerRadius = props.radius * 0.9;
        const degree = t * 30;
        const { x, y } = clockUtils.getXY(degree);
        const moveToXCenter = val => {
          return val + props.viewport.center.x;
        };
        const moveToYCenter = val => {
          return val + props.viewport.center.y;
        };
        const x1 = moveToXCenter(x * radius);
        const x2 = moveToXCenter(x * innerRadius);
        const y1 = moveToYCenter(y * radius);
        const y2 = moveToYCenter(y * innerRadius);
        return (
          <>
            <line
              key={idx}
              x1={x1}
              x2={x2}
              y1={y1}
              y2={y2}
              strokeWidth="1"
              stroke={props.frameColor}
              style={{ filter: "url(#tick-shadow)" }}
            />
          </>
        );
      })}
      <circle
        cx={props.viewport.center.x}
        cy={props.viewport.center.y}
        r={props.radius}
        fill="none"
        stroke={props.frameColor}
        strokeWidth="1.5"
        style={{ filter: "url(#frame-shadow)" }}
      />
    </g>
  );
}
