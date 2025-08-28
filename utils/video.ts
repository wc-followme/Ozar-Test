// Video utility functions

export const getYouTubeThumbnail = (url: string): string => {
  // Extract video ID from YouTube URL
  const videoId = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
  )?.[1];

  if (videoId) {
    // Return high quality thumbnail
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }

  // Fallback to a default thumbnail
  return '/images/video-placeholder.png';
};

export const isYouTubeUrl = (url: string): boolean => {
  return url.includes('youtube.com') || url.includes('youtu.be');
};

export const getVideoType = (url: string): 'youtube' | 'uploaded' => {
  return isYouTubeUrl(url) ? 'youtube' : 'uploaded';
};

export const getVideoThumbnail = (url: string, cdnUrl: string): string => {
  if (isYouTubeUrl(url)) {
    return getYouTubeThumbnail(url);
  }

  // For uploaded videos, add CDN prefix
  return url.startsWith('http') ? url : `${cdnUrl}${url}`;
};
