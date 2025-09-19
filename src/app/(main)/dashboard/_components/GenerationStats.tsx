'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GenerationStatsProps {
  stats: {
    totalGenerations: number;
    imagesGenerated: number;
    videosGenerated: number;
    musicGenerated: number;
    creditsUsed: number;
    creditsRemaining: number;
  };
}

export default function GenerationStats({ stats }: GenerationStatsProps) {
  const statCards = [
    {
      title: "Total Generations",
      value: stats.totalGenerations,
      icon: "📊",
      color: "text-blue-600"
    },
    {
      title: "Images Created",
      value: stats.imagesGenerated,
      icon: "🖼️",
      color: "text-green-600"
    },
    {
      title: "Videos Created",
      value: stats.videosGenerated,
      icon: "🎬",
      color: "text-purple-600"
    },
    {
      title: "Music Created",
      value: stats.musicGenerated,
      icon: "🎵",
      color: "text-orange-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCards.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <span className="text-2xl">{stat.icon}</span>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
          </CardContent>
        </Card>
      ))}
      
      {/* Credits card */}
      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle className="text-lg">Credits Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Credits Used</p>
              <p className="text-xl font-bold text-red-600">{stats.creditsUsed}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Credits Remaining</p>
              <p className="text-xl font-bold text-green-600">{stats.creditsRemaining}</p>
            </div>
            <div className="w-48">
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{
                    width: `${Math.min(100, (stats.creditsUsed / (stats.creditsUsed + stats.creditsRemaining)) * 100)}%`
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round((stats.creditsUsed / (stats.creditsUsed + stats.creditsRemaining)) * 100)}% used
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}