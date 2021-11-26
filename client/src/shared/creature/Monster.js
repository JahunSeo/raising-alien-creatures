import Vector2D from "../lib/Vector2D.js";
import { S3URL } from "../lib/Constants.js";

class Monster {
  constructor(props) {
    this.userId = props.userId;
    this.monId = props.monId;
    this.isUserOnRoom = false;
    this.authCnt = props.authCnt || 0;
    this.wanderRange = props.wanderRange;
    this.color = props.color;
    this.size = 40 + this.authCnt * 2;

    // Alien_base/fish_0.png-Alien_base/fish_0_reverse.png-4-3-1992-981
    //          0                      1                   2 3  4    5
    // TODO: 임시처리된 코드 개선
    let parsed = props.image_url && props.image_url.split("-");
    if (parsed && parsed[0].startsWith("Alien_base")) {
      this.image_url = parsed;
    }
    this.init();
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
    // this.color = this.getRandomColor();

    // for sprite images
    if (this.image_url) {
      this.spriteWidth = this.image_url[4] / this.image_url[2];
      this.spriteHeight = this.image_url[5] / this.image_url[3];
      this.spriteAngle = 0;
      this.frameX = Math.floor(Math.random() * this.image_url[2]); // 0~3
      this.frameY = Math.floor(Math.random() * this.image_url[3]); // 0~2
      this.fishLeft = new Image();
      this.fishLeft.src = S3URL + this.image_url[0];
      this.fishRight = new Image();
      this.fishRight.src = S3URL + this.image_url[1];
    }
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

  calculateFrames(frameCnt) {
    if (frameCnt % 10 === 0) {
      this.frameX++;
      this.frameY += this.frameX === parseInt(this.image_url[2]) ? 1 : 0;
      this.frameX %= this.image_url[2];
      this.frameY %= this.image_url[3];
    }
  }

  display(ctx, frameCnt, room) {
    let x = room.camera.getCanvasSize(this.location.x);
    let y = room.camera.getCanvasSize(this.location.y);
    let size = room.camera.getCanvasSize(this.size);

    // // draw circle
    // ctx.beginPath();
    // ctx.arc(x, y, size / 2, 0, Math.PI * 2);
    // ctx.fillStyle = this.color;
    // if (this.isUserOnRoom && frameCnt % 100 <= 40) {
    //   ctx.fillStyle = "tomato";
    // }
    // ctx.fill();

    // draw sprite images
    if (this.image_url) {
      this.calculateFrames(frameCnt);
      ctx.save();
      ctx.translate(x, y);
      let direction = this.location.x - this.destination.x;
      ctx.rotate(this.spriteAngle);
      if (direction > 0) {
        ctx.drawImage(
          this.fishLeft,
          this.frameX * this.spriteWidth,
          this.frameY * this.spriteHeight,
          this.spriteWidth,
          this.spriteHeight,
          -size / 2,
          -size / 2,
          size,
          size
        );
      } else {
        ctx.drawImage(
          this.fishRight,
          this.frameX * this.spriteWidth,
          this.frameY * this.spriteHeight,
          this.spriteWidth,
          this.spriteHeight,
          -size / 2,
          -size / 2,
          size,
          size
        );
      }
      ctx.restore();
    }
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
    this.spriteAngle = Math.atan2(dy, dx);
    let angleBase = this.spriteAngle - Math.PI;
    // let angleBase = Math.atan2(dy, dx) - Math.PI;

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
