import React, { useEffect, useState, useRef } from "react";
import p5 from "p5";

const widthAdjustment = 44;

// Based on https://bleuje.com/p5js-myprojects/grid-distortion/sketch.js

const SpringGridSketch = ({ containerRef, className }) => {
  const sketchRef = useRef();
  const [width, setWidth] = useState(
    containerRef.current.offsetWidth + widthAdjustment
  );
  const [tiltMode, setTiltMode] = useState(false);

  let wave = {
    x: 0,
    y: 0,
    tiltX: 0,
    tiltY: 0,
    angle: 0, // Initial angle
    angularVelocity: 0.005, // Rate of change of the angle
    amplitude: 9.0, // Amplitude of the wave's velocity
    intensity: 3.2,
    delta: 70, // Spread of the wave's influence
  };

  useEffect(() => {
    const sketch = (p) => {
      const numRows = 20; // Fixed number of rows
      const cellSize = 24; // Approximate size of each cell in pixels
      let numCols;
      let EPS = 0.00000001;

      let array = [];

      class Dot {
        constructor(i, j, sp) {
          this.i = i; // Index in grid horizontally
          this.j = j; // Index in grid vertically
          this.vx = 0;
          this.vy = 0;
          this.x = p.map(i, 0, numCols - 1, sp, p.width - sp);
          this.y = p.map(j, 0, numRows - 1, sp, p.height - sp);
          this.x0 = this.x;
          this.y0 = this.y;
        }

        update() {
          // If dot is on the boundary, prevent it from moving
          if (
            this.i === 0 ||
            this.i === numCols - 1 ||
            this.j === 0 ||
            this.j === numRows - 1
          ) {
            this.vx = 0;
            this.vy = 0;
          } else {
            let res = spring_force(this.x0, this.y0, this.x, this.y, 10.0); // KGrid is 10.0
            this.vx += 0.075 * res.x; // DT is 0.1
            this.vy += 0.075 * res.y;
            this.vx *= 0.98; // Damping
            this.vy *= 0.98;
            this.x += 0.1 * this.vx;
            this.y += 0.1 * this.vy;

            // Apply tilt effect if tilt mode is enabled
            if (tiltMode) {
              this.vx += wave.tiltX * 0.05;
              this.vy += wave.tiltY * 0.05;
            }
          }
        }

        applyWaveForce() {
          if (
            !(
              this.i === 0 ||
              this.i === numCols - 1 ||
              this.j === 0 ||
              this.j === numRows - 1
            )
          ) {
            let d = p.dist(wave.x, wave.y, this.x, this.y);
            let intensity =
              wave.intensity * Math.exp(-(d * d) / (wave.delta * wave.delta));
            let res = spring_force(wave.x, wave.y, this.x, this.y, intensity);
            this.vx += 0.1 * res.x;
            this.vy += 0.1 * res.y;
          }
        }
      }

      function spring_force(ax, ay, bx, by, k) {
        let xx = ax - bx;
        let yy = ay - by;
        let d = p.dist(xx, yy, 0, 0);
        let nx = xx / (d + EPS);
        let ny = yy / (d + EPS);
        let f = k * d;
        let fx = f * nx;
        let fy = f * ny;
        return p.createVector(fx, fy);
      }

      function updateWave() {
        wave.angle += wave.angularVelocity;
        wave.x += wave.amplitude * Math.cos(wave.angle);
        wave.y += wave.amplitude * Math.sin(wave.angle);
        if (wave.x <= 0 || wave.x >= p.width) wave.angle = Math.PI - wave.angle;
        if (wave.y <= 0 || wave.y >= p.height) wave.angle = -wave.angle;
      }

      p.setup = () => {
        p.createCanvas(width, numRows * cellSize);
        p.background(0);

        numCols = Math.floor(p.width / cellSize);
        let sp = cellSize;

        for (let i = 0; i < numCols; i++) {
          array[i] = [];
          for (let j = 0; j < numRows; j++) {
            array[i][j] = new Dot(i, j, sp);
          }
        }

        wave.x = p.random(0, p.width);
        wave.y = p.random(0, p.height);

        // Add event listener for device orientation if tilt mode is enabled
        if (tiltMode && "DeviceOrientationEvent" in window) {
          window.addEventListener("deviceorientation", handleTilt);
        }
      };

      p.draw = () => {
        p.background(0);
        updateWave();

        for (let i = 0; i < numCols; i++) {
          for (let j = 0; j < numRows; j++) {
            array[i][j].applyWaveForce();
            array[i][j].update();
          }
        }

        for (let i = 0; i < numCols - 1; i++) {
          for (let j = 0; j < numRows - 1; j++) {
            let d1 = array[i][j];
            let d2 = array[i + 1][j];
            let d3 = array[i][j + 1];
            draw_connection(d1, d2);
            draw_connection(d1, d3);
          }
        }

        for (let i = 0; i < numCols - 1; i++) {
          let d1 = array[i][numRows - 1];
          let d2 = array[i + 1][numRows - 1];
          draw_connection(d1, d2);
        }

        for (let j = 0; j < numRows - 1; j++) {
          let d1 = array[numCols - 1][j];
          let d3 = array[numCols - 1][j + 1];
          draw_connection(d1, d3);
        }
      };

      function draw_connection(d1, d2) {
        p.stroke(255, 125);
        p.strokeWeight(2);
        p.line(d1.x, d1.y, d2.x, d2.y);
      }
    };

    const myP5 = new p5(sketch, sketchRef.current);

    return () => {
      myP5.remove();
    };
  }, [width, tiltMode]);

  useEffect(() => {
    // Request permission for device orientation on iOS 13+ devices
    const requestPermission = async () => {
      if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function"
      ) {
        const response = await DeviceOrientationEvent.requestPermission();
        return response === "granted";
      }
      return true;
    };

    // Handler to enable or disable tilt mode
    const handleTiltModeChange = async () => {
      if (tiltMode) {
        const permissionGranted = await requestPermission();
        if (permissionGranted) {
          window.addEventListener("deviceorientation", handleTilt);
        } else {
          alert("Tilt controls not enabled.");
          setTiltMode(false);
        }
      } else {
        window.removeEventListener("deviceorientation", handleTilt);
        wave.tiltX = 0;
        wave.tiltY = 0;
      }
    };

    handleTiltModeChange();

    return () => {
      window.removeEventListener("deviceorientation", handleTilt);
    };
  }, [tiltMode]);

  const handleTilt = (event) => {
    console.log("wave", wave)
    wave.tiltX = event.gamma / 2;
    wave.tiltY = event.beta / 2;
  };

  return (
    <div>
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          id="tiltMode"
          checked={tiltMode}
          onChange={() => setTiltMode(!tiltMode)}
          className="mr-2"
        />
        <label htmlFor="tiltMode" className="text-white">
          Tilt Mode
        </label>
      </div>
      <div className={className} ref={sketchRef}></div>
    </div>
  );
};

export default SpringGridSketch;
