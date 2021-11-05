import React, { useState, useEffect } from "react";
import MultiField from "./MultiField";
import * as API from "../../apis";

import styles from "./index.module.css";

export default function MultiAquarium() {
  const [testMsg, setTestMsg] = useState("default text");
  const [testNum, setTestNum] = useState(-1);
  useEffect(() => {
    try {
      const fetchData = async () => {
        const res = await API.get("/test");
        const data = await res.json();
        console.log(data);
        setTestMsg(data.msg);
        setTestNum(Math.round(data.body * 10000) / 10000);
      };

      fetchData();
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
    <div className={styles.body}>
      <section className={styles.SecHead}>
        <h1>Hello Align</h1>
        <p>{testMsg}</p>
        <p>{testNum}</p>
      </section>
      <section className={styles.SecField}>
        <MultiField seed={testNum} />
      </section>
    </div>
  );
}
