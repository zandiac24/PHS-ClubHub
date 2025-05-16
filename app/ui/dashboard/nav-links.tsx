import {
  UserGroupIcon,
  HomeIcon,
  PlusIcon,
  ListBulletIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  { name: 'Club Directory', href: '/dashboard/club-directory', icon: ListBulletIcon},
  {
    name: 'Create a Club',
    href: '/dashboard/application',
    icon: PlusIcon,
  },
  { name: 'Join a Club', href: '/dashboard/registration', icon: UserGroupIcon },
];

export default function NavLinks() {
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className="flex h-[60px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-yellow-100 hover:text-yellow-700 md:flex-none md:justify-start md:p-2 md:px-3"
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
