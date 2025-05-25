import PendingClubList from '@/app/ui/dashboard/pending-clubs';
export const dynamic = 'force-dynamic';


export default async function Page() {
    return (
        <div className='ml-[35px]'>
            <h1 className='text-[25px] font-semibold mt-[25px] mb-[30px]'>Pending Clubs</h1>
            <div>
                    <PendingClubList />
            </div>
        </div>
    );
}
