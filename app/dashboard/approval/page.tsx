//admin panel page
import PendingClubList from '@/app/ui/dashboard/pending-clubs';
export const dynamic = 'force-dynamic';
import Link from 'next/link';
import ClearRosterButton from '@/app/ui/dashboard/clear-button';


export default async function Page() {
   
    return (
        <div>
            <h1 className='text-[25px] font-semibold mt-[25px] mb-[10px] ml-[35px]'>Admin Panel</h1>
            <div className='grid grid-cols-3 ml-[0px]'>
            <div>
                <h1 className="mt-[30px] justify-center flex">Download Student Roster</h1>
                <Link
                    href="https://console.neon.tech/app/projects/winter-scene-29137066/branches/br-little-band-a4exokvw/tables?database=neondb" 
                className='flex items-center mx-auto mb-[30px] mt-[30px] justify-center rounded-md bg-yellow-100 w-[10vw] h-[6vh] text-md font-medium hover:bg-yellow-200'
                >
                <p className="hidden md:block">Download Roster</p>
                </Link>
            </div>

             <div>
            <ClearRosterButton />
            </div>

            <div>
            <h1 className="mt-[30px] justify-center flex">Update Club Information</h1>
            <Link
                className='flex items-center mb-[30px] mt-[30px] mx-auto justify-center rounded-md bg-yellow-100 w-[10vw] h-[6vh] text-md text-center font-medium hover:bg-yellow-200'
                href="/dashboard/update"
            >
                Update Form
            </Link>
            </div>
            </div>
            
            <h2 className='text-[25px] ml-[35px] font-semibold mt-[50px] mb-[30px]'>Pending Clubs</h2>
            
            <div className='ml-[35px]'>
                    <PendingClubList />
            </div>
        </div>
    );
}
