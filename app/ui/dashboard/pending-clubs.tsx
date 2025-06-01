//server side, gets the data for the pending cards and creates a card for each
import {fetchPending} from '@/app/lib/pending-data';
import PendingCard from '@/app/ui/dashboard/pending-card';
export default async function PendingClubList() {
  const clubList = await fetchPending();

  return (
    <div className="flex w-[78vw] grid grid-cols-3 gap-[40px] mb-[45px]">
      {/*create a card for each club*/}
      {clubList.map((club) => (
        <PendingCard key={club.club_name} club={club} />
      ))}
    </div>
  );
}

