class Camera {
  constructor() {
    this.origin = { x: 0, y: 0 };
    this.center = { x: 0, y: 0 };

    this.level = 5; // default: 1 ~ 10
    this.levelStep = 1;
    this.levelMax = 10;
    this.levelMin = 1;
  }

  setLevel(level) {
    this.level = level;
  }

  zoomIn() {
    this.level = Math.min(
      this.levelMax,
      Math.round(this.level + this.levelStep)
    );
  }

  zoomOut() {
    this.level = Math.max(
      this.levelMin,
      Math.round(this.level - this.levelStep)
    );
  }
}

export default Camera;
