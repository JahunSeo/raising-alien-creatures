import React, { Component } from "react";

export default class Canvas extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.mouseObj = {
      mouseX: undefined,
      mouseY: undefined,
      isMouseOverCanvas: false,
      isMouseMoving: false,
      clicked: false,
      clickedFrame: undefined,
    };
  }

  componentDidMount() {
    if (!this._frameId) {
      // initiate properties
      this._cvs = this.canvasRef.current;
      this._ctx = this._cvs.getContext("2d");
      this._frameCnt = 0;
      this._cvs.addEventListener("click", this.clickEventHandler);
      // start loop
      // console.log("start loop");
      this.loop();
    }
    window.addEventListener("resize", this.resizeEventHandler);
    this.resizeEventHandler();
    document.addEventListener("mousemove", this.mousemoveEventHandler);
  }

  componentWillUnmount() {
    // console.log("cancel loop");
    window.cancelAnimationFrame(this._frameId);
    window.removeEventListener("resize", this.resizeEventHandler);
    document.removeEventListener("mousemove", this.mousemoveEventHandler);
    if (this._cvs) {
      this._cvs.removeEventListener("click", this.clickEventHandler);
    }
  }

  resizeEventHandler = (event) => {
    // console.log("canvas, resizeEventHandler");
    this._cvs.width = window.innerWidth || document.body.clientWidth;
    this._cvs.height = window.innerHeight || document.body.clientHeight;
  };

  mousemoveEventHandler = (event) => {
    // console.log("canvas, mousemove");
    this.setMouseLocal(event);
    this.mouseObj.isMouseMoving = true;
  };

  clickEventHandler = (event) => {
    // console.log("canvas, mouse click");
    this.setMouseLocal(event);
    this.mouseObj.clicked = true;
    this.mouseObj.clickedFrame = this._frameCnt;
  };

  resetMouseObj = () => {
    this.mouseObj.isMouseMoving = false;
    this.mouseObj.clicked = false;
    this.mouseObj.clickedFrame = undefined;
  };

  setMouseLocal = (event) => {
    // https://stackoverflow.com/questions/17130395/real-mouse-position-in-canvas
    let rect = this._cvs.getBoundingClientRect();
    let borderWidth = 0; // temp

    let scaleX = this._cvs.width / (rect.width - borderWidth * 2);
    let scaleY = this._cvs.height / (rect.height - borderWidth * 2);

    let mouseX = (event.clientX - (rect.left + borderWidth)) * scaleX;
    let mouseY = (event.clientY - (rect.top + borderWidth)) * scaleY;

    let padding = 10;
    let isMouseOverCanvas =
      mouseX >= padding &&
      mouseX <= this._cvs.width - padding &&
      mouseY >= padding &&
      mouseY <= this._cvs.height - padding;

    this.mouseObj.mouseX = mouseX;
    this.mouseObj.mouseY = mouseY;
    this.mouseObj.isMouseOverCanvas = isMouseOverCanvas;

    return {
      mouseX,
      mouseY,
      isMouseOverCanvas,
    };
  };

  loop = () => {
    this._frameCnt += 1;
    let { draw, isLooped = true } = this.props;
    draw(this._ctx, this._frameCnt, this.mouseObj);
    this.resetMouseObj();
    if (isLooped) {
      this._frameId = window.requestAnimationFrame(this.loop);
    }
  };

  render() {
    let { width = 300, height = 300 } = this.props;
    return (
      <canvas
        ref={this.canvasRef}
        width={width}
        height={height}
        style={{
          display: "block",
          // border: "1px solid black"
        }}
      />
    );
  }
}
