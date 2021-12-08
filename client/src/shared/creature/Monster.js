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

    this.showBubble = false;
    this.practiceStatus = 0;
    this.practiceDays = [];
    this.alienStatus = 0;

    this.showEmoji = false;
    this.emojiFrame = 0;
    //                                                             L       M       S
    // Alien_base/fish_0.png-Alien_base/fish_0_reverse.png-4-3-1992-981-640-316-320-158
    //          0                      1                   2 3  4    5   6   7   8   9
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
      this.fishLeft = new Image();
      this.fishRight = new Image();

      if (this.authCnt > 60) {
        this.width = this.image_url[4];
        this.height = this.image_url[5];
        this.fishLeft.src = S3URL + this.image_url[0];
        this.fishRight.src = S3URL + this.image_url[1];
      } else if (this.authCnt <= 60 && this.authCnt > 10) {
        this.width = this.image_url[6];
        this.height = this.image_url[7];
        this.fishLeft.src =
          S3URL +
          this.image_url[0].split("/")[0] +
          "/M/" +
          this.image_url[0].split("/")[1];
        this.fishRight.src =
          S3URL +
          this.image_url[1].split("/")[0] +
          "/M/" +
          this.image_url[1].split("/")[1];
      } else {
        this.width = this.image_url[8];
        this.height = this.image_url[9];
        this.fishLeft.src =
          S3URL +
          this.image_url[0].split("/")[0] +
          "/S/" +
          this.image_url[0].split("/")[1];
        this.fishRight.src =
          S3URL +
          this.image_url[1].split("/")[0] +
          "/S/" +
          this.image_url[1].split("/")[1];
      }

      this.spriteWidth = this.width / this.image_url[2];
      this.spriteHeight = this.height / this.image_url[3];
      this.spriteAngle = 0;
      this.frameX = Math.floor(Math.random() * this.image_url[2]); // 0~3
      this.frameY = Math.floor(Math.random() * this.image_url[3]); // 0~2

      this.bubbleR = new Image();
      this.bubbleR.src = require("../../image/bubble-512px-red.png").default;
      this.bubbleW = new Image();
      this.bubbleW.src = require("../../image/bubble-512px.png").default;

      this.emoji = new Image();
      this.emoji.src = require("../../image/emoji_bubbles.png").default;
    }
  }

  setEmojis(emoji) {
    this.showEmoji = emoji;
    this.emojiFrame = 0;
  }

  overwrite(monPlain) {
    for (const property in monPlain) {
      this[property] = monPlain[property];
    }
  }

  increaseAuthCnt() {
    this.authCnt++;
    this.size = 40 + this.authCnt * 2;
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

    // draw circle
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

      if (!this.image_url[0].includes("seal")) {
        if (this.showBubble && this.alienStatus === 0) {
          const todayValue = new Date().getDay();
          const isPracticeDay = this.practiceDays[todayValue];
          if (this.practiceStatus === 1) {
            ctx.drawImage(this.bubbleW, -size / 1.6, -size / 1.6, size * 1.2, size * 1.2);
          } else if (isPracticeDay && this.practiceStatus === 0) {
            ctx.drawImage(this.bubbleR, -size / 1.6, -size / 1.6, size * 1.2, size * 1.2);
          }
        }
        ctx.restore();
        if (this.showEmoji) {
          ctx.drawImage(
            this.emoji,
            x - 40 - size / 4,
            y - 40 - size / 3,
            60,
            60
          );
          ctx.font = "25px sans-serif";
          ctx.fillText(this.showEmoji, x - 33 - size / 4, y - 15 - size / 3);
          this.emojiFrame++;
          if (this.emojiFrame >= 200) {
            this.showEmoji = false;
          }
        }
      }

      // 물개를 위한 특단의 조치
      else if (this.image_url[0].includes("seal")) {
        const todayValue = new Date().getDay();
        const isPracticeDay = this.practiceDays[todayValue];
        if (this.showBubble) {
          if (this.practiceStatus === 1) {
            if (direction > 0) {
              ctx.drawImage(this.bubbleW, -size / 2, -size / 4, size, size);
            } else {
              ctx.drawImage(this.bubbleW, -size / 2, -size / 1.5, size, size);
            }
          } else if (isPracticeDay && this.practiceStatus === 0) {
            if (direction > 0) {
              ctx.drawImage(this.bubbleR, -size / 2, -size / 4, size, size);
            } else {
              ctx.drawImage(this.bubbleR, -size / 2, -size / 1.5, size, size);
            }
          }
        }
        ctx.restore();
        if (this.showEmoji && this.authCnt <= 60) {
          ctx.drawImage(
            this.emoji,
            x - 40 - size / 3,
            y - 40 - size / 3,
            60,
            60
          );
          ctx.font = "25px sans-serif";
          ctx.fillText(this.showEmoji, x - 37 - size / 4, y - 15 - size / 3);
          this.emojiFrame++;
          if (this.emojiFrame >= 200) {
            this.showEmoji = false;
          }
        }
        if (this.showEmoji && this.authCnt > 60) {
          ctx.drawImage(this.emoji, x - 40 - size / 4, y - size / 3, 60, 60);
          ctx.font = "25px sans-serif";
          ctx.fillText(this.showEmoji, x - 35 - size / 4, y - size / 3.8);
          this.emojiFrame++;
          if (this.emojiFrame >= 200) {
            this.showEmoji = false;
          }
        }
      }
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
