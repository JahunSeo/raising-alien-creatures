import React, { Component } from "react";
import Canvas from "../../../components/Canvas";

// import * as socket from "../../../apis/socket";

export default class Field extends Component {
  BG_COLORSET = {
    sunset: [
      // https://www.color-hex.com/color-palette/40131
      `rgba(238,175,97,1)`,
      `rgba(251,144,98,1)`,
      `rgba(238,93,108,1)`,
      `rgba(206,73,147,1)`,
    ],
    space: [
      // https://www.color-hex.com/color-palette/35848
      `rgba(5,55,123,1)`,
      `rgba(4,44,98,1)`,
      `rgba(3,33,74,1)`,
      `rgba(1,11,25,1)`,
    ],
  };

  draw = (ctx, frameCnt, mouseObj) => {
    // console.log(mouseObj);
    let cvsWidth = ctx.canvas.width;
    let cvsHeight = ctx.canvas.height;
    ctx.save();
    ctx.clearRect(0, 0, cvsWidth, cvsHeight);

    if (this.props.room && this.props.room.fieldState) {
      const room = this.props.room;
      const { monsters } = room.fieldState;
      // console.log(111, this.props.room.usersOnRoom);

      // draw background
      let lingrad = ctx.createLinearGradient(0, 0, 0, cvsHeight);
      let colorset = this.BG_COLORSET["space"];
      let pcts = room.camera.getGradientPct();
      lingrad.addColorStop(0, colorset[0]);
      lingrad.addColorStop(pcts[0], colorset[1]);
      lingrad.addColorStop(pcts[1], colorset[2]);
      lingrad.addColorStop(1, colorset[3]);
      ctx.fillStyle = lingrad;
      ctx.fillRect(0, 0, cvsWidth, cvsHeight);

      // translate location
      const { center } = room.camera;
      const { selectedAlien } = this.props;
      if (!!selectedAlien && !!(selectedAlien in monsters)) {
        let { location } = monsters[selectedAlien];
        let x = room.camera.getCanvasSize(location.x);
        let y = room.camera.getCanvasSize(location.y);
        ctx.translate(cvsWidth / 2 - x, cvsHeight / 2 - y);
      } else {
        ctx.translate(cvsWidth / 2 - center.x, cvsHeight / 2 - center.y);
      }

      // room.camera.center.x++;

      // draw monster
      // TODO: monster들의 순서 (누가 위에 놓일 것인지 여부) 처리 필요
      for (const monId in monsters) {
        let { location, size, color, isUserOnRoom } = monsters[monId];
        let x = room.camera.getCanvasSize(location.x);
        let y = room.camera.getCanvasSize(location.y);
        size = room.camera.getCanvasSize(size);

        ctx.beginPath();
        ctx.arc(x, y, size / 2, 0, Math.PI * 2);
        ctx.fillStyle = color;
        if (isUserOnRoom && frameCnt % 100 <= 40) {
          ctx.fillStyle = "tomato";
        }
        ctx.fill();

        // if (isUserOnRoom) {
        //   ctx.beginPath();
        //   ctx.arc(x, y, 8, 0, Math.PI * 2);
        //   ctx.fillStyle = "tomato";
        //   ctx.fill();
        // }
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
