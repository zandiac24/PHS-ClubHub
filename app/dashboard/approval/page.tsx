//admin panel page
import PendingClubList from '@/app/ui/dashboard/pending-clubs';
export const dynamic = 'force-dynamic';
import Link from 'next/link';
import ClearRosterButton from '@/app/ui/dashboard/clear-button';


export default async function Page() {
   
    return (
        <div className="ml-[35px] mr-[35px]">
            <h1 className='text-[25px] font-semibold mt-[25px] mb-[10px]'>Admin Panel</h1>
            <div className='grid lg:grid-cols-3 sm:grid-cols-1 ml-[0px]'>
            <div>
                <h1 className="mt-[30px]">Download Student Roster</h1>
                <Link
                    href="https://console.neon.tech/app/projects/winter-scene-29137066/branches/br-little-band-a4exokvw/tables?database=neondb" 
                className='flex items-center mb-[30px] mt-[30px] justify-center rounded-md bg-yellow-100 lg:w-[10vw] lg:text-md sm:w-[35vw] sm:text-md h-[6vh] font-medium hover:bg-yellow-200'
                >
                <p>Download Roster</p>
                </Link>
            </div>

             <div>
            <ClearRosterButton />
            </div>

            <div>
            <h1 className="mt-[30px]">Update Club Information</h1>
            <Link
                className='flex items-center mb-[30px] mt-[30px] justify-center rounded-md bg-yellow-100 lg:w-[10vw] lg:text-md sm:w-[35vw] sm:text-md h-[6vh] font-medium hover:bg-yellow-200'
                href="/dashboard/update"
            >
                Update Form
            </Link>
            </div>
            </div>
            
            <h2 className='text-[25px] font-semibold mt-[50px] mb-[30px]'>Pending Clubs</h2>
            
            <div>
                    <PendingClubList />
            </div>
        </div>
    );
}
