'use client';

import React, { useState, useEffect, useRef } from 'react';

const LINE_HEIGHT = 1.9;
const FOLD_MS = 180;
const UNFOLD_DELAY = 140;
const UNFOLD_MS = 120;

function getCurrentTime() {
  const d = new Date();
  const h = String(d.getHours() % 12 || 12).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  const s = String(d.getSeconds()).padStart(2, '0');
  return [h, m, s];
}

function FlipDigit({ value, fontStyle }) {
  const [current, setCurrent] = useState(value);
  const [next, setNext]       = useState(value);
  const [flipping, setFlipping] = useState(false);
  const flippingRef = useRef(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (value === current || flippingRef.current) return;
    flippingRef.current = true;
    setNext(value);
    setFlipping(true);
    timerRef.current = setTimeout(() => {
      setCurrent(value);
      flippingRef.current = false;
      setFlipping(false);
    }, FOLD_MS + UNFOLD_DELAY + UNFOLD_MS + 50);
  }, [value, current]);

  // fontStyle contains fontSize, fontFamily, etc.
  // Setting them on the container so all internal `em` units
  // are relative to this font size (e.g. 14cqw).
  const container = {
    ...fontStyle,
    lineHeight: String(LINE_HEIGHT),
    position: 'relative',
    display: 'inline-block',
    height: `${LINE_HEIGHT}em`,
    perspective: '500px',
  };

  // Clips: top half = top 50%, bottom half = bottom 50%
  const topClip = {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: '50%',
    overflow: 'hidden',
    backgroundColor: 'white',
  };

  const bottomClip = {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: '50%',
    overflow: 'hidden',
    backgroundColor: 'white',
  };

  // Text inside bottom clip must be pushed up so
  // only the bottom half of the glyph is visible.
  const bottomText = {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    lineHeight: String(LINE_HEIGHT),
  };

  return (
    <span style={container}>
      {/* Invisible spacer — establishes the container's width */}
      <span style={{ visibility: 'hidden' }}>{value}</span>

      {/* ── Static backgrounds ── */}
      {/* Top bg shows NEXT (revealed when top flap folds away) */}
      <span style={topClip}>
        <span>{flipping ? next : current}</span>
      </span>
      {/* Bottom bg shows CURRENT (covered when bottom flap unfolds) */}
      <span style={bottomClip}>
        <span style={bottomText}>{current}</span>
      </span>

      {/* Crease line */}
      <span style={{
        position: 'absolute', top: '50%', left: 0, right: 0,
        height: '1px', backgroundColor: 'rgba(0,0,0,0.12)', zIndex: 5,
      }} />

      {/* ── Animated flaps ── */}
      {flipping && <>
        {/* Top flap: shows current, folds down and away */}
        <span style={{
          ...topClip,
          transformOrigin: 'bottom center',
          animation: `foldDown ${FOLD_MS}ms ease-in forwards`,
          zIndex: 4,
        }}>
          <span>{current}</span>
        </span>

        {/* Bottom flap: shows next, unfolds down from behind */}
        <span style={{
          ...bottomClip,
          transformOrigin: 'top center',
          animation: `unfoldDown ${UNFOLD_MS}ms ease-out ${UNFOLD_DELAY}ms both`,
          zIndex: 4,
        }}>
          <span style={bottomText}>{next}</span>
        </span>
      </>}
    </span>
  );
}

export default function HodinkeeTimeOverlay({ src, title }) {
  const [time, setTime] = useState(null);

  useEffect(() => {
    setTime(getCurrentTime());
    const id = setInterval(() => setTime(getCurrentTime()), 1000);
    return () => clearInterval(id);
  }, []);

  const fontStyle = {
    fontFamily: 'monospace',
    fontSize: '14cqw',
    fontWeight: '300',
    letterSpacing: '0.02em',
    color: '#111',
  };

  const colonStyle = {
    ...fontStyle,
    lineHeight: String(LINE_HEIGHT),
    letterSpacing: 0,
    padding: '0 0.15em',
    display: 'inline-block',
  };

  return (
    <div className="relative w-full h-full">
      <img
        src={src}
        alt={`Screenshots of ${title}`}
        className="w-full h-full object-cover"
      />
      {time && (
        <div style={{
          position: 'absolute',
          top: '30%',
          left: '35%',
          width: '30%',
          backgroundColor: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0',
          containerType: 'inline-size',
        }}>
          <span style={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center' }}>
            <FlipDigit value={time[0]} fontStyle={fontStyle} />
            <span style={colonStyle}>:</span>
            <FlipDigit value={time[1]} fontStyle={fontStyle} />
            <span style={colonStyle}>:</span>
            <FlipDigit value={time[2]} fontStyle={fontStyle} />
          </span>
        </div>
      )}
    </div>
  );
}
