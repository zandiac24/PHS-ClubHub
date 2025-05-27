//redirect to club directory (main page)
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/dashboard/club-directory');
}
