import SideNav from '@/app/ui/navigation/sidenav';
import Image from 'next/image'; 

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow md:overflow-y-auto">
        <div className="inline block flex-col mt:0px w-[100vw] h-[30vh]">
          <Image
                  key="clubhub header"
                  src="/headerImage.png"
                  alt="ClubHub Header Image"
                  objectFit="contain"
                  height={300}
                  width={1400}
                  className="w-[100vw] h-[60vh]"
                ></Image>

                
        </div>
        {children}
      </div>
    </div>
  );
}