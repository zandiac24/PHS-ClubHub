import clsx from 'clsx';
import {fetchClubs} from '@/app/lib/data';
import Link from 'next/link'

type ClubListProps = {
  cat: string;
};

export default async function ClubList({ cat }: ClubListProps) {
    const clubList = await fetchClubs(cat);
  return (
    <div>
        {<div className='flex w-[78vw] grid grid-cols-3 gap-[40px] mb-[45px]'>
          {clubList.map((club, i) => {
            return (
              <div
                key={club.club_name}
                className='text-[16px] text-black bg-gradient-to-b from-white via-yellow-300
               to-yellow-500 border-4 border-yellow-500 px-7 pt-7 pb-10 rounded-xl'
              >
                <p className="text-[21px] font-semibold mb-[25px] text-center">
                    {club.club_name}
                </p>

                <p className='mb-[20px]'>
                  {club.description}
                </p>

                {/*Meeting Info*/}
                {club.meeting_days_time && club.meeting_days_time !== 'TBD' && (
                <p className="mb-[10px] flex justify-center">
                  <span className="inline-block text-left max-w-[290px]">
                    <b className="font-semibold mr-1">Meetings:</b>
                    {club.meeting_days_time}
                  </span>
                </p>
              )}
{club.meeting_location && <p className='mb-[10px] flex justify-center'><b className='font-semibold mr-[5px]'>Location: </b>{club.meeting_location}</p>}

                {/*Sponsor Info*/}
                {club.contactName && <p className='mb-[10px] flex justify-center'><b className='font-semibold mr-[5px]'>Sponsor: </b><Link href={`mailto:${club.contactEmail}`} className="underline">{club.contactName}</Link></p>}
                {/* {club.additional_info && <p className='mt-4 flex justify-center text-yellow-700 text-[14px]'>{club.additional_info}</p>} */}
              </div>
            );
          })}
        </div>}
    </div>
  );
};
