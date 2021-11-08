const Vector2D = require("./Vector2D");

class Monster {
  constructor(userId) {
    // TODO
    this.userId = userId; // TODO: user id or email
    this.init();
  }

  init() {
    // generate random monster
    let randRange = 300;
    let x = (Math.random() - 0.5) * randRange;
    let y = (Math.random() - 0.5) * randRange;

    this.position = { x, y };
    this.destination = { x, y };
    this.size = 50 + Math.random() * 100;
    this.color = this.getRandomColor();
  }

  update(features) {
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

module.exports = Monster;
