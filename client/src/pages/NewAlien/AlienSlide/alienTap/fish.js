import "./fish.css";

const Fish = ({ S3URL, alienCategory, imageInfo }) => {
  if (imageInfo) {
    // console.log(33333, imageInfo[0].image_url.split(",")[1]);
    // console.log(33333, imageInfo[0].image_url.split(",")[1].split(".png")[0]);
    const images = imageInfo[0].image_url.split(",")[1].split("-")[0];
    console.log("images", images);
  }
  const images = imageInfo[0].image_url.split(",")[1].split("-")[0];
  return (
    <figure id="fish">
      {images.map((kinds, i) => {
        return <div stry={{ backgroundImage: `url(${S3URL}${kinds})` }} />;
      })}
      {/* <div
        style={{
          backgroundImage: `url("${S3URL}Alien_base/${alienCategory.type}_0.png")`,
        }}
      />
      <div
        style={{
          backgroundImage: `url("${S3URL}Alien_base/${alienCategory.type}_1.png")`,
        }}
      />
      <div
        style={{
          backgroundImage: `url("${S3URL}Alien_base/${alienCategory.type}_2.png")`,
        }}
      />
      <div
        style={{
          backgroundImage: `url("${S3URL}Alien_base/${alienCategory.type}_3.png")`,
        }}
      />
      <div
        style={{
          backgroundImage: `url("${S3URL}Alien_base/${alienCategory.type}_4.png")`,
        }}
      />
      <div
        style={{
          backgroundImage: `url("${S3URL}Alien_base/${alienCategory.type}_5.png")`,
        }}
      /> */}
    </figure>
  );
};

export default Fish;
