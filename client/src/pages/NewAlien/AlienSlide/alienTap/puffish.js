import "./puffish.css";

const Puffish = ({ S3URL, alienCategory }) => {
  return (
    <figure id="puffish">
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
      <div
        style={{
          backgroundImage: `url("${S3URL}Alien_base/${alienCategory.type}_6.png")`,
        }}
      />
      <div
        style={{
          backgroundImage: `url("${S3URL}Alien_base/${alienCategory.type}_7.png")`,
        }}
      />
    </figure>
  );
};

export default Puffish;
