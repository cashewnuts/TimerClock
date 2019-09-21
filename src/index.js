import React from "react";
import ReactDOM from "react-dom";
import TimerSvg from "./TimerSvg";

import "./styles.css";

function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <div className="flex-center">
        <div style={{ width: "70vw" }}>
          <TimerSvg />
        </div>
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
