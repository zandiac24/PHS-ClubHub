//club directory main page
import DirLinks from '@/app/ui/navigation/links/directory-links'
export default function Page() {
    return (
        <div className='ml-[35px] mr-[35px]'>
        <div className='grid lg:grid-cols-5 lg:gap-7 md:grid-cols-4 md:gap-5 sm:grid-cols-1 sm:gap-1'>
                <DirLinks />
            </div>
        </div>
    );
}
