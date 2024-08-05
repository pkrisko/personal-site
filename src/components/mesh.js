import React, { useEffect, useState, useRef } from "react";
import p5 from "p5";

// Based on https://bleuje.com/p5js-myprojects/grid-distortion/index.html

const SpringGridSketch = ({ containerRef, className }) => {
  const sketchRef = useRef();
  const [width, setWidth] = useState(containerRef.current.offsetWidth);

  useEffect(() => {
    const sketch = (p) => {
      const numRows = 20; // Fixed number of rows
      const cellSize = 24; // Approximate size of each cell in pixels
      let numCols;
      let EPS = 0.00000001;

      let array = [];
      let wave = {
        x: 0,
        y: 0,
        vx: 9.0, // Increase from 2 to 2.5 for faster horizontal movement
        vy: 6.0, // Increase from 1 to 1.5 for faster vertical movement
        // intensity: 1.995, // Intensity of the wave
        intensity: 2.2,
        delta: 100, // Spread of the wave's influence
    };    

      class Dot {
        constructor(i, j, sp) {
          this.i = i;  // Index in grid horizontally
          this.j = j;  // Index in grid vertically
          this.vx = 0;
          this.vy = 0;
          this.x = p.map(i, 0, numCols - 1, sp, p.width - sp);
          this.y = p.map(j, 0, numRows - 1, sp, p.height - sp);
          this.x0 = this.x;
          this.y0 = this.y;
        }

        update() {
          // If dot is on the boundary, prevent it from moving
          if (this.i === 0 || this.i === numCols - 1 || this.j === 0 || this.j === numRows - 1) {
            this.vx = 0;
            this.vy = 0;
          } else {
            let res = spring_force(this.x0, this.y0, this.x, this.y, 10.0); // KGrid is 10.0
            this.vx += 0.1 * res.x; // DT is 0.1
            this.vy += 0.1 * res.y;
            this.vx *= 0.98; // Damping
            this.vy *= 0.98;
            this.x += 0.1 * this.vx;
            this.y += 0.1 * this.vy;
          }
        }

        applyWaveForce() {
          if (!(this.i === 0 || this.i === numCols - 1 || this.j === 0 || this.j === numRows - 1)) {
            let d = p.dist(wave.x, wave.y, this.x, this.y);
            let intensity = wave.intensity * Math.exp(-d * d / (wave.delta * wave.delta));
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
        wave.x += wave.vx;
        wave.y += wave.vy;
        if (wave.x <= 0 || wave.x >= p.width) wave.vx *= -1;
        if (wave.y <= 0 || wave.y >= p.height) wave.vy *= -1;
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

        wave.x = p.width / 2;
        wave.y = p.height / 2;
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
  }, [width]);

  useEffect(function resize() {
    const handleResize = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.offsetWidth);
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
          resizeObserver.unobserve(containerRef.current);
      }
    };
  }, [containerRef]);

  return <div className={className} ref={sketchRef}></div>;
};

export default SpringGridSketch;
