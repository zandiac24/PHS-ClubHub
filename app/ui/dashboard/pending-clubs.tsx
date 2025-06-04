//server side, gets the data for the pending cards and creates a card for each
import {fetchPending} from '@/app/lib/pending-data';
import PendingCard from '@/app/ui/dashboard/pending-card';
export default async function PendingClubList() {
  const clubList = await fetchPending();

  return (
    <div className="flex w-[100%] md:w-[68vw] lg:w-[100%] grid mb-[45px] lg:grid-cols-3 lg:gap-[40px] md:grid-cols-2 md:gap-5 sm:grid-cols-1 sm:gap-10">
      {/*create a card for each club*/}
      {clubList.map((club) => (
        <PendingCard key={club.club_name} club={club} />
      ))}
    </div>
  );
}

