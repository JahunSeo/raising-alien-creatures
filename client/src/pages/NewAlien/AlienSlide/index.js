import React, { useEffect } from "react";
import styles from "./index.module.css";
import DeanImage from "../../../image/dean.png";
import babyshark from "../../../image/babyshark.png";

function AlienSlide({ alienNumber, setAlienNumber }) {
  // var angle = 0;
  function galleryspin(sign) {
    if (!sign) {
      // angle = angle + 45;
      setAlienNumber(alienNumber + 1);
      console.log("alienNumber", alienNumber);
    } else {
      // angle = angle - 45;
      setAlienNumber(alienNumber - 1);
    }
  }

  function spin(angle) {
    const spinner = document.querySelector("#spinner");
    if (spinner) {
      spinner.setAttribute(
        "style",
        "-webkit-transform: rotateY(" +
          angle +
          "deg); -moz-transform: rotateY(" +
          angle +
          "deg); transform: rotateY(" +
          angle +
          "deg);"
      );
    }
  }

  useEffect(() => {
    let angle = alienNumber * 45;

    // console.log(alienNumber);
    // console.log(Math.abs(-18 % 8));
    spin(angle);
  }, [alienNumber]);

  return (
    <>
      <div className={styles.carousel} id="carousel">
        <figure id="spinner">
          <img
            src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/4273/wanaka-tree.jpg"
            alt="이미지 로딩 실패"
          />
          <img
            src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/4273/still-lake.jpg"
            alt="이미지 로딩 실패"
          />
          <img
            src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/4273/pink-milford-sound.jpg"
            alt="이미지 로딩 실패"
          />
          <img
            src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/4273/paradise.jpg"
            alt="이미지 로딩 실패"
          />
          <img
            src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/4273/morekai.jpg"
            alt="이미지 로딩 실패"
          />
          <img
            src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/4273/milky-blue-lagoon.jpg"
            alt="이미지 로딩 실패"
          />
          <img src={DeanImage} alt="이미지 로딩 실패" />
          <img src={babyshark} alt="이미지 로딩 실패" />
        </figure>
      </div>
      <span
        style={{ float: "left" }}
        className="ss-icon"
        onClick={() => galleryspin("")}
      >
        &lt;
      </span>
      <span
        style={{ float: "right" }}
        className="ss-icon"
        onClick={() => galleryspin("-")}
      >
        &gt;
      </span>
    </>
  );
}

export default AlienSlide;
