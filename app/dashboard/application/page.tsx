'use client';
import {FormEvent} from 'react';
import CategoryDropdown from '@/app/ui/dashboard/cat-options'

export default function Page() {
    const handleSubmit = async(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;

        const getValue = (name: string) => {
            const field = form.elements.namedItem(name) as HTMLInputElement | null;
            return field?.value || ''
        }
        const formData = {
            club_name: getValue('clubname'),
            studentName: getValue('studentname'),
            studentEmail: getValue('studentemail'),
            description: getValue('description'),
            category: getValue('category'),
            contactName: getValue('sponsorname'),
            contactEmail: getValue('sponsoremail'),
            meeting_days_time: getValue('meetingdates'),
            meeting_location: getValue('meetingloc'),
            additional_info: getValue('addinfo'),
            status: 'pending',

        };

        try{
            const res = await fetch('/api/clubs', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData),
            })
            if(res.ok) {
                alert('Form Submission Success!');
                form.reset();
            }
            else{
                const error = await res.json();
                alert(`Error: ${error.error || 'Something went wrong!'}`);
            }
        }
        catch(error) {
            console.error('Submision failed', error);
            alert('An error occurred.');
        }
    };
    return (
        <div className='ml-[35px]'>
            <div className='text-[25px] font-semibold mt-[25px]'>New Club Application Form</div>
            <div className='text-[16px] mt-[10px] mb-[25px]'>
                <div>Students must fill out the form below to apply to create a new club.</div>
                <div className='mt-[10px] mb-[10px]'>1. Be sure to read the "New Club Approval Requirements."</div>
                <div className='mt-[10px] mb-[10px]'>2. After you submit the club request online, an administrator will review your request.</div>
                <div className='mt-[10px]'>3. Upon approval from administration, the student and club sponsor will receive an email from the ECA Director, Mr. Young,</div>
                <div className='ml-[18px] mb-[10px]'>to let them know the club has been approved.</div>
                <div className='mt-[10px] mb-[10px]'>4. The club sponsor will email the Financial Specialist, Mr. Nathaniel Gordon, to establish an account if applicable.</div>  
            </div>
            <form onSubmit={handleSubmit}>
                <h1>Club Name*</h1>
                 <input id="clubname" name="clubname" placeholder="Enter the name of the club (no acronyms/abbreviations)"></input>
                <h1>Student Requesting Approval (Point of Contact)*</h1>
                 <input id="studentname" name="studentname" placeholder="Enter your full name (ex. John Poole)"></input>
                 <h1>Student Email*</h1>
                 <input id="studentemail" name="studentemail" placeholder="Enter your MCPS email (@mcpsmd.net)"></input>
                 <h1>Purpose/Description of the Club*</h1>
                 <input className='py-12' id="description" name="description" placeholder="Enter a short description of your club"></input>
                 <h1>Category (Pick the One that Fits Best)*</h1>
                 <CategoryDropdown />
                 {/* <h1>Category*</h1>
                 <input id="category" name="category" placeholder="Enter the category of your club"></input> */}
                 <h1>Club Sponsor's Name (First and Last)*</h1>
                 <input id="sponsorname" name="sponsorname" placeholder="Enter the club sponsor's full name"></input>
                 <h1>Club Sponsor's Email*</h1>
                 <input id="sponsoremail" name="sponsoremail" placeholder="Enter the club sponsor's MCPS email (@mcpsmd.net)"></input>
                 <h1>Meeting Day(s) and Times*</h1>
                 <input id="meetingdates" name="meetingdates" placeholder="Enter the meeting dates/times (ex. Monday and Thursday at Lunch)"></input>
                 <h1>Meeting Location*</h1>
                 <input id="meetingloc" name="meetingloc" placeholder="Enter club meeting location (ex. Room 1000)"></input>
                 <h1>Additional Information (Website, Social Media, etc.)</h1>
                 <input className='mb-[30px]' id="addinfo" name="addinfo" placeholder="Additional information (optional)"></input>
                 <div className="w-[60vw] mt-6 flex justify-center">
                 <button type="submit" className="flex items-center mb-[30px] justify-center rounded-md bg-yellow-100 px-6 py-4 text-sm font-medium hover:bg-yellow-200">
                    Submit
                 </button>
                 </div>
            </form>
        </div>
    );
}