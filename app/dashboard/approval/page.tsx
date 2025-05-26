import PendingClubList from '@/app/ui/dashboard/pending-clubs';
export const dynamic = 'force-dynamic';
import Link from 'next/link';


export default async function Page() {
    return (
        <div className='ml-[35px]'>
            <h1 className='text-[25px] font-semibold mt-[25px] mb-[10px]'>Admin Panel</h1>
            <Link href="https://console.neon.tech/app/projects/winter-scene-29137066/branches/br-little-band-a4exokvw/tables?database=neondb" className="underline text- text-blue-700 mb-[30px]">Download Roster Here</Link>
            <h2 className='text-[25px] font-semibold mt-[50px] mb-[30px]'>Pending Clubs</h2>
            
            <div>
                    <PendingClubList />
            </div>
        </div>
    );
}
