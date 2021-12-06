// import Vector2D from "../lib/Vector2D.js"

class Star {
  constructor(props) {
    this.x = 0;
    this.y = 0;
    this.r = 0;
    this.color = "#ffffff";
    this.beforeRelocate = -1;
    this.colorset = [
      `rgba(255, 255, 255, 0.3)`,
      `rgba(0, 229, 186, 0.3)`,
      `rgba(240, 192, 255, 0.5)`,
    ];
  }

  run(ctx) {
    if (this.beforeRelocate < 0) this.relocate(ctx);
    this.update(ctx);
    this.display(ctx);
  }

  update(ctx) {
    this.r = Math.max(this.r - 0.05, 0);
    this.beforeRelocate--;
  }

  display(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
    ctx.shadowBlur = 8;
    ctx.shadowColor = "rgba(255, 255, 255, 1)";
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }

  relocate(ctx) {
    // position and size
    let cvsWidth = ctx.canvas.width;
    let cvsHeight = ctx.canvas.height;
    this.x = Math.floor(Math.random() * cvsWidth);
    this.y = Math.floor(Math.random() * cvsHeight);
    this.r = 1 + Math.floor(Math.random() * 2);
    // color
    this.color =
      this.colorset[Math.floor(Math.random() * this.colorset.length)];
    // duration
    this.beforeRelocate = 10 + Math.floor(Math.random() * 60);
  }
}

export default Star;
