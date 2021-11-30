import "./puffish.css";

const Puffish = ({ S3URL, alienCategory }) => {
  return (
    <figure id="puffish">
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
    </figure>
  );
};

export default Puffish;
