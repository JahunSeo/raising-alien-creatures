import React from "react";
import styles from "./index.module.css";
import DeanImage from "../../../image/dean.png";
import babyshark from "../../../image/babyshark.png";

function AlienSlide() {
  var angle = 0;
  function galleryspin(sign) {
    const spinner = document.querySelector("#spinner");
    if (!sign) {
      angle = angle + 45;
    } else {
      angle = angle - 45;
    }
    console.log("spinner:", spinner);
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
  return (
    <>
      <div className={styles.carousel} id="carousel">
        <figure id="spinner">
          <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/4273/wanaka-tree.jpg" />
          <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/4273/still-lake.jpg" />
          <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/4273/pink-milford-sound.jpg" />
          <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/4273/paradise.jpg" />
          {/* <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/4273/morekai.jpg" /> */}
          {/* <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/4273/milky-blue-lagoon.jpg" /> */}
          {/* <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/4273/lake-tekapo.jpg" /> */}
          {/* <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/4273/milford-sound.jpg" /> */}
          <img src={DeanImage} alt="이미지 로딩 실패" />
          <img src={babyshark} alt="이미지 로딩 실패" />
          <img src={DeanImage} alt="이미지 로딩 실패" />
          <img src={babyshark} alt="이미지 로딩 실패" />
          {/* <img src={DeanImage} alt="이미지 로딩 실패" /> */}
          {/* <img src={DeanImage} alt="이미지 로딩 실패" /> */}
          {/* <img src={DeanImage} alt="이미지 로딩 실패" /> */}
          {/* <img src={DeanImage} alt="이미지 로딩 실패" /> */}
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
