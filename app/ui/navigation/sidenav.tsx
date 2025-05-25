'use client'
import Link from 'next/link';
import NavLinks from '@/app/ui/navigation/links/nav-links';
import ClubHubLogo from '@/app/ui/club-hub-logo';
import { ArrowLeftStartOnRectangleIcon, ArrowRightEndOnRectangleIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation'

export default function SideNav() {
  const router = useRouter()
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
    <div className="flex h-full flex-col px-3 py-0 md:px-2">
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-yellow-400 p-4 md:h-40"
        href="/dashboard/club-directory"
      >
        <div className="w-32 text-white md:w-40">
          <ClubHubLogo />
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
       <Link
            key="login"
            href="/login"
            className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-yellow-100 hover:text-yellow-700 md:flex-none md:justify-start md:p-2 md:px-3"
          >
            <ArrowRightEndOnRectangleIcon className="w-6" />
            <p className="hidden md:block">Sign In</p>
          </Link>
          <button
              onClick={handleLogout}
              className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-yellow-100 hover:text-yellow-700 md:flex-none md:justify-start md:p-2 md:px-3"
            >
              <ArrowLeftStartOnRectangleIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
            </button>
      </div>
    </div>
  );
}
