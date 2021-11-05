import React, { Component } from "react";
import Canvas from "../../../components/Canvas";

export default class Field extends Component {
  componentDidMount() {
    window.addEventListener("resize", this.resizeEventHandler);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeEventHandler);
  }

  resizeEventHandler = (e) => {
    this.stageWidth = window.innerWidth || document.body.clientWidth;
    this.stageHeight = window.innerHeight || document.body.clientHeight;
  };

  draw = (ctx, frameCnt, mouseObj) => {
    let cvsWidth = ctx.canvas.width;
    let cvsHeight = ctx.canvas.height;
    ctx.save();
    ctx.clearRect(0, 0, cvsWidth, cvsHeight);

    // draw background
    ctx.fillStyle = `rgba(255, 255, 255, 1)`;
    ctx.fillRect(0, 0, cvsWidth, cvsHeight);

    ctx.fillStyle = `rgba(100, 100, 100, 1)`;
    let monsterSize = 100;
    ctx.fillRect(
      cvsWidth / 2 - monsterSize / 2,
      cvsHeight / 2 - monsterSize / 2,
      monsterSize,
      monsterSize
    );

    ctx.restore();
  };

  render() {
    return <Canvas draw={this.draw} />;
  }
}
