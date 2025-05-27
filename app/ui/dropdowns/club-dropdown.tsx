//club dropdown (for registration form)
'use client';
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

type ClubDropdownProps = {
  onChange?: (club: string) => void;
};

type RefType = {
  getSelectedClub: () => string;
};

const ClubDropdown = forwardRef<RefType, ClubDropdownProps>((props, ref) => {
  const { onChange } = props;
  
  const [isOpen, setIsOpen] = useState(false);
  const [selectedClub, setSelectedClub] = useState('Select Club');
  const [clubs, setClubs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  //fetch all clubs and make a list
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/club-names');
        
        if (!response.ok) {
          throw new Error('Failed to fetch clubs');
        }
        
        const clubList = await response.json();
        setClubs(clubList.map((club: any) => club.club_name));
        setError(null);
      } catch (error) {
        console.error('Error fetching clubs:', error);
        setError('Failed to load clubs');
      } finally {
        setLoading(false);
      }
    };
    
    fetchClubs();
  }, []);

  //open/close dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  //if new club is selected, close dropdown + change club
  const handleSelect = (club: string) => {
    setSelectedClub(club);
    setIsOpen(false);
    if (onChange) onChange(club);
  };

  //makes selected club and reset function available to parent
  useImperativeHandle(ref, () => ({
    getSelectedClub: () => selectedClub === 'Select Club' ? '' : selectedClub,
    reset: () => setSelectedClub('Select Club'),
  }));

  //shows "Loading clubs" while fetching the club list from database
  if (loading) {
    return (
      <div className="flex">
        <div className="flex items-center mb-[10px] justify-center rounded-md mt-[15px] bg-gray-200 w-[230px] h-[65px] text-sm font-medium">
          Loading clubs...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex">
        <div className="flex items-center mb-[10px] justify-center rounded-md mt-[15px] bg-red-200 w-[230px] h-[65px] text-sm font-medium">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <div className="relative inline-block text-left">
        <button
          type="button"
          className="flex items-center mb-[10px] justify-center rounded-md mt-[15px] bg-yellow-200 w-[230px] h-[65px] text-sm font-medium"
          onClick={toggleDropdown}
        >
          {selectedClub}
          <ChevronDownIcon className="justify-right mr-[10px] w-[20px] h-[20px] ml-2" />
        </button>
        
        {isOpen && (
          <div className="origin-top-right absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
            <div className="py-1 max-h-60 overflow-y-auto">
              {clubs.map((club, index) => (
                <button
                  key={index}
                  type="button"
                  className="block w-full text-left px-4 py-2 text-sm text-black hover:bg-yellow-100"
                  onClick={() => handleSelect(club)}
                >
                  {club}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

ClubDropdown.displayName = 'ClubDropdown';

export default ClubDropdown;