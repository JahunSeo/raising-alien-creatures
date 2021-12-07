import Vector2D from "../lib/Vector2D.js";

class Camera {
  constructor() {
    this.origin = { x: 0, y: 0 };
    this.center = { x: 0, y: 0 };

    this.cvsWidth = undefined;
    this.cvsHeight = undefined;

    this.levelDefault = 6;
    this.levelStep = 1;
    this.levelMax = 12;
    this.levelMin = 1;
    this.levelRange = this.levelMax - this.levelMin;
    this.level = 7; //this.levelDefault;
    this.ratioMax = 2;
    this.ratioMin = 0.5;
    this.planetRatioMin = 1.5;
    this.ratioRange = this.ratioMax - this.ratioMin;
    this.planetRatioRange = this.ratioMax - this.planetRatioMin;

    this.isClicked = false;
    this.isDragging = false;
    this.centerFrom = { x: 0, y: 0 };
    this.dragFrom = { x: 0, y: 0 };
    this.dragRatio = 0.6;
    this.initPinchDist = null;

    this.chasingTarget = null;
    this.velocity = { x: 0, y: 0 };
    this.acceleration = { x: 0, y: 0 };
    this.maxSpeed = 15;
    this.maxForce = 5;
    this.seekLimit = 50;
    this.chasingLimit = 10;

    // 우선순위: chasing > mousedown(drag, click)
  }

  getChasingTarget() {
    if (!this.chasingTarget) return null;
    return this.chasingTarget.monId;
  }

  setChasingTarget(target, cb) {
    this.chasingTarget = target;
    this.cancelChasingCallback = cb;
  }

  cancelChasing() {
    if (!this.chasingTarget) return;
    this.chasingTarget = null;
    this.cancelChasingCallback();
  }

  run() {
    if (!!this.chasingTarget) {
      let x = this.getCanvasSize(this.chasingTarget.location.x);
      let y = this.getCanvasSize(this.chasingTarget.location.y);

      let force = this.seek({ x, y });
      if (!!force) {
        this.applyForce(force);
        this.update();
      } else {
        this.center.x = x;
        this.center.y = y;
      }
    }
  }

  seek(target) {
    let desired = { x: target.x, y: target.y };
    Vector2D.sub(desired, this.center);

    let dist = Vector2D.getMag(desired);
    Vector2D.normalize(desired);
    if (dist < this.chasingLimit) {
      return false;
    } else if (dist < this.seekLimit) {
      let speed = (dist / this.seekLimit) * this.maxSpeed;
      Vector2D.mult(desired, speed);
    } else {
      Vector2D.mult(desired, this.maxSpeed);
    }

    Vector2D.sub(desired, this.velocity);
    Vector2D.limit(desired, this.maxForce);

    return desired;
  }

  applyForce(force) {
    Vector2D.add(this.acceleration, force);
  }

  update() {
    Vector2D.add(this.velocity, this.acceleration);
    Vector2D.limit(this.velocity, this.maxSpeed);
    Vector2D.mult(this.velocity, 0.99);
    Vector2D.add(this.center, this.velocity);
    Vector2D.mult(this.acceleration, 0);
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

  setCenter(x, y) {
    this.center.x = x;
    this.center.y = y;
  }

  getGradientPct = () => {
    // TODO: 배경 이미지로 변경
    if (!this.cvsHeight || !this.center.y) return [0.4, 0.6];

    let baseY = this.cvsHeight;
    let pct1 = (baseY * 0.4 - this.center.y / this.level) / baseY;
    pct1 = Math.min(Math.max(pct1, 0), 1);
    let pct2 = (baseY * 0.6 - this.center.y / this.level) / baseY;
    pct2 = Math.min(Math.max(pct2, 0), 1);
    // console.log(this.level, pct1, pct2);
    return [pct1, pct2];
  };

  getCanvasSize = (size) => {
    // TODO: level과 ratio 범위 확정되면 계산 효율화
    return (
      size *
      (this.ratioMin +
        this.ratioRange * ((this.level - this.levelMin) / this.levelRange))
    );
  };

  getCanvasPlanetSize = (size) => {
    return (
      size *
      (this.planetRatioMin +
        this.planetRatioRange *
          ((this.level - this.levelMin) / this.levelRange))
    );
  };

  getLocalFromMouse = (coord) => {
    // TODO: camera center와 level을 고려해 field 상의 좌표 계산
    console.log("TODO getLocalFromMouse", coord);
    return coord;
  };

  getEventLocation = (e) => {
    // TODO: integrate with setMouseLocal
    let x, y;
    if (e.touches && e.touches.length === 1) {
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
    } else {
      x = e.clientX;
      y = e.clientY;
    }
    return { x, y };
  };

  resetEveryFrame = () => {
    this.isClicked = false;
  };

  onMouseDown = (e) => {
    // console.log("camera onMouseDown");
    e.preventDefault();
    let evtLocal = this.getEventLocation(e);
    this.isMouseDown = true;
    this.isDragging = false;
    this.dragFrom.x = evtLocal.x;
    this.dragFrom.y = evtLocal.y;
    this.centerFrom.x = this.center.x;
    this.centerFrom.y = this.center.y;
    this.cancelChasing();
  };

  onMouseMove = (e) => {
    // console.log("camera onMouseMove", this.isDragging);
    if (!this.isMouseDown) return;
    let evtLocal = this.getEventLocation(e);
    let pxLimit = 2;
    if (
      Math.abs(this.dragFrom.x - evtLocal.x) > pxLimit ||
      Math.abs(this.dragFrom.y - evtLocal.y) > pxLimit
    ) {
      this.isDragging = true;
    }

    if (this.isDragging) {
      let x =
        this.centerFrom.x - (evtLocal.x - this.dragFrom.x) * this.dragRatio;
      let y =
        this.centerFrom.y - (evtLocal.y - this.dragFrom.y) * this.dragRatio;
      this.setCenter(x, y);
    }
  };

  onMouseUp = (e) => {
    // console.log("camera onMouseUp");
    if (this.isMouseDown && !this.isDragging) {
      this.isClicked = true;
    }
    this.isMouseDown = false;
    this.isDragging = false;
  };

  onTouchStart = (e) => this.handleTouch(e, this.onMouseDown);
  onTouchMove = (e) => this.handleTouch(e, this.onMouseMove);
  onTouchEnd = (e) => this.handleTouch(e, this.onMouseUp);

  onWheel = (e) => {
    // console.log("camera onWheel");
  };

  onResize = (cvsWidth, cvsHeight) => {
    this.cvsWidth = cvsWidth;
    this.cvsHeight = cvsHeight;
    // console.log("camera onResize", this.cvsWidth, this.cvsHeight);
  };

  handleTouch = (e, singleTouchHandler) => {
    if (e.touches.length <= 1) {
      singleTouchHandler(e);
    } else if (e.type === "touchmove" && e.touches.length === 2) {
      this.isDragging = false;
      // TODO
      // this.handlePinch(e);
    }
  };
}

export default Camera;
