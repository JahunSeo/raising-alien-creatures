import React, { Component } from "react";
import Canvas from "./Canvas";

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
      room.camera.run();
      let transX = center.x;
      let transY = center.y;
      ctx.translate(cvsWidth / 2 - transX, cvsHeight / 2 - transY);

      let mouseX = mouseObj.deltaXfromCenter + transX;
      let mouseY = mouseObj.deltaYfromCenter + transY;
      let selectedMonster = null;

      // draw central planet
      ctx.beginPath();
      ctx.arc(
        0,
        room.camera.getCanvasPlanetSize(400),
        room.camera.getCanvasPlanetSize(400),
        0,
        Math.PI * 2
      );
      var grd = ctx.createRadialGradient(100, 50, 0, 90, 60, 1000);
      grd.addColorStop(0, "#f0c0ff");
      grd.addColorStop(0.25, "#9048f0");
      grd.addColorStop(0.5, "#6018c0");
      grd.addColorStop(1, "black");
      ctx.fillStyle = grd;
      ctx.fill();

      // draw monster
      // TODO: monster들의 순서 (누가 위에 놓일 것인지 여부) 처리 필요
      for (const monId in monsters) {
        let { location, size } = monsters[monId];
        let x = room.camera.getCanvasSize(location.x);
        let y = room.camera.getCanvasSize(location.y);
        size = room.camera.getCanvasSize(size) / 2;
        // if (isUserOnRoom) console.log(x, y);
        if (
          mouseObj.clicked &&
          !selectedMonster &&
          (x - mouseX) ** 2 + (y - mouseY) ** 2 < size ** 2
        ) {
          // console.log(monId);
          selectedMonster = monId;
          this.props.handleSelectAlien(monsters[monId]);
        }

        monsters[monId].display(ctx, frameCnt, room);

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
