import { redirect } from 'next/navigation';

interface TopicsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function TopicsPage({ params }: TopicsPageProps) {
  const { locale } = await params;
  redirect(`/${locale}`);
}
