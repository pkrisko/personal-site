import Link from 'next/link';
import Grid from '@/components/grid';

const Navigation = () => {
  return (
    <nav className="absolute top-0 left-0 p-6 md:px-24 w-full">
      <ul className="flex justify-between items-center w-full">
        <li>
          <Link className="flex items-center -ml-2" href="/">
            <Grid />
            Patrick Krisko
          </Link>
        </li>
        <li>
          <a href="https://www.linkedin.com/in/pkrisko" className="text-lg">Portfolio</a>
        </li>
        <li>
          <a href="mailto:patrick.krisko@gmail.com" className="text-lg">patrick.krisko@gmail.com</a>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
