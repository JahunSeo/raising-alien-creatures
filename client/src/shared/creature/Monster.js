import Vector2D from "../lib/Vector2D.js";

class Monster {
  constructor(props) {
    // TODO
    this.userId = props.userId;
    this.monId = props.monId;
    this.isUserOnRoom = false;
    this.init();
    if (!!props.color) this.color = props.color;
    if (!!props.authCnt) this.size = 20 + props.authCnt * 2;
  }

  init() {
    // generate random monster
    this.location = this.getRandLocation();
    this.velocity = { x: 0, y: 0 };
    this.acceleration = { x: 0, y: 0 };

    this.maxSpeed = 2;
    this.maxForce = 0.2;
    this.seekLimit = 50;

    this.defaultAngle = -Math.PI / 2;
    this.angle = this.defaultAngle;

    this.destination = { ...this.location };
    this.size = 50 + Math.random() * 100;
    this.color = this.getRandomColor();
  }

  overwrite(monPlain) {
    for (const property in monPlain) {
      this[property] = monPlain[property];
    }
  }

  sync(monPlain) {
    // temp
    this.destination = monPlain.destination;
    this.size = monPlain.size;
  }

  getRandLocation() {
    let randRange = 300;
    let x = (Math.random() - 0.5) * randRange;
    let y = (Math.random() - 0.5) * randRange;
    return { x, y };
  }

  run() {
    let force = this.seek(this.destination);
    this.applyForce(force);
    this.update();
  }

  seek(target) {
    let desired = { x: target.x, y: target.y };
    Vector2D.sub(desired, this.location);

    let dx = this.location.x - target.x;
    let dy = this.location.y - target.y;
    let angleBase = Math.atan2(dy, dx) - Math.PI;

    let dist = Vector2D.getMag(desired);
    Vector2D.normalize(desired);
    if (dist < this.seekLimit) {
      let speed = (dist / this.seekLimit) * this.maxSpeed;
      let da = this.defaultAngle;
      Vector2D.mult(desired, speed);
      this.angle = da - (da - angleBase) * (dist / this.seekLimit);
    } else {
      Vector2D.mult(desired, this.maxSpeed);
      this.angle = angleBase;
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
    Vector2D.add(this.location, this.velocity);
    Vector2D.mult(this.acceleration, 0);
  }

  directUpdate(features) {
    // TODO: refactoring logic
    for (const key in features) {
      this[key] = features[key];
    }
  }

  getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}

export default Monster;
