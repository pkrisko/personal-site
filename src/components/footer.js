import React from 'react';
import { Copyright, GithubLogo, LinkedinLogo } from '@phosphor-icons/react';

const Footer = () => (
  <div className="mt-4">
    <div className="flex items-center">
      <Copyright size={20} className="mr-1" /> 2024 Patrick Krisko.
    </div>
    <div className="flex items-center mt-1">
      <LinkedinLogo size={20} className="mr-1" />
      Slide into my
      <a href="https://www.linkedin.com/in/pkrisko/" className="ml-1">
        LinkedIn DMs.
      </a>
    </div>
    <div className="flex items-center mt-1">
      <GithubLogo size={20} weight="fill" className="mr-1" />
      <a href="https://github.com/pkrisko/personal-site" className="mr-1">
        <em>Yoink</em> the code
      </a>
      for this site. Starring and following appreciated!
    </div>
  </div>
);

export default Footer;
