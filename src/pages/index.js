"use client";

import React, { useRef } from 'react';
import { useTypingHeadlines } from 'use-typing-headlines';
import CustomHead from '@/components/customHead';
import Navigation from '@/components/navigation';
import ExperienceBlock from '@/components/experienceBlock';
import Footer from '@/components/footer';
import dynamic from 'next/dynamic';

const CellularAutomotaSketch = dynamic(
  () => import('@/components/sketch'),
  { ssr: false }  // Disable server-side rendering so p5 can use window object
);

const RecursiveTreeSketch = dynamic(
  () => import('@/components/recursiveTreeSketch'),
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
    'lead.',
  ]);

  return (
    <>
    <CustomHead />
    <Navigation />
    <div className="p-6">
      <main className="flex min-h-screen max-w-[1400px] flex-col items-start justify-between lg:mx-auto" ref={containerRef}>
        <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex mt-20 mb-10">
          <h1 className="font-sans text-5xl lg:text-8xl h-24 lg:h-[192px]">{headline1}<br/>{headline2}</h1>
        </div>
        <p className="lg:w-[42%] self-start py-2 lg:py-0 text-xl">
          I&apos;m Patrick Krisko, a full-stack software developer with 6+ years of experience in web tech. I&apos;m
          currently making pixels go <em>brrr</em> at
          <a href="https://www.hodinkee.com/" target="_blank" className="ml-1">Hodinkee</a>.
          <br/><br/>
          I love bringing <em>ideas</em> and <em>designs</em> to life. 
        </p>
        <RecursiveTreeSketch containerRef={containerRef} />
        <div className="h-px w-full bg-white"/>
        <div className="flex justify-center w-full py-6">
          <h3 className="text-3xl w-fit">Works</h3>
        </div>
        <div className="h-px w-full bg-white"/>
        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          <ExperienceBlock
            title="10:10"
            subTitle="Hodinkee"
            src="https://framerusercontent.com/images/MhiBwbuhgwo1AmTiM5FjGiKdF0.jpg?scale-down-to=1024"
          >
            <p className="text-xl">
              Created a &quot;drop&quot; mechanism, realeasing one product (heavily discounted Rolex) per hour, on
              the hour, for 10 hours. Idea to launch in 12 days, and <em>built in only 4</em>. No bots were successful and there were no repeat
              customers. This initiative set 24h revenue records for the company.
              <br />
              <a href="https://www.alexmakesthings.co/work/hodinkee-10-10" target="_blank">Learn more.</a>
            </p>
          </ExperienceBlock>
          <ExperienceBlock
            title="Brand Landing Pages"
            subTitle="Hodinkee"
            src="/images/blp-preview.png"
          >
            <p className="text-xl">
              Two words: content + commerce. Architected and implemented reusable Shopify product collection landing
              pages. Data merchandized and queried entirely through Algolia. Led to an increase in qualified sessions
              and SEO organic traffic.
            <br />
            <a href="https://shop.hodinkee.com/collections/cartier-brand" target="_blank">See an example.</a>
            </p>
          </ExperienceBlock>
          <ExperienceBlock
            title="Lume Design System"
            subTitle="Hodinkee"
            src="https://framerusercontent.com/images/IFp34lI2q6bDiXX2IU67YvfdLo.jpg?scale-down-to=1024"
          >
            <p className="text-xl">
            Implemented a tailwind based reusable component design system. Has an optional, additional library with
            React component bindings. Effectively used across a variety of projects despite unusual technical
            constraints.
            <br />
            <a href="https://www.alexmakesthings.co/work/lume-design-system" target="_blank">Learn more.</a>
            </p>
          </ExperienceBlock>
          <ExperienceBlock
            title="Peril Prediction"
            subTitle="Asurion"
            src="/images/peril-preview.png"
          >
            <p className="text-xl">
              NLP Machine Learning service to predict damage(s) to a phone given a description of what happened. This
              resulted in a higher repair success rates, and saved 43s average per claim compared to multi-step form
              questionnaire.
            </p>
          </ExperienceBlock>
          <ExperienceBlock
            title="Mr. Rand's Class"
            subTitle="Explore! Community School"
            src="/images/mr-rands-preview.png"
          >
            <p className="text-xl">
              Created a small Next.js application to help a friend teach his music classroom remotely during 2020. Has
              ability for teachers to create quizzes, manage grades. Students can take quizzes on music notes and
              <a href="https://mr.randsclass.com/keyboard" className="ml-1">play the keyboard.</a>
            </p>
            <br/>
          </ExperienceBlock>
        </div>
        {/* <CellularAutomotaSketch containerRef={containerRef} /> */}
        <div className="h-40" />
        <Footer />
      </main>
    </div>
    </>
  )
}
