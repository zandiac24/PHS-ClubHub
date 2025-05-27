//implements side navigation, image header, and help button throughout the site
import SideNav from '@/app/ui/navigation/sidenav';
import Image from 'next/image'; 
import HelpButton from '@/app/ui/dashboard/help-button';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow md:overflow-y-auto">
        <div className="inline block flex-col mt:0px w-[100vw] h-[30vh]">
          <div className="relative">
          <Image
                  key="clubhub header"
                  src="/headerImage.png"
                  alt="ClubHub Header Image"
                  style={{objectFit:"cover"}}
                  height={621}
                  width={1920}
                  className="w-[100vw] h-[60vh]"
                ></Image>
          <HelpButton />
          </div>        
        </div>
        {children}
      </div>
    </div>
  );
}