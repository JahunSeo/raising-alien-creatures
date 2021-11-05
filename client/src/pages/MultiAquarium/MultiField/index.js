import React, { Component } from "react";
import Canvas from "../../../components/Canvas";

export default class Field extends Component {
  fieldInfo = {
    seed: null,
    posX: null,
    posY: null,
    monsterSize: 100,
  };

  componentDidMount() {
    window.addEventListener("resize", this.resizeEventHandler);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.seed != this.props.seed) {
      let seed = this.props.seed;
      this.stageWidth = window.innerWidth || document.body.clientWidth;
      this.stageHeight = window.innerHeight || document.body.clientHeight;

      this.fieldInfo.seed = seed;
      this.fieldInfo.posX = (this.stageWidth / 2) * (seed - 0.5);
      this.fieldInfo.posY = (this.stageHeight / 2) * (seed - 0.5);
    }
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
      this.fieldInfo.posX = mouseObj.deltaXfromCenter;
      this.fieldInfo.posY = mouseObj.deltaYfromCenter;
    }

    if (this.fieldInfo.seed) {
      let { posX, posY, monsterSize } = this.fieldInfo;
      ctx.translate(-monsterSize / 2, -monsterSize / 2);
      ctx.fillStyle = `rgba(100, 100, 100, 1)`;
      ctx.fillRect(posX, posY, monsterSize, monsterSize);
      ctx.translate(monsterSize / 2, monsterSize / 2);
    }

    ctx.restore();
  };

  render() {
    return <Canvas draw={this.draw} />;
  }
}
