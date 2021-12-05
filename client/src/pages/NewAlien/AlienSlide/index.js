import React, { useEffect } from "react";
import styles from "./index.module.css";
import { S3URL } from "../../../shared/lib/Constants";
import Fishes from "./alienTap/fishes";

function AlienSlide({ alienNumber, setAlienNumber, alienCategory, imageInfo }) {
  function galleryspin(sign) {
    if (!sign) {
      setAlienNumber(alienNumber + 1);
    } else {
      setAlienNumber(alienNumber - 1);
    }
  }

  function spin(angle) {
    const spinner = document.querySelector(`#${alienCategory.type}`);
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

  useEffect(
    () => {
      let angle = alienNumber * alienCategory.angle;

      spin(angle);
    },
    [alienNumber],
    [alienCategory.angle]
  );

  return (
    <>
      <div className={styles.carousel} id="carousel">
        <Fishes
          S3URL={S3URL}
          alienCategory={alienCategory}
          imageInfo={imageInfo}
        />
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
