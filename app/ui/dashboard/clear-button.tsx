'use client';

export function ClearRoster() {

  

  const deleteRoster = async () => {
    const result = window.confirm("Are you sure you want to clear the student roster?");
    if (result) {
        try {
      const response = await fetch('/api/clear-roster', {
        method: 'POST',
      });
      alert('Roster cleared successfully!');

    } catch (error) {
      alert(`Error: Deletion of student information failed.`);
    }
    }
  };

  return (
    <div>
      <h1 className="mt-[30px] justify-center flex">Clear Student Roster (End of Year)</h1>
      <button onClick={deleteRoster} className='flex items-center mx-auto mb-[30px] mt-[30px] justify-center rounded-md bg-yellow-100 w-[10vw] h-[6vh] text-md font-medium hover:bg-yellow-200'>
        Clear Roster
      </button>
    </div>
  );
}

export default ClearRoster;