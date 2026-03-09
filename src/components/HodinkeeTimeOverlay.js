'use client';

import React, { useState, useEffect } from 'react';

function getCurrentTime() {
  const d = new Date();
  const h = String(d.getHours() % 12 || 12).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  const s = String(d.getSeconds()).padStart(2, '0');
  return [h, m, s];
}

export default function HodinkeeTimeOverlay({ src, title }) {
  const [time, setTime] = useState('');

  useEffect(() => {
    setTime(getCurrentTime());
    const id = setInterval(() => setTime(getCurrentTime()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative w-full h-full">
      <img
        src={src}
        alt={`Screenshots of ${title}`}
        className="w-full h-full object-cover"
      />
      {time && (
        <div
          style={{
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
          }}
        >
          {time && (() => {
            const numStyle = {
              fontFamily: 'monospace',
              fontSize: '14cqw',
              fontWeight: '300',
              letterSpacing: '0.02em',
              lineHeight: '1.9',
              color: '#111',
            };
            const colonStyle = {
              ...numStyle,
              letterSpacing: 0,
              padding: '0 0.15em',
            };
            return (
              <span style={{ whiteSpace: 'nowrap' }}>
                <span style={numStyle}>{time[0]}</span>
                <span style={colonStyle}>:</span>
                <span style={numStyle}>{time[1]}</span>
                <span style={colonStyle}>:</span>
                <span style={numStyle}>{time[2]}</span>
              </span>
            );
          })()}
        </div>
      )}
    </div>
  );
}
