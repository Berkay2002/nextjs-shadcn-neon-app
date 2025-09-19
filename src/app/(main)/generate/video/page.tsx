import { Metadata } from 'next';
import PageLayout from '@/components/layout/PageLayout';
import VideoGenerator from './_components/VideoGenerator';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Generate Videos - AI Generation Hub',
  description: 'Generate amazing videos with AI using Veo 3',
};

export default function VideoGenerationPage() {
  return (
    <PageLayout>
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              AI Video Generation
            </h1>
            <p className="text-xl text-muted-foreground">
              Create amazing videos with Veo 3
            </p>
          </div>
          
          <VideoGenerator />
        </div>
      </main>
    </PageLayout>
  );
}