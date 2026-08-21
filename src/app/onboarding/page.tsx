import { getSessionUser } from '@/lib/server/getSessionUser';
import { redirect } from 'next/navigation';

export default async function OnboardingPage() {
  const user = await getSessionUser();
  if (!user) redirect('/');

  if (user.feeds.length > 0) redirect('/feed');

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="outline outline-secondary-bg p-6">
        {/* <OnboardingForm /> */}
      </div>
    </div>
  );
}
