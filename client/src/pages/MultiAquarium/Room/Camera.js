class Camera {
  constructor() {
    this.origin = { x: 0, y: 0 };
    this.center = { x: 0, y: 0 };

    this.cvsWidth = undefined;
    this.cvsHeight = undefined;

    this.levelDefault = 10;
    this.levelStep = 1;
    this.levelMax = 20;
    this.levelMin = 1;
    this.levelRange = this.levelMax - this.levelMin;
    this.level = this.levelDefault;
    this.ratioMax = 2;
    this.ratioMin = 0.5;
    this.ratioRange = this.ratioMax - this.ratioMin;
  }

  setLevel(level) {
    this.level = level;
  }

  zoomIn() {
    this.level = Math.min(
      this.levelMax,
      Math.round(this.level + this.levelStep)
    );
    // console.log("Camera ZoomIn", this.level);
  }

  zoomOut() {
    this.level = Math.max(
      this.levelMin,
      Math.round(this.level - this.levelStep)
    );
    // console.log("Camera ZoomOut", this.level);
  }

  getCanvasSize = (size) => {
    // TODO: level과 ratio 범위 확정되면 계산 효율화
    return (
      size *
      (this.ratioMin +
        this.ratioRange * ((this.level - this.levelMin) / this.levelRange))
    );
  };

  getLocalFromMouse = (coord) => {
    // TODO: camera center와 level을 고려해 field 상의 좌표 계산
    console.log("TODO getLocalFromMouse", coord);
    return coord;
  };

  onMouseDown = (e) => {
    console.log("camera onMouseDown");
  };

  onMouseMove = (e) => {
    console.log("camera onMouseMove");
  };

  onMouseUp = (e) => {
    console.log("camera onMouseUp");
  };

  onTouchStart = (e) => {
    console.log("camera onTouchStart");
  };

  onTouchMove = (e) => {
    console.log("camera onTouchMove");
  };

  onTouchEnd = (e) => {
    console.log("camera onTouchEnd");
  };

  onWheel = (e) => {
    console.log("camera onWheel");
  };

  onResize = (cvsWidth, cvsHeight) => {
    this.cvsWidth = cvsWidth;
    this.cvsHeight = cvsHeight;
    // console.log("camera onResize", this.cvsWidth, this.cvsHeight);
  };
}

export default Camera;
