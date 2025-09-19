'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    // TODO: Implement Gemini image generation
    setIsGenerating(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Images with Gemini</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Describe the image you want to generate..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
        />
        <Button 
          onClick={handleGenerate} 
          disabled={isGenerating || !prompt}
          className="w-full"
        >
          {isGenerating ? 'Generating...' : 'Generate Image'}
        </Button>
        {generatedImage && (
          <div className="mt-4">
            <img 
              src={generatedImage} 
              alt="Generated" 
              className="w-full rounded-lg"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}