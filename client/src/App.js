import React, { useState, useEffect } from "react";
import * as API from "./apis";

import "./App.css";

function App() {
  const [testMsg, setTestMsg] = useState("default text");
  const [testNum, setTestNum] = useState(-1);
  useEffect(() => {
    try {
      const fetchData = async () => {
        const res = await API.get("/test");
        const data = await res.json();
        console.log(data);
        setTestMsg(data.msg);
        setTestNum(Math.round(data.body * 100) / 100);
      };

      fetchData();
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
    <div className="App">
      <h1>Hello Align</h1>
      <p>{testMsg}</p>
      <p>{testNum}</p>
    </div>
  );
}

export default App;
