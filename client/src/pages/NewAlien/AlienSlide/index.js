import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import { S3URL } from "../../../shared/lib/Constants";
import Fish from "./alienTap/fish";
import Seal from "./alienTap/seal";
import Puffish from "./alienTap/puffish";

function AlienSlide({ alienNumber, setAlienNumber, alienCategory }) {
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
        {
          {
            fish: <Fish S3URL={S3URL} alienCategory={alienCategory} />,
            seal: <Seal S3URL={S3URL} alienCategory={alienCategory} />,
            puffish: <Puffish S3URL={S3URL} alienCategory={alienCategory} />,
          }[alienCategory.type]
        }
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
