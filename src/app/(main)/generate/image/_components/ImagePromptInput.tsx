'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ImagePromptInputProps {
  onGenerate: (prompt: string) => Promise<void>;
  isGenerating?: boolean;
}

export default function ImagePromptInput({ onGenerate, isGenerating = false }: ImagePromptInputProps) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    await onGenerate(prompt);
  };

  const examplePrompts = [
    "A futuristic cityscape at sunset with flying cars",
    "A cozy cabin in a snowy forest with warm lights",
    "An abstract painting with vibrant colors and geometric shapes",
    "A cute robot reading a book in a library"
  ];

  const handleExampleClick = (examplePrompt: string) => {
    setPrompt(examplePrompt);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Textarea
              placeholder="Describe the image you want to generate... Be specific about style, colors, composition, and details."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground mr-2">Examples:</span>
            {examplePrompts.map((example, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleExampleClick(example)}
                className="text-xs bg-muted hover:bg-muted/80 px-2 py-1 rounded-full transition-colors"
              >
                {example}
              </button>
            ))}
          </div>

          <Button
            type="submit"
            disabled={isGenerating || !prompt.trim()}
            className="w-full"
          >
            {isGenerating ? 'Generating...' : 'Generate Image'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}