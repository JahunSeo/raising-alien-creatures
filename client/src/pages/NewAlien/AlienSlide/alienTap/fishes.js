import { useState, useEffect } from "react";
import "./fishes.css";

const Fishes = ({ S3URL, alienCategory, imageInfo }) => {
  const [images, setImages] = useState(null); // fish
  const [images1, setImages1] = useState(null); // seal
  const [images2, setImages2] = useState(null); // puffish

  useEffect(() => {
    if (imageInfo) {
      setImages(imageInfo[0].image_url.split(", "));
      setImages1(imageInfo[1].image_url.split(", "));
      setImages2(imageInfo[2].image_url.split(", "));
    }
  }, [imageInfo]);
  return (
    <figure id={alienCategory.type}>
      {images &&
        alienCategory.type === "fish" &&
        images.map((kinds) => {
          const kkinds = kinds.split("-")[0];
          return (
            <div
              id={`fish${imageInfo[0].count}`}
              key={kinds}
              style={{ backgroundImage: `url(${S3URL}${kkinds})` }}
            />
          );
        })}
      {images1 &&
        alienCategory.type === "seal" &&
        images1.map((kinds) => {
          const kkinds = kinds.split("-")[0];
          return (
            <div
              id={`seal${imageInfo[1].count}`}
              key={kinds}
              style={{ backgroundImage: `url(${S3URL}${kkinds})` }}
            />
          );
        })}
      {images2 &&
        alienCategory.type === "puffish" &&
        images2.map((kinds, i) => {
          const kkinds = kinds.split("-")[0].split("h_")[0];
          return (
            <div
              key={i}
              id={`puffish${imageInfo[2].count}`}
              style={{
                backgroundImage: `url(${S3URL}${kkinds}h_${i + 4}.png)`,
              }}
            />
          );
        })}
    </figure>
  );
};

export default Fishes;
