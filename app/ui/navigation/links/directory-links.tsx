//links for the club directory
'use client'
import Link from 'next/link';
import { useEffect, useState } from "react";

//list of links to categories
const links = [
  { name: 'Activism', href: '/dashboard/club-directory/activism'},
  { name: 'Arts', href: '/dashboard/club-directory/arts'},
  { name: 'Business', href: '/dashboard/club-directory/business'},
  { name: 'Community Service', href: '/dashboard/club-directory/community-service'},
  { name: 'Culture & Identity', href: '/dashboard/club-directory/culture'},
  { name: 'Hobbies & Games', href: '/dashboard/club-directory/hobbies'},
  { name: 'Honor Societies', href: '/dashboard/club-directory/honor-societies'},
  { name: 'Language', href: '/dashboard/club-directory/language'},
  { name: 'Logic', href: '/dashboard/club-directory/logic'},
  { name: 'Leadership', href: '/dashboard/club-directory/leadership'},
  { name: 'Non-Varsity Sports/Fitness', href: '/dashboard/club-directory/sports-fitness'},
  { name: 'Science & Technology', href: '/dashboard/club-directory/science-tech'},
   { name: 'Social Studies', href: '/dashboard/club-directory/social-studies'},
   { name: 'Miscellaneous', href: '/dashboard/club-directory/miscellaneous'},
];


export const useScreenWidth = (): number | undefined => {
  const [width, setWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    const updateWidth = () => setWidth(window.innerWidth);

    updateWidth(); // Set initial width
    window.addEventListener("resize", updateWidth);

    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return width;
};


export default function NavLinks() {
  const mainLinks = links.slice(0, -2);
  const lastTwoLinks = links.slice(-2); 
  const scrWidth = useScreenWidth();

  return (
    <>
      {/*display each category as a formatted button*/}
      {mainLinks.map((link) => {
        return (
          <Link
            key={link.name}
            href={link.href}
            className='flex items-center mb-[30px] justify-center rounded-md bg-yellow-100 h-[7vh] font-medium text-center hover:bg-yellow-200 md:w-[14vw] lg:text-lg sm:w-[80vw] sm:text-md'
          >
            <p>{link.name}</p>
          </Link>
        );
      })}
      
      
      {/*empty space for first column*/}
      {scrWidth && scrWidth >= 768 && scrWidth < 1100 && <div></div>}

       {/*display last two categories as a formatted button*/}
      {lastTwoLinks.map((link) => {
        return (
          <Link
            key={link.name}
            href={link.href}
            className='flex items-center mb-[30px] justify-center rounded-md bg-yellow-100 h-[7vh] font-medium text-center hover:bg-yellow-200 md:w-[14vw] lg:text-lg sm:w-[80vw] sm:text-md'
          >
            <p>{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}


