'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Download, AlertCircle, Clock } from 'lucide-react';
import type { ImageGenerationRequest, ImageGenerationResponse } from '@/types/generation';

interface QuotaInfo {
  dailyRemaining: number;
  monthlyRemaining: number;
  canGenerate: boolean;
}

interface GenerationInfo {
  baseCost: number;
  formattedCost: string;
  maxPromptLength: number;
  rateLimit: string;
}

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [quota, setQuota] = useState<QuotaInfo | null>(null);
  const [generationInfo, setGenerationInfo] = useState<GenerationInfo | null>(null);
  const [progress, setProgress] = useState(0);
  const [generationId, setGenerationId] = useState<string | null>(null);

  // Fetch quota and pricing info on component mount
  useEffect(() => {
    fetchGenerationInfo();
  }, []);

  const fetchGenerationInfo = async () => {
    try {
      const response = await fetch('/api/generate/image');
      const data = await response.json();

      if (data.success) {
        setQuota(data.data.quota);
        setGenerationInfo({
          baseCost: data.data.pricing.baseCost,
          formattedCost: data.data.pricing.formattedCost,
          maxPromptLength: data.data.limits.maxPromptLength,
          rateLimit: data.data.limits.rateLimit,
        });
      }
    } catch (error) {
      console.error('Failed to fetch generation info:', error);
    }
  };

  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
    return interval;
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    if (!quota?.canGenerate) return;

    setIsGenerating(true);
    setGeneratedImage(null);
    setError(null);
    setGenerationId(null);

    const progressInterval = simulateProgress();

    try {
      const generationRequest: ImageGenerationRequest = {
        prompt: prompt.trim(),
        // Optional parameters can be added here
        quality: 85,
      };

      const response = await fetch('/api/generate/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(generationRequest),
      });

      const data: ImageGenerationResponse = await response.json();

      clearInterval(progressInterval);
      setProgress(100);

      if (data.success) {
        if (data.imageData) {
          setGeneratedImage(data.imageData);
        } else if (data.imageUrl) {
          setGeneratedImage(data.imageUrl);
        }
        setGenerationId(data.generationId || null);

        // Refresh quota info
        await fetchGenerationInfo();
      } else {
        setError(data.error || 'Image generation failed');

        // Handle specific error cases
        if (response.status === 429) {
          if (data.quotaInfo) {
            setError(`Quota exceeded. Daily remaining: ${data.quotaInfo.dailyRemaining}, Monthly remaining: ${data.quotaInfo.monthlyRemaining}`);
          } else {
            setError('Rate limit exceeded. Please wait before making another request.');
          }
        }
      }
    } catch (error) {
      clearInterval(progressInterval);
      setProgress(0);
      console.error('Request failed:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsGenerating(false);
      setTimeout(() => setProgress(0), 2000);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;

    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `generated-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isPromptValid = prompt.trim().length >= 10 && prompt.trim().length <= (generationInfo?.maxPromptLength || 1000);
  const canGenerate = quota?.canGenerate && isPromptValid && !isGenerating;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Generate Images with Gemini
          {quota && (
            <div className="flex gap-2 text-sm">
              <Badge variant="outline">
                Daily: {quota.dailyRemaining}
              </Badge>
              <Badge variant="outline">
                Monthly: {quota.monthlyRemaining}
              </Badge>
            </div>
          )}
        </CardTitle>
        {generationInfo && (
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Cost: {generationInfo.formattedCost} per image</p>
            <p>Rate limit: {generationInfo.rateLimit}</p>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Textarea
            placeholder="Describe the image you want to generate... (minimum 10 characters)"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            maxLength={generationInfo?.maxPromptLength || 1000}
            className={!isPromptValid && prompt.length > 0 ? 'border-destructive' : ''}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              {prompt.length}/{generationInfo?.maxPromptLength || 1000} characters
            </span>
            {prompt.length > 0 && (
              <span className={isPromptValid ? 'text-green-600' : 'text-destructive'}>
                {isPromptValid ? '✓ Valid' : '✗ Invalid (min 10 chars)'}
              </span>
            )}
          </div>
        </div>

        {isGenerating && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              Generating image...
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        <Button
          onClick={handleGenerate}
          disabled={!canGenerate}
          className="w-full"
          size="lg"
        >
          {isGenerating ? 'Generating...' : 'Generate Image'}
        </Button>

        {generatedImage && (
          <div className="space-y-4">
            <div className="relative group">
              <Image
                src={generatedImage}
                alt="Generated image"
                width={1024}
                height={1024}
                className="w-full rounded-lg border shadow-sm"
                unoptimized
              />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  onClick={handleDownload}
                  size="sm"
                  variant="secondary"
                  className="bg-background/80 backdrop-blur-sm"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>
            {generationId && (
              <p className="text-xs text-muted-foreground">
                Generation ID: {generationId}
              </p>
            )}
          </div>
        )}

        {!quota?.canGenerate && quota && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You have reached your generation quota.
              {quota.dailyRemaining === 0 ? ' Daily limit reached.' : ' Monthly limit reached.'}
              {quota.dailyRemaining === 0 && quota.monthlyRemaining > 0 && ' Try again tomorrow.'}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}