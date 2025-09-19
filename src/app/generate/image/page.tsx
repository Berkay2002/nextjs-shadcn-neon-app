import { Metadata } from 'next';
import ImageGenerator from './_components/ImageGenerator';
import Header from '@/components/layout/Header';
import ProtectedRoute from '@/components/common/ProtectedRoute';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Generate Images - AI Generation Hub',
  description: 'Generate stunning images with AI using Gemini 2.5 Flash',
};

export default function ImageGenerationPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              AI Image Generation
            </h1>
            <p className="text-xl text-muted-foreground">
              Create stunning images with Gemini 2.5 Flash
            </p>
          </div>
          
          <ProtectedRoute fallbackMessage="Sign in to start generating amazing images with AI">
            <ImageGenerator />
          </ProtectedRoute>
        </div>
      </main>
    </div>
  );
}
