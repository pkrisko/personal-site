'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { CopySimple } from '@phosphor-icons/react';

const EMAIL = 'patrick.krisko@gmail.com';
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@.-_#!$%&?';
const SCRAMBLE_MS = 700;
const COPIED_MS = 2000;
const REVERT_MS = 700;
const FRAME_MS = 60;

function randomChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)];
}

function makeThresholds(length) {
  return Array.from({ length }, () => Math.random());
}

function scrambleToward(target, progress, thresholds) {
  return target
    .split('')
    .map((char, i) => (thresholds[i] <= progress ? char : randomChar()))
    .join('');
}

// --- Split-flap audio ---

// iOS Safari requires that AudioContext is created AND a sound is scheduled
// within the same synchronous call stack as a trusted user gesture (click/touch).
// Simply creating or resuming the context is not sufficient — you must play
// at least a silent buffer to fully unlock it.
function unlockAudioContext(ctxRef) {
  try {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const ctx = ctxRef.current;
    if (ctx.state === 'suspended') ctx.resume();
    // Schedule a silent 1-sample buffer — required to unlock on iOS
    const silent = ctx.createBuffer(1, 1, ctx.sampleRate);
    const src = ctx.createBufferSource();
    src.buffer = silent;
    src.connect(ctx.destination);
    src.start(0);
  } catch (_) {}
}

function playFlap(ctx, { freq = 3200, volume = 0.22, decayMs = 4 } = {}) {
  if (!ctx || ctx.state !== 'running') return;
  try {
    const len = Math.ceil(ctx.sampleRate * 0.015);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    const decaySamples = ctx.sampleRate * (decayMs / 1000);
    for (let i = 0; i < len; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / decaySamples);
    }
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = freq + (Math.random() - 0.5) * 600;
    filter.Q.value = 1.2;
    const gain = ctx.createGain();
    gain.gain.value = volume;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    src.start();
  } catch (_) {}
}

function playSettle(ctx) {
  playFlap(ctx, { freq: 700, volume: 0.28, decayMs: 10 });
}

export default function EmailCopy() {
  const [phase, setPhase] = useState('idle');
  const [displayText, setDisplayText] = useState(EMAIL);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);
  const activeRef = useRef(false);
  const thresholdsRef = useRef([]);
  const audioCtxRef = useRef(null);

  const clearTimers = useCallback(() => {
    clearInterval(intervalRef.current);
    clearTimeout(timeoutRef.current);
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  // Desktop: unlock on first interaction anywhere on the page so hover works.
  useEffect(() => {
    const onFirstInteraction = () => unlockAudioContext(audioCtxRef);
    document.addEventListener('pointerdown', onFirstInteraction, { once: true });
    return () => document.removeEventListener('pointerdown', onFirstInteraction);
  }, []);

  const trigger = useCallback(() => {
    if (activeRef.current) return;
    activeRef.current = true;

    navigator.clipboard?.writeText(EMAIL).catch(() => {});

    const ctx = audioCtxRef.current;

    setPhase('scrambling');

    intervalRef.current = setInterval(() => {
      setDisplayText(EMAIL.split('').map(() => randomChar()).join(''));
      playFlap(ctx);
    }, FRAME_MS);

    timeoutRef.current = setTimeout(() => {
      clearInterval(intervalRef.current);
      playSettle(ctx);
      setPhase('copied');

      timeoutRef.current = setTimeout(() => {
        setPhase('reverting');
        thresholdsRef.current = makeThresholds(EMAIL.length);
        let progress = 0;
        const steps = REVERT_MS / FRAME_MS;

        intervalRef.current = setInterval(() => {
          progress += 1 / steps;
          if (progress >= 1) {
            clearInterval(intervalRef.current);
            playSettle(ctx);
            setDisplayText(EMAIL);
            setPhase('idle');
            activeRef.current = false;
          } else {
            setDisplayText(scrambleToward(EMAIL, progress, thresholdsRef.current));
            playFlap(ctx, { volume: 0.15 });
          }
        }, FRAME_MS);
      }, COPIED_MS);
    }, SCRAMBLE_MS);
  }, [clearTimers]);

  // Mobile (iOS/Android): click is a trusted gesture — unlock audio here
  // synchronously before trigger() runs, so ctx.state is 'running' in time.
  const handleClick = useCallback(() => {
    unlockAudioContext(audioCtxRef);
    trigger();
  }, [trigger]);

  const isCopied = phase === 'copied';
  const isActive = phase !== 'idle';

  return (
    <button
      onMouseEnter={trigger}
      onClick={handleClick}
      className="font-fantastique text-lg cursor-pointer select-none group text-left bg-transparent border-0 p-0 text-current"
      aria-label="Copy email address"
    >
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
