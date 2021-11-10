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

    // translate location
    ctx.translate(cvsWidth / 2, cvsHeight / 2);

    // draw background
    ctx.fillStyle = `rgba(255, 255, 255, 1)`;
    ctx.fillRect(0, 0, cvsWidth, cvsHeight);

    // draw monster
    if (this.props.room && this.props.room.fieldState) {
      const room = this.props.room;
      const { monsters } = room.fieldState;
      // TODO: monster들의 순서 (누가 위에 놓일 것인지 여부) 처리 필요
      for (const userId in monsters) {
        let { location, size, color } = monsters[userId];
        let x = room.camera.getCanvasSize(location.x);
        let y = room.camera.getCanvasSize(location.y);
        size = room.camera.getCanvasSize(size);
        ctx.beginPath();
        ctx.arc(x, y, size / 2, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }

      if (mouseObj.clicked) {
        const destination = {
          x: mouseObj.deltaXfromCenter,
          y: mouseObj.deltaYfromCenter,
        };
        socket.changeDestination(room.roomId, destination);
      }
    }

    ctx.restore();
  };

  render() {
    return <Canvas draw={this.draw} />;
  }
}
