export default function Page() {
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
            <form>
                <h1>Club Name*</h1>
                 <input id="clubname" type="clubname" placeholder="Enter the name of the club (no acronyms/abbreviations)"></input>
                <h1>Student Requesting Approval (Point of Contact)*</h1>
                 <input id="studentname" type="studentname" placeholder="Enter your full name (ex. John Poole)"></input>
                 <h1>Student Email*</h1>
                 <input id="studentemail" type="studentemail" placeholder="Enter your MCPS email (@mcpsmd.net)"></input>
                 <h1>Club Sponsor's Name (First and Last)*</h1>
                 <input id="sponsorname" type="sponsorname" placeholder="Enter the club sponsor's full name"></input>
                 <h1>Club Sponsor's Email*</h1>
                 <input id="sponsoremail" type="sponsoremail" placeholder="Enter the club sponsor's MCPS email (@mcpsmd.net)"></input>
                 <h1>Purpose/Description of the Club*</h1>
                 <input className='py-12' id="purpose" type="purpose" placeholder="Enter a short description of your club"></input>
                 <h1>Meeting Location*</h1>
                 <input id="meetingloc" type="meetingloc" placeholder="Enter club meeting location (ex. Room 1000)"></input>
                 <h1>Additional Information (Website, Social Media, etc.)</h1>
                 <input className='mb-[30px]' id="addinfo" type="addinfo" placeholder="Additional information (optional)"></input>
            </form>
        </div>
    );
}