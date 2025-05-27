//links for the club directory
import Link from 'next/link';

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

export default function NavLinks() {
  return (
    <>
      {/*Display each category as a formatted button*/}
      {links.map((link) => {
        return (
          <Link
            key={link.name}
            href={link.href}
            className='flex items-center mb-[30px] justify-center rounded-md bg-yellow-100 w-[18vw] h-[10vh] text-xl font-medium hover:bg-yellow-200'
          >
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}


