import { Metadata } from 'next';
import PageLayout from '@/components/layout/PageLayout';
import MusicGenerator from './_components/MusicGenerator';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Generate Music - AI Generation Hub',
  description: 'Generate beautiful music with AI using Lyria 2',
};

export default function MusicGenerationPage() {
  return (
    <PageLayout>
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              AI Music Generation
            </h1>
            <p className="text-xl text-muted-foreground">
              Create beautiful music with Lyria 2
            </p>
          </div>
          
          <MusicGenerator />
        </div>
      </main>
    </PageLayout>
  );
}