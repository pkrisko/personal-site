import React, { useEffect, useState, useRef } from 'react';
import p5 from 'p5';

// https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life
// https://p5js.org/examples/simulate-game-of-life.html
const CellularAutomataSketch = ({ containerRef }) => {
  const sketchRef = useRef();
  const [width, setWidth] = useState(containerRef.current.offsetWidth);

  useEffect(() => {
    const sketch = (p) => {
      let w;
      let columns;
      let rows;
      let board;
      let next;

      p.setup = () => {
        p.frameRate(9);
        p.createCanvas(width, 400);
        w = 15;
        columns = p.floor(p.width / w);
        rows = p.floor(p.height / w);

        board = new Array(columns);
        for (let i = 0; i < columns; i++) {
          board[i] = new Array(rows);
        }

        next = new Array(columns);
        for (let i = 0; i < columns; i++) {
          next[i] = new Array(rows);
        }

        init();
      };

      p.draw = () => {
        p.background(255);
        generate();
        for (let i = 0; i < columns; i++) {
          for (let j = 0; j < rows; j++) {
            if (board[i][j] === 1) p.fill(0);
            else p.fill(255);
            p.stroke(0);
            p.rect(i * w, j * w, w - 1, w - 1);
          }
        }
      };

      p.mousePressed = () => {
        init();
      };

      function init() {
        for (let i = 0; i < columns; i++) {
          for (let j = 0; j < rows; j++) {
            if (i === 0 || j === 0 || i === columns - 1 || j === rows - 1) board[i][j] = 0;
            else board[i][j] = p.floor(p.random(2));
            next[i][j] = 0;
          }
        }
      }

      function generate() {

        // Loop through every spot in our 2D array and check spots neighbors
        for (let x = 1; x < columns - 1; x++) {
          for (let y = 1; y < rows - 1; y++) {
            // Add up all the states in a 3x3 surrounding grid
            let neighbors = 0;
            for (let i = -1; i <= 1; i++) {
              for (let j = -1; j <= 1; j++) {
                neighbors += board[x+i][y+j];
              }
            }
      
            // A little trick to subtract the current cell's state since
            // we added it in the above loop
            neighbors -= board[x][y];
            // Rules of Life
            if      ((board[x][y] == 1) && (neighbors <  2)) next[x][y] = 0;           // Loneliness
            else if ((board[x][y] == 1) && (neighbors >  3)) next[x][y] = 0;           // Overpopulation
            else if ((board[x][y] == 0) && (neighbors == 3)) next[x][y] = 1;           // Reproduction
            else                                             next[x][y] = board[x][y]; // Stasis
          }
        }
      
        // Swap!
        let temp = board;
        board = next;
        next = temp;
      }
    };

    const myP5 = new p5(sketch, sketchRef.current);

    return () => {
      myP5.remove();
    };
  }, [width]);

  useEffect(function setWidthOnResize(){
    const handleResize = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.offsetWidth);
      }
    };

    // Create a resize observer
    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => { // Cleanup
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  return <div className="w-full" ref={sketchRef}></div>;
};

export default CellularAutomataSketch;
