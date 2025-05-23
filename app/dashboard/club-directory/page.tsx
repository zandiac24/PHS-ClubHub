import Link from 'next/link'
import DirLinks from '@/app/ui/navigation/links/directory-links'
export default function Page() {
    return (
        <div className='ml-[35px]'>
            <h1 className='mb-[60px] mt[25px]'>Explore the clubs PHS has to offer!</h1>
            <div className='grid grid-cols-4 gap-7'>
                <DirLinks />
            </div>
        </div>
    );
}
