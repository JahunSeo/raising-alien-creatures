import React, { Component } from "react";
import Canvas from "../../../components/Canvas";

import * as socket from "../../../apis/socket";

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
    // console.log(mouseObj);
    let cvsWidth = ctx.canvas.width;
    let cvsHeight = ctx.canvas.height;
    ctx.save();
    ctx.clearRect(0, 0, cvsWidth, cvsHeight);

    // translate position
    ctx.translate(cvsWidth / 2, cvsHeight / 2);

    // draw background
    ctx.fillStyle = `rgba(255, 255, 255, 1)`;
    ctx.fillRect(0, 0, cvsWidth, cvsHeight);

    // draw monster
    if (mouseObj.clicked) {
      const { roomId } = this.props;
      const destination = {
        posX: mouseObj.deltaXfromCenter,
        posY: mouseObj.deltaYfromCenter,
      };
      socket.changeDestination(roomId, destination);
    }

    if (this.props.fieldState) {
      const { monsters } = this.props.fieldState;
      monsters.forEach((monster) => {
        let { posX, posY, size, color } = monster;
        ctx.translate(-size / 2, -size / 2);
        ctx.fillStyle = color;
        ctx.fillRect(posX, posY, size, size);
        ctx.translate(size / 2, size / 2);
      });
    }

    ctx.restore();
  };

  render() {
    return <Canvas draw={this.draw} />;
  }
}
