//phs clubhub logo (for the sidebar)
import { lusitana } from '@/app/ui/fonts';
import Image from "next/image";

export default function ClubHubLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      <Image src="/falconIcon.png" alt="club logo" width={70} height={70} priority/>
      <p className="text-[25px] ml-[5px]">Poolesville ClubHub</p>
    </div>
  );
}
