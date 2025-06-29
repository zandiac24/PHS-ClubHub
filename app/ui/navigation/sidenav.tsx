//sidebar navigation
'use client'
import Link from 'next/link';
import NavLinks from '@/app/ui/navigation/links/nav-links';
import ClubHubLogo from '@/app/ui/club-hub-logo';
import { ArrowLeftStartOnRectangleIcon, UserCircleIcon,ArrowRightEndOnRectangleIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation'

export default function SideNav() {
  const router = useRouter()
  //logout if button is clicked
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }
  return (
    <div className="flex h-full flex-col md:px-3 py-0">
      <Link
        className="mb-2 md:mt-1 flex h-40 items-end justify-start md:rounded-md bg-yellow-400 p-4 md:min-h-[90px] "
        href="/dashboard/club-directory"
      >
        <div className="w-32 text-white md:w-40">
          <ClubHubLogo />
        </div>
      </Link>
      {/*Navigation links*/}
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
       {/*Admin panel button*/}
       <Link
            key="adminpanel"
            href="/dashboard/approval"
            className="flex h-[60px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-yellow-100 hover:text-yellow-700 md:flex-none md:justify-start md:p-2 md:px-3"
          >
            <UserCircleIcon className="w-6" />
            <p className="hidden md:block">Admin Panel</p>
          </Link>
       {/*Login button*/}
       <Link
            key="login"
            href="/login"
            className="flex h-[60px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-yellow-100 hover:text-yellow-700 md:flex-none md:justify-start md:p-2 md:px-3"
          >
            <ArrowRightEndOnRectangleIcon className="w-6" />
            <p className="hidden md:block">Sign In</p>
          </Link>
        {/*Logout button*/}
        <button
              onClick={handleLogout}
              className="flex h-[60px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-yellow-100 hover:text-yellow-700 md:flex-none md:justify-start md:p-2 md:px-3"
            >
              <ArrowLeftStartOnRectangleIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
      </div>
    </div>
  );
}
