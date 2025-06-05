//implements side navigation, image header, and help button throughout the site
import SideNav from '@/app/ui/navigation/sidenav';
import Image from 'next/image'; 
import HelpButton from '@/app/ui/dashboard/help-button';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64 mx-[0px]">
        <SideNav />
      </div>
      <div className="flex-grow md:overflow-y-auto">
        <div className="inline block flex-col w-[100vw] h-[30vh]">
          <div className="relative">
          <Image
                  key="clubhub header"
                  src="/headerImage.png"
                  alt="ClubHub Header Image"
                  style={{objectFit:"cover"}}
                  height={621}
                  width={1920}
                  className="w-full h-[30vh] sm:h-[40vh] md:h-[50vh] lg:h-[60vh]"
                ></Image>
          <HelpButton />
          </div>        
        </div>
        {children}
      </div>
    </div>
  );
}