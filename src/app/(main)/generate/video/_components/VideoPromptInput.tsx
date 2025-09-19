'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface VideoPromptInputProps {
  onGenerate: (prompt: string, referenceImage?: File) => Promise<void>;
  isGenerating?: boolean;
}

export default function VideoPromptInput({ onGenerate, isGenerating = false }: VideoPromptInputProps) {
  const [prompt, setPrompt] = useState('');
  const [referenceImage, setReferenceImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    await onGenerate(prompt, referenceImage || undefined);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReferenceImage(file);
    }
  };

  const examplePrompts = [
    "A cat walking through a sunny garden with flowers swaying in the breeze",
    "Abstract geometric shapes morphing and changing colors",
    "A paper airplane flying through clouds in slow motion",
    "Ocean waves crashing against rocks at sunset"
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
              placeholder="Describe the video you want to generate... Include details about motion, camera angles, and duration."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Reference Image (Optional)
            </label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
            {referenceImage && (
              <p className="text-sm text-muted-foreground mt-1">
                Selected: {referenceImage.name}
              </p>
            )}
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
            {isGenerating ? 'Generating...' : 'Generate Video'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}