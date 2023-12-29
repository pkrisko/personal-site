import Link from 'next/link';
import Globe from '@/components/globe';

const Navigation = () => {
  return (
    <nav className="absolute top-0 left-0 p-6 w-full 2xl:max-w-[1400px] 2xl:left-1/2 2xl:p-0 2xl:transform 2xl:-translate-x-1/2 2xl:pt-6">
      <ul className="flex justify-between items-center">
        <li className="break-word">
          <Link className="flex items-center -ml-2" href="/">
            <Globe />
            Patrick Krisko
          </Link>
        </li>
        <li>
          <a href="https://www.linkedin.com/in/pkrisko" className="text-lg">Portfolio</a>
        </li>
        <li className="max-w-[33.33%] break-all">
          <a href="mailto:patrick.krisko@gmail.com" className="text-lg">patrick.krisko@gmail.com</a>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
