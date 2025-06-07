//home button (for login page)
import {ArrowLeftIcon} from '@heroicons/react/24/outline';
import Link from 'next/link';

export function BackButton() {

    return (
        <div>
            <Link href="/dashboard/club-directory" className="flex absolute top-10 left-8 items-center text-center mb-[10px] justify-center rounded-md bg-yellow-100 h-[5vh] px-2 text-sm font-medium hover:bg-yellow-200 lg:w-[6vw] md:w-[9vw] sm:w-[20vw]">
                <ArrowLeftIcon className="justify-left mr-[5px] w-[30%] h-[50%]" />
                Back                
            </Link>
        </div>
    );
};

export default BackButton;
