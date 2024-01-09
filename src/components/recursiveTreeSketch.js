import React, { useEffect, useRef } from 'react';
import p5 from 'p5';

const RecursiveTreeSketch = ({ containerRef }) => {
  const sketchRef = useRef();

  useEffect(() => {
    const sketch = (p) => {
      let theta;

      p.setup = () => {
        p.createCanvas(containerRef.current.offsetWidth, 500);
      };

      p.draw = () => {
        p.background(0);
        p.frameRate(30);
        p.stroke(255);

        // Use window.scrollY for vertical scroll position
        let scrollPos = window.scrollY;

        // Map scroll position to an angle between 0 and 90 degrees
        // Adjust the mapping as per the height of your page
        let a = p.map(scrollPos, 0, 500, 0, 75);
        theta = p.radians(a);

        p.translate(p.width / 2, p.height);
        const relTreeHeight = 160;
        p.line(0, 0, 0, -relTreeHeight);
        p.translate(0, -relTreeHeight);
        branch(relTreeHeight);

        function branch(h) {
          h *= 0.66;

          if (h > 2) {
            p.push();
            p.rotate(theta);
            p.line(0, 0, 0, -h);
            p.translate(0, -h);
            branch(h);
            p.pop();

            p.push();
            p.rotate(-theta);
            p.line(0, 0, 0, -h);
            p.translate(0, -h);
            branch(h);
            p.pop();
          }
        }
      };
    };

    const myP5 = new p5(sketch, sketchRef.current);

    return () => {
      myP5.remove();
    };
  }, []);

  return <div className="mx-auto mt-10" ref={sketchRef}></div>;
};

export default RecursiveTreeSketch;
