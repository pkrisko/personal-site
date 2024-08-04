import React, { useEffect, useState, useRef } from 'react';
import p5 from 'p5';

const SpringGridSketch = ({ containerRef, className }) => {
  const sketchRef = useRef();
  const [width, setWidth] = useState(containerRef.current.offsetWidth);

  useEffect(() => {
    const sketch = (p) => {
      const numRows = 25; // Fixed number of rows
      const cellSize = 20; // Approximate size of each cell in pixels
      let numCols;
      let EPS = 0.00000001;

      let array = [];
      
      class Dot {
        constructor(i, j, sp) {
          this.vx = 0;
          this.vy = 0;
          this.x = p.map(i, 0, numCols - 1, sp, p.width - sp);
          this.y = p.map(j, 0, numRows - 1, sp, p.height - sp);
          this.x0 = this.x;
          this.y0 = this.y;
        }

        update() {
          let d = p.dist(p.mouseX, p.mouseY, this.x, this.y);
          let delta = sDelta.value();
          let intensity = sKClick.value() * Math.exp(-d * d / (delta * delta));
          let res = p.createVector(0, 0);

          if (p.mouseIsPressed) {
            res.add(spring_force(p.mouseX, p.mouseY, this.x, this.y, intensity));
          }
          res.add(spring_force(this.x0, this.y0, this.x, this.y, sKGrid.value()));

          this.vx += sDT.value() * res.x;
          this.vy += sDT.value() * res.y;

          this.vx *= sDAMPING.value();
          this.vy *= sDAMPING.value();

          this.x += sDT.value() * this.vx;
          this.y += sDT.value() * this.vy;
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

      let sDT, sDAMPING, sDelta, sKGrid, sKClick;

      p.setup = () => {
        p.createCanvas(width, numRows * cellSize); // Set canvas height to fit 15 rows
        p.background(0);

        // Calculate the number of columns and spacing to maintain square cells
        numCols = Math.floor(p.width / cellSize);
        let sp = cellSize; // Use cellSize for spacing to ensure square cells

        // Create sliders
        sDT = p.createSlider(0.01, 0.4, 0.1, 0.01);
        sDAMPING = p.createSlider(0.8, 1.0, 0.95, 0.01);
        sDelta = p.createSlider(5, 100, 40, 1);
        sKGrid = p.createSlider(2, 25, 10.0, 0.1);
        sKClick = p.createSlider(2, 25, 15.0, 0.1);

        // Initialize the grid
        for (let i = 0; i < numCols; i++) {
          array[i] = [];
          for (let j = 0; j < numRows; j++) {
            array[i][j] = new Dot(i, j, sp);
          }
        }
      };

      p.draw = () => {
        p.background(0);

        for (let i = 0; i < numCols; i++) {
          for (let j = 0; j < numRows; j++) {
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

        // Draw connections on the last column and row
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
