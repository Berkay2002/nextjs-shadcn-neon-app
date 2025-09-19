'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface UsageData {
  date: string;
  images: number;
  videos: number;
  music: number;
}

interface UsageChartProps {
  data: UsageData[];
}

export default function UsageChart({ data }: UsageChartProps) {
  // TODO: Integrate with a charting library like recharts or chart.js
  // For now, we'll create a simple placeholder visualization
  
  const maxValue = Math.max(...data.flatMap(d => [d.images, d.videos, d.music]));
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage Over Time</CardTitle>
        <p className="text-sm text-muted-foreground">
          Daily generation activity for the past 7 days
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{item.date}</span>
                <span className="text-muted-foreground">
                  Total: {item.images + item.videos + item.music}
                </span>
              </div>
              <div className="flex space-x-1 h-6">
                {/* Images bar */}
                <div
                  className="bg-green-500 rounded-sm flex-shrink-0 min-w-0"
                  style={{
                    width: `${maxValue > 0 ? (item.images / maxValue) * 100 : 0}%`
                  }}
                  title={`Images: ${item.images}`}
                />
                {/* Videos bar */}
                <div
                  className="bg-purple-500 rounded-sm flex-shrink-0 min-w-0"
                  style={{
                    width: `${maxValue > 0 ? (item.videos / maxValue) * 100 : 0}%`
                  }}
                  title={`Videos: ${item.videos}`}
                />
                {/* Music bar */}
                <div
                  className="bg-orange-500 rounded-sm flex-shrink-0 min-w-0"
                  style={{
                    width: `${maxValue > 0 ? (item.music / maxValue) * 100 : 0}%`
                  }}
                  title={`Music: ${item.music}`}
                />
              </div>
            </div>
          ))}
          
          {/* Legend */}
          <div className="flex justify-center space-x-6 mt-6 pt-4 border-t">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-sm" />
              <span className="text-sm text-muted-foreground">Images</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-sm" />
              <span className="text-sm text-muted-foreground">Videos</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-sm" />
              <span className="text-sm text-muted-foreground">Music</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}