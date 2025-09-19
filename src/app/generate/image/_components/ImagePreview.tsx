'use client';

interface ImagePreviewProps {
  imageUrl: string | null;
  alt?: string;
  onDownload?: () => void;
  onDelete?: () => void;
}

export default function ImagePreview({ 
  imageUrl, 
  alt = "Generated image", 
  onDownload, 
  onDelete 
}: ImagePreviewProps) {
  if (!imageUrl) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
        <p className="text-muted-foreground">No image generated yet</p>
      </div>
    );
  }

  return (
    <div className="relative group">
      <img
        src={imageUrl}
        alt={alt}
        className="w-full rounded-lg shadow-md"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
        {onDownload && (
          <button
            onClick={onDownload}
            className="bg-white text-black px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            Download
          </button>
        )}
        {onDelete && (
          <button
            onClick={onDelete}
            className="bg-red-500 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}