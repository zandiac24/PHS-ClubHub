import SideNav from '@/app/ui/dashboard/sidenav';
import Image from 'next/image'; 

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow md:overflow-y-auto">
        <div className="inline block flex-col mt:0px">
                <Image src="/headerImage.png" alt="clubhub header" width={1400} height={300} />
                
        </div>
        {children}
      </div>
    </div>
  );
}