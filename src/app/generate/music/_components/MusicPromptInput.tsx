'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MusicPromptInputProps {
  onGenerate: (params: {
    prompt: string;
    bpm: number;
    duration: number;
    genre?: string;
  }) => Promise<void>;
  isGenerating?: boolean;
}

export default function MusicPromptInput({ onGenerate, isGenerating = false }: MusicPromptInputProps) {
  const [prompt, setPrompt] = useState('');
  const [bpm, setBpm] = useState([120]);
  const [duration, setDuration] = useState([30]);
  const [genre, setGenre] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    await onGenerate({
      prompt,
      bpm: bpm[0],
      duration: duration[0],
      genre: genre || undefined
    });
  };

  const examplePrompts = [
    "Upbeat electronic dance music with synthesizers",
    "Relaxing piano ballad with soft strings",
    "Energetic rock song with electric guitar",
    "Ambient soundscape with nature sounds",
    "Jazz fusion with saxophone and drums"
  ];

  const genres = [
    "Electronic", "Rock", "Pop", "Jazz", "Classical", 
    "Hip Hop", "Country", "Folk", "Ambient", "Dance"
  ];

  const handleExampleClick = (examplePrompt: string) => {
    setPrompt(examplePrompt);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Textarea
              placeholder="Describe the music you want to generate... Include style, instruments, mood, and any specific characteristics."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">BPM: {bpm[0]}</label>
              <Slider
                value={bpm}
                onValueChange={setBpm}
                max={200}
                min={60}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Slow (60)</span>
                <span>Fast (200)</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Duration: {duration[0]}s</label>
              <Slider
                value={duration}
                onValueChange={setDuration}
                max={120}
                min={10}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>10s</span>
                <span>120s</span>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">Genre (Optional)</label>
            <Select value={genre} onValueChange={setGenre}>
              <SelectTrigger>
                <SelectValue placeholder="Select a genre..." />
              </SelectTrigger>
              <SelectContent>
                {genres.map((g) => (
                  <SelectItem key={g} value={g.toLowerCase()}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            {isGenerating ? 'Generating...' : 'Generate Music'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}