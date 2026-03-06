import Link from 'next/link';
import dynamic from 'next/dynamic';
import EmailCopy from '@/components/EmailCopy';

const Globe = dynamic(() => import('@/components/globe'), { ssr: false });

const Navigation = () => {
  return (
    <nav className="absolute top-0 left-0 p-6 w-full 2xl:max-w-[1400px] 2xl:left-1/2 2xl:p-0 2xl:transform 2xl:-translate-x-1/2 2xl:pt-6">
      <ul className="flex justify-between items-center">
        <li className="w-12 h-12 lg:w-16 lg:h-16 shrink-0">
          <Globe />
        </li>
        {/* <li>
          <a href="https://www.linkedin.com/in/pkrisko" className="text-lg">Portfolio</a>
        </li> */}
        <li className="max-w-1/2">
          <EmailCopy />
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
