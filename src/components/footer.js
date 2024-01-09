import React from 'react';
import { Copyright, GithubLogo, LinkedinLogo } from '@phosphor-icons/react';

const Footer = () => (
  <div className="mt-4">
    <div className="flex items-center">
      <Copyright size={20} className="mr-1" /> 2024 Patrick Krisko.
    </div>
    <div className="flex items-center mt-1">
      <LinkedinLogo size={20} className="mr-1" /> 
      <a href="https://www.linkedin.com/in/pkrisko/">
        Slide into my LinkedIn DMs.
      </a>
    </div>
    <div className="flex items-center mt-1">
      <GithubLogo size={20} weight="fill" className="mr-1" />
      <a href="https://github.com/pkrisko/personal-site" className="mr-1">
        <em>Yoink</em> the code for this site.
      </a>
      Starring and following appreciated.
    </div>
  </div>
);

export default Footer;
