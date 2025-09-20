import Link from 'next/link';
import { ArrowRight, Sparkles, Zap, Users, TrendingUp, PlayCircle, Image as ImageIcon, Music, Video } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

const features = [
  {
    icon: ImageIcon,
    title: 'AI Images',
    description: 'Generate stunning photorealistic images, artwork, and graphics with Gemini 2.5 Flash Image Preview',
    href: '/generate/image',
    gradient: 'from-blue-500 to-cyan-500',
    stats: '10M+ images created'
  },
  {
    icon: Video,
    title: 'AI Videos',
    description: 'Create engaging 8-second videos with Veo 3, complete with native audio generation',
    href: '/generate/video',
    gradient: 'from-purple-500 to-pink-500',
    stats: '500K+ videos generated'
  },
  {
    icon: Music,
    title: 'AI Music',
    description: 'Compose beautiful, high-fidelity music with Lyria 2 and real-time streaming',
    href: '/generate/music',
    gradient: 'from-green-500 to-emerald-500',
    stats: '2M+ tracks composed'
  }
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Digital Artist',
    content: 'This platform has revolutionized my creative workflow. The AI-generated images are incredibly detailed and exactly what I envision.'
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Content Creator',
    content: 'The video generation quality is mind-blowing. I can create professional-looking content in seconds instead of hours.'
  },
  {
    name: 'Emma Thompson',
    role: 'Music Producer',
    content: 'Lyria 2 helps me create background music for my projects. The quality and variety are exceptional.'
  }
];

const stats = [
  { label: 'Active Users', value: '50K+', icon: Users },
  { label: 'Content Generated', value: '12M+', icon: TrendingUp },
  { label: 'Success Rate', value: '99.8%', icon: Zap },
  { label: 'Processing Speed', value: '<30s', icon: PlayCircle }
];

export default function Home() {
  return (
    <PageLayout>
      <main className="overflow-hidden">
        {/* Hero Section */}
        <section className="relative py-20 sm:py-32 lg:py-40">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950" />
          <div className="absolute inset-0 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),transparent)] dark:bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.900/20),transparent)]" />
          
          <div className="relative">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-4xl text-center">
                {/* Badge */}
                <div className="mb-8 flex justify-center">
                  <Badge variant="secondary" className="px-4 py-2 text-sm font-semibold">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Powered by Google&apos;s Latest AI Models
                  </Badge>
                </div>
                
                {/* Main heading */}
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl lg:text-7xl">
                  <span className="block">Create with</span>
                  <span className="block bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                    AI Generation Hub
                  </span>
                </h1>
                
                {/* Description */}
                <p className="mt-8 text-lg leading-8 text-gray-600 dark:text-gray-300 sm:text-xl max-w-3xl mx-auto">
                  Transform your ideas into stunning visuals, engaging videos, and beautiful music using 
                  Google&apos;s most advanced AI models: Gemini 2.5 Flash Image Preview, Veo 3, and Lyria 2.
                </p>
                
                {/* CTA Buttons */}
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button size="lg" className="px-8 py-4 text-base font-semibold" asChild>
                    <Link href="/generate/image">
                      Start Creating
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="px-8 py-4 text-base font-semibold" asChild>
                    <Link href="/dashboard">
                      <PlayCircle className="mr-2 h-5 w-5" />
                      View Dashboard
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-base font-semibold leading-7 text-indigo-600 dark:text-indigo-400">
                Trusted by creators worldwide
              </h2>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-4">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="text-center">
                    <div className="flex justify-center mb-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/20">
                        <Icon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </div>
                    <div className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 sm:py-24 bg-gray-50 dark:bg-gray-900/50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-base font-semibold leading-7 text-indigo-600 dark:text-indigo-400">
                Everything you need
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Create anything with AI
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                From photorealistic images to engaging videos and beautiful music—our AI tools help you bring any creative vision to life.
              </p>
            </div>
            
            <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Card key={feature.title} className="group relative overflow-hidden border-0 bg-white/50 backdrop-blur-sm dark:bg-gray-800/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
                    {/* Gradient background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                    
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-4">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} text-white`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{feature.title}</CardTitle>
                          <Badge variant="secondary" className="mt-1 text-xs">
                            {feature.stats}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <CardDescription className="text-base leading-relaxed">
                        {feature.description}
                      </CardDescription>
                      
                      <Button 
                        variant="outline" 
                        className="w-full group-hover:bg-gray-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-gray-900 transition-colors duration-300" 
                        asChild
                      >
                        <Link href={feature.href}>
                          Get Started
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-base font-semibold leading-7 text-indigo-600 dark:text-indigo-400">
                What creators are saying
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Loved by thousands
              </p>
            </div>
            
            <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <blockquote className="text-gray-600 dark:text-gray-300 mb-6">
                      &ldquo;{testimonial.content}&rdquo;
                    </blockquote>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400">
                          {testimonial.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {testimonial.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="relative py-16 sm:py-24 overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900" />
          <div className="absolute inset-0 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.500/10),transparent)]" />
          
          <div className="relative">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Ready to create something amazing?
                </h2>
                <p className="mt-6 text-lg leading-8 text-gray-300">
                  Join thousands of creators and start generating stunning content with AI today.
                  No credit card required to get started.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button size="lg" variant="secondary" className="px-8 py-4 text-base font-semibold" asChild>
                    <Link href="/handler/sign-up">
                      Get Started Free
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="px-8 py-4 text-base font-semibold border-white/20 text-white hover:bg-white/10" asChild>
                    <Link href="/generate/image">
                      Try Demo
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white">
          <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Brand */}
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="h-8 w-8 text-indigo-400" />
                  <span className="text-2xl font-bold">AI Generation Hub</span>
                </div>
                <p className="text-gray-400 max-w-md">
                  Transform your creative vision with Google&apos;s most advanced AI models.
                  Create images, videos, and music with unprecedented quality and speed.
                </p>
              </div>
              
              {/* Links */}
              <div>
                <h3 className="font-semibold mb-4">Create</h3>
                <ul className="space-y-3 text-gray-400">
                  <li><Link href="/generate/image" className="hover:text-white transition-colors">AI Images</Link></li>
                  <li><Link href="/generate/video" className="hover:text-white transition-colors">AI Videos</Link></li>
                  <li><Link href="/generate/music" className="hover:text-white transition-colors">AI Music</Link></li>
                  <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Support</h3>
                <ul className="space-y-3 text-gray-400">
                  <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                  <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                  <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                  <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
                </ul>
              </div>
            </div>
            
            <Separator className="my-8 bg-gray-800" />
            
            <div className="flex flex-col sm:flex-row justify-between items-center text-gray-400 text-sm">
              <p>© 2024 AI Generation Hub. All rights reserved.</p>
              <p>Built with ❤️ using Next.js and Shadcn UI</p>
            </div>
          </div>
        </footer>
      </main>
    </PageLayout>
  );
}
