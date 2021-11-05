import React, { useState, useEffect } from "react";
import * as API from "./apis";

import "./App.css";

function App() {
  const [testNum, setTestNum] = useState(0);
  useEffect(() => {
    try {
      const fetchData = async () => {
        const res = await API.get("/test");
        const data = await res.json();
        console.log(data);
        setTestNum(Math.random());
      };

      fetchData();
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
    <div className="App">
      <h1>Hello Align</h1>
      <p>{testNum}</p>
    </div>
  );
}

export default App;
