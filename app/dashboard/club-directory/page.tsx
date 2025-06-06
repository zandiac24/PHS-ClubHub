//club directory main page
import DirLinks from '@/app/ui/navigation/links/directory-links'
export default function Page() {
    return (
        <div className='ml-[35px] mr-[35px]'>
            <h1 className='mb-[60px] mt[25px]'>Explore the clubs PHS has to offer!</h1>
            <div className='grid lg:grid-cols-4 lg:gap-7 md:grid-cols-3 md:gap-5 sm:grid-cols-1 sm:gap-1'>
                <DirLinks />
            </div>
        </div>
    );
}
