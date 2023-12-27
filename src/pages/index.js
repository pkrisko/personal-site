"use client";

import { useTypingHeadlines } from 'use-typing-headlines';
import Navigation from '@/components/navigation';


export default function Home() {

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
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="font-fantastique text-8xl">{headline1}<br/>{headline2}</h1>
      </div>
    </main>
    </>
  )
}
