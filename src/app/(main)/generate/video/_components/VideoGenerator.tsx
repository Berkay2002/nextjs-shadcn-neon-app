'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function VideoGenerator() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    // TODO: Implement Veo 3 video generation
    setIsGenerating(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Videos with Veo 3</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Describe the video you want to generate..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
        />
        <Button 
          onClick={handleGenerate} 
          disabled={isGenerating || !prompt}
          className="w-full"
        >
          {isGenerating ? 'Generating...' : 'Generate Video'}
        </Button>
        {generatedVideo && (
          <div className="mt-4">
            <video 
              src={generatedVideo} 
              controls 
              className="w-full rounded-lg"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}