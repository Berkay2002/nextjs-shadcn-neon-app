import { Metadata } from 'next';
import PageLayout from '@/components/layout/PageLayout';
import GenerationStats from './_components/GenerationStats';
import UsageChart from './_components/UsageChart';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Dashboard - AI Generation Hub',
  description: 'View your AI generation stats and usage',
};

export default function DashboardPage() {
  // TODO: Fetch real data from database
  const mockStats = {
    totalGenerations: 42,
    imagesGenerated: 25,
    videosGenerated: 8,
    musicGenerated: 9,
    creditsUsed: 150,
    creditsRemaining: 350,
  };

  const mockUsageData = [
    { date: '2025-01-13', images: 3, videos: 1, music: 2 },
    { date: '2025-01-14', images: 5, videos: 0, music: 1 },
    { date: '2025-01-15', images: 2, videos: 2, music: 3 },
    { date: '2025-01-16', images: 8, videos: 1, music: 0 },
    { date: '2025-01-17', images: 4, videos: 3, music: 1 },
    { date: '2025-01-18', images: 2, videos: 1, music: 2 },
    { date: '2025-01-19', images: 1, videos: 0, music: 0 },
  ];

  return (
    <PageLayout>
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              Dashboard
            </h1>
            <p className="text-xl text-muted-foreground">
              Monitor your AI generation activity and usage
            </p>
          </div>
          
          <GenerationStats stats={mockStats} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <UsageChart data={mockUsageData} />
            
            {/* Recent Generations - TODO: Implement */}
            <div className="bg-card rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Generations</h3>
              <p className="text-muted-foreground">
                Recent generations will appear here once implemented.
              </p>
            </div>
          </div>
        </div>
      </main>
    </PageLayout>
  );
}