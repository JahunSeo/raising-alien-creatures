import React, { Component } from "react";
import Canvas from "../../../components/Canvas";

// import * as socket from "../../../apis/socket";

export default class Field extends Component {
  draw = (ctx, frameCnt, mouseObj) => {
    // console.log(mouseObj);
    let cvsWidth = ctx.canvas.width;
    let cvsHeight = ctx.canvas.height;
    ctx.save();
    ctx.clearRect(0, 0, cvsWidth, cvsHeight);

    if (this.props.room && this.props.room.fieldState) {
      const room = this.props.room;
      const { monsters } = room.fieldState;

      // draw background
      // ctx.fillStyle = `rgba(255, 255, 255, 1)`;
      ctx.fillStyle = `rgba(3, 33, 74, 1)`;
      ctx.fillRect(0, 0, cvsWidth, cvsHeight);

      // translate location
      const { center } = room.camera;
      ctx.translate(cvsWidth / 2 - center.x, cvsHeight / 2 - center.y);
      // room.camera.center.x++;

      // draw monster
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
        // let destination = {
        //   x: mouseObj.deltaXfromCenter,
        //   y: mouseObj.deltaYfromCenter,
        // };
        // destination = room.camera.getLocalFromMouse(destination);
        // socket.changeDestination(room.roomId, destination);
      }
    }

    ctx.restore();
  };

  render() {
    if (this.props.room) {
      const camera = this.props.room.camera;
      return (
        <Canvas
          draw={this.draw}
          onMouseDown={camera.onMouseDown}
          onMouseMove={camera.onMouseMove}
          onMouseUp={camera.onMouseUp}
          onTouchStart={camera.onTouchStart}
          onTouchMove={camera.onTouchMove}
          onTouchEnd={camera.onTouchEnd}
          onWheel={camera.onWheel}
          onResize={camera.onResize}
        />
      );
    } else {
      return <div>로딩중...</div>;
    }
  }
}
