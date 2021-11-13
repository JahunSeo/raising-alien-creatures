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
      // to pan and zoom map
      // https://codepen.io/chengarda/pen/wRxoyB?editors=0110
      this._cvs.addEventListener("mousedown", this.onMouseDown);
      window.addEventListener("mousemove", this.onMouseMove);
      window.addEventListener("mouseup", this.onMouseUp);

      this._cvs.addEventListener("touchstart", this.onTouchStart);
      window.addEventListener("touchmove", this.onTouchMove);
      window.addEventListener("touchend", this.onTouchEnd);
      this._cvs.addEventListener("wheel", this.onWheel);

      // start loop
      // console.log("start loop");
      this.loop();
    }
    window.addEventListener("resize", this.onResize);
    this.onResize();
  }

  componentWillUnmount() {
    // console.log("cancel loop");
    window.cancelAnimationFrame(this._frameId);
    window.removeEventListener("resize", this.onResize);
    if (this._cvs) {
      this._cvs.removeEventListener("mousedown", this.onMouseDown);
      window.removeEventListener("mousemove", this.onMouseMove);
      window.removeEventListener("mouseup", this.onMouseUp);

      this._cvs.removeEventListener("touchstart", this.onTouchStart);
      window.removeEventListener("touchmove", this.onTouchMove);
      window.removeEventListener("touchend", this.onTouchEnd);

      this._cvs.removeEventListener("wheel", this.onWheel);
    }
  }

  onResize = (event) => {
    // console.log("canvas, onResize");
    this._cvs.width = window.innerWidth || document.body.clientWidth;
    this._cvs.height = window.innerHeight || document.body.clientHeight;
    if (this.props.onResize)
      this.props.onResize(this._cvs.width, this._cvs.height);
  };

  onMouseDown = (e) => {
    this.mouseObj.clicked = true;
    this.mouseObj.clickedFrame = this._frameCnt;
    if (this.props.onMouseDown) this.props.onMouseDown(e);
  };

  onMouseUp = (e) => {
    if (this.props.onMouseUp) this.props.onMouseUp(e);
  };

  onMouseMove = (e) => {
    this.setMouseLocal(e);
    this.mouseObj.isMouseMoving = true;
    if (this.props.onMouseMove) this.props.onMouseMove(e);
  };

  onTouchStart = (e) => {
    if (this.props.onTouchStart) this.props.onTouchStart(e);
  };

  onTouchEnd = (e) => {
    if (this.props.onTouchEnd) this.props.onTouchEnd(e);
  };

  onTouchMove = (e) => {
    if (this.props.onTouchMove) this.props.onTouchMove(e);
  };

  onWheel = (e) => {
    if (this.props.onWheel) this.props.onWheel(e);
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

    this.mouseObj.deltaXfromCenter = mouseX - this._cvs.width / 2;
    this.mouseObj.deltaYfromCenter = mouseY - this._cvs.height / 2;

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
