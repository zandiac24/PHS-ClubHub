import Link from 'next/link'
import DirLinks from '@/app/ui/dashboard/directory-links'
export default function Page() {
    return (
        <div className='ml-[35px]'>
            <h1 className='mb-[60px] mt[25px]'>Explore the clubs PHS has to offer!</h1>
            <div className='grid grid-cols-4 gap-4'>
                <DirLinks />
            </div>
        </div>
    );
}
