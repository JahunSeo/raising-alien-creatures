import "./seal.css";

const Seal = ({ S3URL }) => {
  return (
    <figure id="seal">
      <div
        style={{ backgroundImage: `url("${S3URL}Alien_base/fish_0.png")` }}
      />
      <div
        style={{ backgroundImage: `url("${S3URL}Alien_base/fish_1.png")` }}
      />
      <div
        style={{ backgroundImage: `url("${S3URL}Alien_base/fish_2.png")` }}
      />
      <div
        style={{ backgroundImage: `url("${S3URL}Alien_base/fish_3.png")` }}
      />
      <div
        style={{ backgroundImage: `url("${S3URL}Alien_base/fish_4.png")` }}
      />
      <div
        style={{ backgroundImage: `url("${S3URL}Alien_base/fish_5.png")` }}
      />
    </figure>
  );
};

export default Seal;
