import clsx from 'clsx';
import {fetchClubs} from '@/app/lib/data';

export default async function ClubList() {
    const clubList = await fetchClubs('science/tech');
  return (
    <div>
        {<div className='flex w-[78vw] grid grid-cols-3 gap-[40px] mb-[45px]'>
          {clubList.map((club, i) => {
            return (
              <div
                key={club.club_name}
                className='text-[16px] text-black bg-yellow-100 px-7 pt-7 pb-10 rounded-xl'
              >
                <p className="text-xl font-semibold mb-[25px] text-center">
                    {club.club_name}
                </p>

                <p className='mb-[20px]'>
                  {club.description}
                </p>

                {/*Meeting Info*/}
                {club.meeting_days_time && club.meeting_days_time !== 'TBD' && <p className='mb-[10px]'>{`Meetings: ${club.meeting_days_time}`}</p>}
                {club.meeting_location && <p className='mb-[10px]'>{`Location: ${club.meeting_location}`}</p>}

                {/*Sponsor Info*/}
                {club.contactName && <p className='mb-[10px]'>{`Sponsor: ${club.contactName}`}</p>}
                {club.contactEmail && <p className='mb-[10px]'>{`Contact: ${club.contactEmail}`}</p>}

                {club.additional_info && <p>{club.additional_info}</p>}
              </div>
            );
          })}
        </div>}
    </div>
  );
};
