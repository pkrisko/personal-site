import React from 'react'
import Head from 'next/head'

const CustomHead = ({
    title = 'Patrick Krisko',
    description = 'Patrick Krisko is a full-stack software developer with 7+ years of experience in web tech. He is especially skiled in React.js among other JavaScript technologies.',
    imageSrc = '/images/site-preview.gif',
    pageUrl = 'https://www.pkrisko.com',
  }) => (
  <Head>
    {/* Basic HTML Meta Tags */}
    <title>{title}</title>
    <meta name="description" content={description} />

    {/* Open Graph / Facebook Meta Tags */}
    <meta property="og:type" content="website" />
    <meta property="og:url" content={pageUrl} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={imageSrc} />

    {/* Twitter Card Meta Tags */}
    <meta name="twitter:card" content="summary_large_image" key="twcard" />
    <meta property="twitter:domain" content={pageUrl} />
    <meta property="twitter:url" content={pageUrl} />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={imageSrc} />
    <meta name="twitter:creator" content="@patrickkrisko" key="twhandle" />

    {/* Favicon */}
    <link rel="apple-touch-icon" sizes="180x180" href="/images/favicon/apple-touch-icon.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon/favicon-16x16.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <link rel="icon" href="/images/favicon/favicon.ico" />
  </Head>
)

export default CustomHead;
