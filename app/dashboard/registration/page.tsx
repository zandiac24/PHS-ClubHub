export default function Page() {
    return (
        <div className='ml-[35px]'>
            <div className='text-[25px] font-semibold mt-[25px]'>Student Registration Form</div>
            <div className='text-[16px] mt-[7px] mb-[10px]'>Students must fill out the form below to officially join a club.</div>
            <form>
                <h1>Student Full Name</h1>
                 <input id="studentname" type="studentname" placeholder="Enter your full name (ex. John Poole)"></input>
            </form>
        </div>
    );
}