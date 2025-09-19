import Link from 'next/link';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <PageLayout>
      <main>
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-5xl font-bold tracking-tight mb-6">
              AI Generation Hub
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Create stunning images, videos, and music with the power of Google&apos;s latest AI models.
              Gemini 2.5 Flash, Veo 3, and Lyria 2 at your fingertips.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/generate/image">Start Creating</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/dashboard">View Dashboard</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-muted/50">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              What You Can Create
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    🖼️ AI Images
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Generate stunning images with Gemini 2.5 Flash. From photorealistic scenes to abstract art.
                  </p>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/generate/image">Generate Images</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    🎬 AI Videos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Create amazing 8-second videos with Veo 3. Complete with native audio generation.
                  </p>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/generate/video">Generate Videos</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    🎵 AI Music
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Compose beautiful music with Lyria 2. Real-time streaming and high-fidelity audio.
                  </p>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/generate/music">Generate Music</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Sign up today and start creating with AI
            </p>
            <Button size="lg" asChild>
              <Link href="/handler/sign-up">Get Started Free</Link>
            </Button>
          </div>
        </section>
      </main>
    </PageLayout>
  );
}
