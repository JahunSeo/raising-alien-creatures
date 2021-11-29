import "./fish.css";

const Fish = ({ S3URL }) => {
  return (
    <figure id="fish">
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
      <div
        style={{ backgroundImage: `url("${S3URL}Alien_base/fish_0.png")` }}
      />
      <div
        style={{ backgroundImage: `url("${S3URL}Alien_base/fish_1.png")` }}
      />
    </figure>
  );
};

export default Fish;
