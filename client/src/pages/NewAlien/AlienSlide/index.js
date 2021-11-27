import React, { useEffect } from "react";
import styles from "./index.module.css";

function AlienSlide({ alienNumber, setAlienNumber }) {
  // var angle = 0;
  function galleryspin(sign) {
    if (!sign) {
      // angle = angle + 45;
      setAlienNumber(alienNumber + 1);
      // console.log("alienNumber", alienNumber);
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
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          {/* <img
            src="https://namu-alien-s3.s3.ap-northeast-2.amazonaws.com/Alien_base/fish_1.png"
            alt="이미지 로딩 실패"
          />
          <img
            src="https://namu-alien-s3.s3.ap-northeast-2.amazonaws.com/Alien_base/fish_2.png"
            alt="이미지 로딩 실패"
          />
          <img
            src="https://namu-alien-s3.s3.ap-northeast-2.amazonaws.com/Alien_base/fish_3.png"
            alt="이미지 로딩 실패"
          />
          <img
            src="https://namu-alien-s3.s3.ap-northeast-2.amazonaws.com/Alien_base/fish_4.png"
            alt="이미지 로딩 실패"
          />
          <img
            src="https://namu-alien-s3.s3.ap-northeast-2.amazonaws.com/Alien_base/fish_5.png"
            alt="이미지 로딩 실패"
          />
          <img src={DeanImage} alt="이미지 로딩 실패" />
          <img src={babyshark} alt="이미지 로딩 실패" /> */}
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
