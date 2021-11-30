import "./fish.css";

const Fish = ({ S3URL, alienCategory }) => {
  return (
    <figure id="fish">
      <div
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
      />
    </figure>
  );
};

export default Fish;
