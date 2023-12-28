"use client";

import React, { useRef } from 'react';
import { useTypingHeadlines } from 'use-typing-headlines';
import Navigation from '@/components/navigation';
import dynamic from 'next/dynamic';

const CellularAutomotaSketch = dynamic(
  () => import('@/components/sketch'),
  { ssr: false }  // Disable server-side rendering so p5 can use window object
);


export default function Home() {
  const containerRef = useRef(null);

  const [headline1] = useTypingHeadlines([
    'Full-stack',
    'React.js',
    'Technical',
  ]);

  const [headline2] = useTypingHeadlines([
    'developer',
    'extraordinaire',
    'lead',
  ]);

  return (
    <>
    <Navigation />
    <main className="flex min-h-screen flex-col items-start justify-between p-6 md:px-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex mt-20" ref={containerRef}>
        <h1 className="font-fantastique text-5xl lg:text-8xl h-[192px]">{headline1}<br/>{headline2}</h1>
      </div>
      <CellularAutomotaSketch containerRef={containerRef} />
    </main>
    </>
  )
}
