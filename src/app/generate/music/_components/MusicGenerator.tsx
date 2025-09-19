'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function MusicGenerator() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAudio] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    // TODO: Implement Lyria 2 music generation
    setIsGenerating(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Music with Lyria 2</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Describe the music style you want..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
        />
        <Button 
          onClick={handleGenerate} 
          disabled={isGenerating || !prompt}
          className="w-full"
        >
          {isGenerating ? 'Generating...' : 'Generate Music'}
        </Button>
        {generatedAudio && (
          <div className="mt-4">
            <audio 
              src={generatedAudio} 
              controls 
              className="w-full"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}