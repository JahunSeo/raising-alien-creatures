import "./seal.css";

const Seal = ({ S3URL, alienCategory }) => {
  return (
    <figure id="seal">
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
    </figure>
  );
};

export default Seal;
