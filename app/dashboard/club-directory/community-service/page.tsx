import ClubList from '@/app/ui/dashboard/club-cards';
export const dynamic = 'force-dynamic';


export default async function Page() {
    return (
        <div className='ml-[35px] mr-[35px]'>
            <h1 className='text-[25px] font-semibold mt-[25px] mb-[30px]'>Community Service Clubs</h1>
            <div>
                    <ClubList cat="community service" />
            </div>
        </div>
    );
}
