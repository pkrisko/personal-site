'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { CopySimple } from '@phosphor-icons/react';

const EMAIL = 'patrick.krisko@gmail.com';
// Rich set — mixed case + symbols gives a more cinematic departure-board feel
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@.-_#!$%&?';
const SCRAMBLE_MS = 700;  // chaos phase
const COPIED_MS = 2000;   // how long "copied to clipboard" lingers
const REVERT_MS = 700;    // scramble-back phase
const FRAME_MS = 60;      // ~16fps — slow enough to read each flap

function randomChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)];
}

// Each char gets a random threshold (0–1) at which it "locks in" during revert.
// This gives an organic sparkle instead of a strict left-to-right wave.
function makeThresholds(length) {
  return Array.from({ length }, () => Math.random());
}

function scrambleToward(target, progress, thresholds) {
  return target
    .split('')
    .map((char, i) => (thresholds[i] <= progress ? char : randomChar()))
    .join('');
}

// --- Sound effects via Web Audio API (no external files) ---

function playScrambleSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const duration = 0.08;
    const buf = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      // White noise decaying quickly — mechanical shuffle
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.02));
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const gain = ctx.createGain();
    gain.gain.value = 0.18;
    src.connect(gain);
    gain.connect(ctx.destination);
    src.start();
    src.onended = () => ctx.close();
  } catch (_) {}
}

function playCopiedSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.06);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
    osc.onended = () => ctx.close();
  } catch (_) {}
}

export default function EmailCopy() {
  const [phase, setPhase] = useState('idle'); // idle | scrambling | copied | reverting
  const [displayText, setDisplayText] = useState(EMAIL);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);
  const activeRef = useRef(false);
  const thresholdsRef = useRef([]);

  const clearTimers = useCallback(() => {
    clearInterval(intervalRef.current);
    clearTimeout(timeoutRef.current);
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const trigger = useCallback(() => {
    if (activeRef.current) return;
    activeRef.current = true;

    navigator.clipboard?.writeText(EMAIL).catch(() => {});
    playScrambleSound();

    setPhase('scrambling');

    // Phase 1: chaos — every character flips randomly each frame
    intervalRef.current = setInterval(() => {
      setDisplayText(EMAIL.split('').map(() => randomChar()).join(''));
    }, FRAME_MS);

    // Phase 2: snap to "copied to clipboard"
    timeoutRef.current = setTimeout(() => {
      clearInterval(intervalRef.current);
      playCopiedSound();
      setPhase('copied');

      // Phase 3: sparkle-revert back to email
      timeoutRef.current = setTimeout(() => {
        setPhase('reverting');
        thresholdsRef.current = makeThresholds(EMAIL.length);
        let progress = 0;
        const steps = REVERT_MS / FRAME_MS;

        intervalRef.current = setInterval(() => {
          progress += 1 / steps;
          if (progress >= 1) {
            clearInterval(intervalRef.current);
            setDisplayText(EMAIL);
            setPhase('idle');
            activeRef.current = false;
          } else {
            setDisplayText(scrambleToward(EMAIL, progress, thresholdsRef.current));
          }
        }, FRAME_MS);
      }, COPIED_MS);
    }, SCRAMBLE_MS);
  }, [clearTimers]);

  const isCopied = phase === 'copied';
  const isActive = phase !== 'idle';

  return (
    <button
      onClick={trigger}
      onMouseEnter={trigger}
      className="font-fantastique text-lg cursor-pointer select-none group text-left bg-transparent border-0 p-0 text-current"
      aria-label="Copy email address"
    >
      {/* Underline lives on this inner span so it only spans the content width */}
      <span className="relative inline-flex items-center gap-1.5 leading-none">
        {isCopied ? (
          <>
            <CopySimple size={18} weight="bold" />
            copied to clipboard
          </>
        ) : (
          displayText
        )}
        <span
          className={`absolute -bottom-0.5 left-0 h-px bg-current transition-[width] duration-300 ${
            isActive ? 'w-full' : 'w-0 group-hover:w-full'
          }`}
        />
      </span>
    </button>
  );
}
