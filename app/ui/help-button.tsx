'use client'
import { useState } from 'react';
import {ExclamationCircleIcon} from '@heroicons/react/24/outline';
import Link from 'next/link';

export function HelpButton() {
    
    const [isOpen, setIsOpen] = useState(false);

    const toggleHelp = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div>
                <button
                    type="button"
                    className="flex absolute top-0 right-[10px] items-center text-center mb-[10px] justify-center rounded-md mt-[15px] bg-yellow-100 w-[5vw] h-[5vh] px-2 text-sm font-medium hover:bg-yellow-200"
                    onClick={toggleHelp}
                >
                    Help
                    <ExclamationCircleIcon className="justify-right mr-[5px] w-[30px] h-[30px] ml-[5px]" />
                </button>

                {isOpen && (
                    <div className="origin-top-right absolute
                                    top-[53px] right-[10px] mt-2 w-56 px-2 rounded-md
                                    shadow-lg bg-yellow-100 ring-1 ring-black
                                    ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                            For more information, reach out to the ECA director, Mr. Young at <Link href="mailto:terry.w.young@mcpsmd.net" className="underline text-yellow-700">terry.w.young@mcpsmd.net.</Link>
                        </div>
                    </div>
                )}
            </div>
    );
};

export default HelpButton;
