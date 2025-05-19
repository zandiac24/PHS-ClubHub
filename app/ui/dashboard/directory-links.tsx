import Link from 'next/link';


// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Activism', href: '/dashboard/club-directory/activism'},
  { name: 'Arts', href: '/dashboard/club-directory/arts'},
  { name: 'Business', href: '/dashboard/club-directory/business'},
  { name: 'Community Service', href: '/dashboard/club-directory/community'},
  { name: 'Culture & Identity', href: '/dashboard/club-directory/culture'},
  { name: 'Hobbies & Games', href: '/dashboard/club-directory/hobbies'},
  { name: 'Language Arts', href: '/dashboard/club-directory/language-arts'},
  { name: 'Leadership', href: '/dashboard/club-directory/leadership'},
];


export default function NavLinks() {
  return (
    <>
      {links.map((link) => {
        return (
          <Link
            key={link.name}
            href={link.href}
            className='flex items-center mb-[30px] justify-center rounded-md bg-yellow-100 w-[15vw] h-[5vh] text-lg font-medium hover:bg-yellow-200'
          >
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}


