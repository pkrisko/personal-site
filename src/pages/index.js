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
  { ssr: false }
);

const RecursiveTreeSketch = dynamic(
  () => import('@/components/recursiveTreeSketch'),
  { ssr: false }
);

const MeshSketch = dynamic(
  () => import('@/components/mesh'),
  { ssr: false }
);

const FaceModel = dynamic(
  () => import('@/components/FaceModel'),
  { ssr: false }
);

const PipelineSketch = dynamic(
  () => import('@/components/pipelineSketch'),
  { ssr: false }
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
      <main className="max-w-[1400px] flex flex-col lg:mx-auto lg:mt-32" ref={containerRef}>
        {/* Hero — single col on mobile (model on top), two cols on desktop (text left, model right) */}
        <section className="grid grid-cols-1 lg:grid-cols-2">
          {/* Text: second on mobile, left col on desktop */}
          <div className="order-2 lg:order-1 flex flex-col justify-center pb-8 lg:py-0">
            <h1 className="font-sans text-5xl lg:text-8xl min-h-[96px] lg:min-h-[192px]">{headline1}<br/>{headline2}</h1>
            <p className="text-xl mt-6">
              I&apos;m Patrick Krisko, a full-stack software developer with 8+ years of experience in web tech. Most recently
              I was making data go <em>brrr</em> at
              <a href="https://underdogfantasy.com/" target="_blank" className="ml-1">Underdog</a>.
              <br/><br/>
              I love bringing <em>ideas</em> and <em>designs</em> to life.
            </p>
          </div>
          {/* Model: first on mobile (below nav), right col on desktop */}
          <div className="order-1 lg:order-2 pt-20 h-[70vh] lg:pt-0 lg:h-[70vh]">
            <FaceModel />
          </div>
        </section>
        {/* Container with static height to reduce Cumulative Layout Shift */}
        <div className="h-[540px]">
          <RecursiveTreeSketch containerRef={containerRef} />
        </div>
        <div className="h-px w-full bg-white"/>
        <div className="flex justify-center w-full py-6">
          <h3 className="text-3xl w-fit font-fantastique">Works</h3>
        </div>
        <div className="h-px w-full bg-white"/>
        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          <ExperienceBlock
            title="Auto-Accept Odds"
            subTitle="Underdog"
            src="/images/auto-accept-preview.png"
          >
            <p className="text-xl">
              Authored RFC and shipped auto-accept odds changes, letting users opt in to automatic price updates at
              submission. Eliminated the #1 user complaint, drove a <em>2% increase in entry conversion</em>, and
              contributed over $2M in additional annual collected fees.
            </p>
          </ExperienceBlock>
          <ExperienceBlock
            title="Real-Time Pricing Pipeline"
            subTitle="Underdog"
            media={<PipelineSketch />}
          >
            <p className="text-xl">
              Implemented a real-time data pipeline with Kafka (Karafka) consumers to process fantasy and sportsbook
              pricing feeds, enabling the company to generate and manage odds in-house and at scale.
            </p>
          </ExperienceBlock>
          <ExperienceBlock
            title="10:10"
            subTitle="Hodinkee"
            src="https://framerusercontent.com/images/MhiBwbuhgwo1AmTiM5FjGiKdF0.jpg?scale-down-to=1024"
          >
            <p className="text-xl">
              Created a &quot;drop&quot; mechanism, releasing one product (heavily discounted Rolex) per hour, on
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
              <a href="https://mr.randsclass.com/keyboard" target="_blank" className="ml-1">play the keyboard.</a>
            </p>
            <br/>
          </ExperienceBlock>
        </div>
        <div className="mt-6 border border-top border-white w-full flex items-center border-x-0 py-6 justify-center">
          <h3 className="font-fantastique text-2xl">Let&apos;s build something together.</h3>
        </div>
        <div className="-mt-5 -ml-[22px]">
          <MeshSketch containerRef={containerRef} />
        </div>
        <div className="h-96" />
        {/* <CellularAutomotaSketch className="my-40" containerRef={containerRef} /> */}
        <Footer />
      </main>
    </div>
    </>
  )
}
