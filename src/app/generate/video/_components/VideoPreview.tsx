'use client';

interface VideoPreviewProps {
  videoUrl: string | null;
  title?: string;
  onDownload?: () => void;
  onDelete?: () => void;
}

export default function VideoPreview({ 
  videoUrl, 
  title = "Generated video", 
  onDownload, 
  onDelete 
}: VideoPreviewProps) {
  if (!videoUrl) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
        <p className="text-muted-foreground">No video generated yet</p>
      </div>
    );
  }

  return (
    <div className="relative group">
      <video
        src={videoUrl}
        controls
        className="w-full rounded-lg shadow-md"
        title={title}
      />
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity space-x-2">
        {onDownload && (
          <button
            onClick={onDownload}
            className="bg-black bg-opacity-70 text-white p-2 rounded-full hover:bg-opacity-90 transition-colors"
            title="Download video"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
        )}
        {onDelete && (
          <button
            onClick={onDelete}
            className="bg-red-500 bg-opacity-70 text-white p-2 rounded-full hover:bg-opacity-90 transition-colors"
            title="Delete video"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}