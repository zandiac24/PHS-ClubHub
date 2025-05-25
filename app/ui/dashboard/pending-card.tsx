'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function PendingCard({ club }: { club: any }) {
  const [approved, setApproved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ club_name: club.club_name }),
      });

      if (!response.ok) throw new Error('Approval failed');

      alert('Club approved successfully!');
      setApproved(true);
    } catch (err) {
      console.error('Submission error:', err);
      alert('An error occurred.');
    }
  };

  if (approved) return null; // Optional: hide card once approved

  return (
    <div className='text-[16px] text-black bg-gradient-to-b from-white via-yellow-300 to-yellow-500 border-4 border-yellow-500 px-7 pt-7 pb-10 rounded-xl overflow-hidden break-words'>
      <p className="text-[21px] font-semibold text-center">{club.club_name}</p>
      <p className="font-semibold mb-[25px] text-center">{club.category}</p>
      <p className='mb-[20px]'>{club.description}</p>

      {club.meeting_days_time && club.meeting_days_time !== 'TBD' && (
        <p className="mb-[10px] flex justify-center">
          <span className="inline-block text-left max-w-[290px]">
            <b className="font-semibold mr-1">Meetings:</b> {club.meeting_days_time}
          </span>
        </p>
      )}

      {club.meeting_location && (
        <p className="mb-[10px] flex justify-center">
          <span className="inline-block text-left max-w-[290px]">
            <b className="font-semibold mr-1">Location:</b> {club.meeting_location}
          </span>
        </p>
      )}

      {club.contactName && (
        <p className='mb-[10px] flex justify-center'>
          <b className='font-semibold mr-[5px]'>Sponsor: </b>
          <Link href={`mailto:${club.contactEmail}`} className="underline decoration-yellow-200">
            {club.contactName}
          </Link>
        </p>
      )}

      {club.studentName && club.studentEmail && (
        <p className="mb-[10px] flex justify-center">
          <span className="inline-block text-center max-w-[290px]">
            <b className="font-semibold mr-1">Student Leader(s): </b>
            <Link href={`mailto:${club.studentEmail}`} className="underline decoration-yellow-200">
              {club.studentName}
            </Link>
          </span>
        </p>
      )}

      {club.additional_info && (
        <p className="mb-[10px] flex justify-center">
          <span className="inline-block mt-4 text-yellow-700 text-[14px] text-left break-words max-w-full overflow-hidden whitespace-normal w-full">
            Additional Information: {club.additional_info}
          </span>
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="w-[100%] mt-6 flex justify-center">
          <button
            type="submit"
            className="flex items-center mb-[20px] mt-[30px] justify-center rounded-md bg-yellow-100 px-6 py-4 text-sm font-medium hover:bg-yellow-200"
          >
            Approve
          </button>
        </div>
      </form>
    </div>
  );
}
