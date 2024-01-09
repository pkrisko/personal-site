import React from 'react';
import { Horse, GithubLogo } from '@phosphor-icons/react';

const Footer = () => (
  <div className="mt-4">
    This site was built with Next.js.
    <br />
    <div className="flex items-center">
      <GithubLogo size={24} /><span className="line-through mr-1">Steal my code</span> see how this site was made.
    </div>
    <br />
    &#169; Patrick Krisko.
  </div>
);

export default Footer;
