'use client';

import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { VideoPreviewCard } from '@/components/shared/cards/VideoPreviewCard';
import NoDataFound from '@/components/shared/common/NoDataFound';
import SideSheet from '@/components/shared/common/SideSheet';
import { VideoPlayerModal } from '@/components/shared/common/VideoPlayerModal';
import { VideoTutorialSection } from '@/components/shared/common/VideoTutorialSection';
import VideoTutorialSkeleton from '@/components/shared/skeleton/VideoTutorialSkeleton';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ROUTES, UPLOAD_PURPOSES } from '@/constants/common';
import {
  apiService,
  GetToolResponse,
  Tool,
  UpdateToolRequest,
} from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { getPresignedUrl, uploadFileToPresignedUrl } from '@/lib/upload';
import { isYouTubeUrl } from '@/utils/video';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  VIDEOS_TUTORIAL_LABELS,
  VIDEOS_TUTORIAL_MESSAGES,
  VIDEOS_TUTORIAL_SIDESHEET,
} from '../../constants';

export default function ToolVideosPage() {
  // Destructure route parameters
  const { toolUuid } = useParams();

  // Destructure hooks for cleaner access
  const { handleAuthError } = useAuth();
  const { showSuccessToast, showErrorToast } = useToast();

  // Tool data state with destructuring
  const [toolData, setToolData] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Video state management
  const [videoTutorialUrls, setVideoTutorialUrls] = useState<string[]>([]);
  const [videoTutorialLinks, setVideoTutorialLinks] = useState<string[]>([]);

  // Form state with destructuring
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [videos, setVideos] = useState<File[]>([]);
  const [videoLinks, setVideoLinks] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Stable callback functions for video state setters
  const handleVideosChange = useCallback((newVideos: File[]) => {
    setVideos(newVideos);
  }, []);

  const handleVideoLinksChange = useCallback((newVideoLinks: string[]) => {
    setVideoLinks(newVideoLinks);
  }, []);

  // Video player modal state with destructuring
  const [videoPlayerModal, setVideoPlayerModal] = useState<{
    isOpen: boolean;
    videoUrl: string;
    videoTitle: string;
    isYouTubeLink: boolean;
  }>({
    isOpen: false,
    videoUrl: '',
    videoTitle: '',
    isYouTubeLink: false,
  });

  // Destructure breadcrumb items for better readability
  const breadcrumbItems = [
    { name: 'Tools', href: ROUTES.TOOLS_MANAGEMENT },
    {
      name: toolData?.name || 'Loading...',
      href: `${ROUTES.TOOL_DETAIL}/${toolUuid}`,
    },
    { name: VIDEOS_TUTORIAL_LABELS.PAGE_TITLE },
  ];

  // Function to fetch tool details
  const fetchToolDetails = async () => {
    if (!toolUuid) return;

    try {
      setLoading(true);
      setToolData(null);
      setError(null);

      const toolResponse: GetToolResponse = await apiService.getToolDetails(
        toolUuid as string
      );

      // Destructure response for cleaner access
      const { statusCode, data, message } = toolResponse;

      if (statusCode === 200 && data) {
        setToolData(data);
        // Set video state from tool data
        setVideoTutorialUrls(data.video_tutorial_urls || []);
        setVideoTutorialLinks(data.video_tutorial_link || []);
      } else {
        setError(message || VIDEOS_TUTORIAL_MESSAGES.ERROR.FETCH_FAILED);
      }
    } catch (error: any) {
      // Destructure error for cleaner handling
      const { status, message: errorMessage } = error;

      if (status === 401) {
        handleAuthError(error);
      } else {
        setError(errorMessage || VIDEOS_TUTORIAL_MESSAGES.ERROR.FETCH_FAILED);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch tool details on component mount
  useEffect(() => {
    fetchToolDetails();
  }, [toolUuid]);

  // Memoize video data to prevent infinite re-renders
  const videoData = useMemo(() => {
    return [
      ...videoTutorialUrls.map((url, index) => ({
        url,
        title: `Video Tutorial ${index + 1}`,
        type: 'uploaded' as const,
      })),
      ...videoTutorialLinks.map((link, index) => ({
        url: link,
        title: `Video Link ${index + 1}`,
        type: 'youtube' as const,
      })),
    ].filter(video => video.url && video.url.trim() !== '');
  }, [videoTutorialUrls, videoTutorialLinks]);

  // Memoize no videos condition
  const hasNoVideos = useMemo(() => {
    const hasNoUploadedVideos = videoTutorialUrls.length === 0;
    const hasNoVideoLinks = videoTutorialLinks.length === 0;

    return hasNoUploadedVideos && hasNoVideoLinks;
  }, [videoTutorialUrls, videoTutorialLinks]);

  const uploadVideosToS3 = async (videoFiles: File[]): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    for (const video of videoFiles) {
      try {
        const ext = video.name.split('.').pop() || 'mp4';
        const timestamp = Date.now();
        const toolUuid = uuidv4();
        const generatedFileName = `tool_tutorial_${toolUuid}_${timestamp}.${ext}`;

        const presigned = await getPresignedUrl({
          fileName: generatedFileName,
          fileType: video.type,
          fileSize: video.size,
          purpose: UPLOAD_PURPOSES.TOOL_TUTORIAL,
          customPath: '',
        });

        // Destructure presigned response for cleaner access
        const { data: presignedData } = presigned;
        const { uploadUrl, fileKey } = presignedData;

        await uploadFileToPresignedUrl(uploadUrl, video);
        uploadedUrls.push(fileKey || '');
      } catch (error: any) {
        // Destructure error for cleaner handling
        const { status } = error;

        // Handle different types of errors
        if (status === 401) {
          // Handle authentication error
          handleAuthError(error);
          // Break the loop as authentication failed
          break;
        } else {
          // Handle other upload errors
          // Continue with other videos, don't add this video to uploadedUrls
        }
      }
    }

    return uploadedUrls;
  };

  const handleVideoClick = (videoUrl: string, videoTitle: string) => {
    const isYouTubeLink = isYouTubeUrl(videoUrl);
    setVideoPlayerModal({
      isOpen: true,
      videoUrl,
      videoTitle,
      isYouTubeLink,
    });
  };

  const handleDeleteVideo = async (
    videoUrl: string,
    videoType: 'uploaded' | 'youtube'
  ) => {
    if (!toolUuid || !toolData) return;

    try {
      // Determine which array to update based on video type
      let updatedVideoUrls = [...videoTutorialUrls];
      let updatedVideoLinks = [...videoTutorialLinks];

      if (videoType === 'uploaded') {
        updatedVideoUrls = videoTutorialUrls.filter(url => url !== videoUrl);
      } else {
        updatedVideoLinks = videoTutorialLinks.filter(
          link => link !== videoUrl
        );
      }

      // Prepare the update payload
      const updatePayload: UpdateToolRequest = {};

      if (updatedVideoUrls.length > 0 || videoTutorialUrls.length > 0) {
        updatePayload.video_tutorial_urls = updatedVideoUrls;
      }

      if (updatedVideoLinks.length > 0 || videoTutorialLinks.length > 0) {
        updatePayload.video_tutorial_link = updatedVideoLinks;
      }

      // Call API to update the tool
      const response = await apiService.updateTool(
        toolUuid as string,
        updatePayload
      );

      // Destructure response for cleaner access
      const { statusCode, message } = response;

      if (statusCode === 200) {
        // Update local state after successful API call
        setVideoTutorialUrls(updatedVideoUrls);
        setVideoTutorialLinks(updatedVideoLinks);

        showSuccessToast(VIDEOS_TUTORIAL_MESSAGES.SUCCESS.VIDEO_DELETED);
      } else {
        throw new Error(
          message || VIDEOS_TUTORIAL_MESSAGES.ERROR.DELETE_FAILED
        );
      }
    } catch (error: any) {
      // Destructure error for cleaner handling
      const { status, message: errorMessage } = error;

      if (status === 401) {
        handleAuthError(error);
      } else {
        showErrorToast(
          errorMessage || VIDEOS_TUTORIAL_MESSAGES.ERROR.DELETE_FAILED
        );
      }
    }
  };

  const handleAddVideos = async () => {
    if (!toolUuid || !toolData) return;

    try {
      setIsUploading(true);

      // Upload video files to S3
      const uploadedVideoUrls = await uploadVideosToS3(videos);

      // Prepare the update payload
      const updatePayload: UpdateToolRequest = {};

      // Combine existing video URLs with new uploaded videos
      if (uploadedVideoUrls.length > 0 || videoTutorialUrls.length > 0) {
        const existingUrls = videoTutorialUrls;
        const newUrls = uploadedVideoUrls;
        updatePayload.video_tutorial_urls = [...existingUrls, ...newUrls];
      }

      // Combine existing video links with new video links
      if (videoLinks.length > 0 || videoTutorialLinks.length > 0) {
        const existingLinks = videoTutorialLinks;
        const newLinks = videoLinks;
        updatePayload.video_tutorial_link = [...existingLinks, ...newLinks];
      }

      // Only update if there are new videos or links to add
      if (uploadedVideoUrls.length > 0 || videoLinks.length > 0) {
        const response = await apiService.updateTool(
          toolUuid as string,
          updatePayload
        );

        // Destructure response for cleaner access
        const { statusCode, message } = response;

        if (statusCode === 200) {
          // Update local state after successful API call
          setVideoTutorialUrls(updatePayload.video_tutorial_urls || []);
          setVideoTutorialLinks(updatePayload.video_tutorial_link || []);

          showSuccessToast(VIDEOS_TUTORIAL_MESSAGES.SUCCESS.VIDEOS_ADDED);

          // Reset form
          setVideos([]);
          setVideoLinks([]);
          setIsOpen(false);
        } else {
          throw new Error(message || 'Failed to update tool');
        }
      } else {
        showSuccessToast(VIDEOS_TUTORIAL_MESSAGES.SUCCESS.NO_VIDEOS_TO_ADD);
      }
    } catch (error: any) {
      // Destructure error for cleaner handling
      const { status, message: errorMessage } = error;

      if (status === 401) {
        handleAuthError(error);
      } else {
        showErrorToast(
          errorMessage || VIDEOS_TUTORIAL_MESSAGES.ERROR.ADD_FAILED
        );
      }
    } finally {
      setIsUploading(false);
    }
  };

  // Show skeleton while loading
  if (loading) {
    return <VideoTutorialSkeleton />;
  }

  // Show error state
  if (error) {
    return (
      <div className='space-y-4'>
        <div className='flex md:flex-row flex-col md:items-center gap-4'>
          <Breadcrumb items={breadcrumbItems} />
        </div>
        <div className='flex items-center justify-center py-8'>
          <div className='text-[var(--error)]'>{error}</div>
        </div>
      </div>
    );
  }

  // Show main content when data is loaded
  if (!toolData) {
    return <VideoTutorialSkeleton />;
  }

  return (
    <div className='space-y-4'>
      <div className='flex md:flex-row flex-col md:items-center gap-4'>
        <Breadcrumb items={breadcrumbItems} />
        <Button
          className='btn-primary px-4 py-2 ml-auto'
          onClick={() => setIsOpen(true)}
        >
          {VIDEOS_TUTORIAL_LABELS.ADD_VIDEOS}
        </Button>
      </div>

      <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl gap-3 xl:gap-6'>
        {/* Render video cards */}
        {videoData.map((video, index) => {
          const { url, title, type } = video;

          return (
            <div key={`video-${index}`} className='relative group'>
              <div
                onClick={() => handleVideoClick(url, title)}
                className='cursor-pointer'
              >
                <VideoPreviewCard
                  id={`video-${index}`}
                  videoUrl={url}
                  title={title}
                  onDelete={handleDeleteVideo}
                  videoType={type}
                />
              </div>
            </div>
          );
        })}

        {/* Show NoDataFound component if no videos */}
        {hasNoVideos && (
          <div className='col-span-full'>
            <NoDataFound
              title={VIDEOS_TUTORIAL_LABELS.NO_VIDEOS_TITLE}
              description={VIDEOS_TUTORIAL_LABELS.NO_VIDEOS_DESCRIPTION}
              buttonText={VIDEOS_TUTORIAL_LABELS.ADD_VIDEOS_BUTTON}
              onButtonClick={() => setIsOpen(true)}
              showButton={true}
              height='min-h-[40vh]'
            />
          </div>
        )}
      </div>

      <SideSheet
        open={isOpen}
        onOpenChange={open => setIsOpen(open)}
        title={`${VIDEOS_TUTORIAL_SIDESHEET.TITLE_PREFIX}${toolData?.name || 'Tool'}`}
        size={VIDEOS_TUTORIAL_SIDESHEET.SIZE}
      >
        <VideoTutorialSection
          videos={videos}
          onVideosChange={handleVideosChange}
          videoLinks={videoLinks}
          onVideoLinksChange={handleVideoLinksChange}
        />
        <div className='flex gap-3 items-center pt-4'>
          <Button
            variant='outline'
            onClick={() => setIsOpen(false)}
            className='btn-secondary'
            disabled={isUploading}
          >
            {VIDEOS_TUTORIAL_LABELS.CANCEL}
          </Button>
          <Button
            onClick={handleAddVideos}
            className='btn-primary'
            disabled={isUploading}
          >
            {isUploading
              ? VIDEOS_TUTORIAL_LABELS.ADDING
              : VIDEOS_TUTORIAL_LABELS.ADD}
          </Button>
        </div>
      </SideSheet>

      {/* Video Player Modal */}
      <VideoPlayerModal
        isOpen={videoPlayerModal.isOpen}
        videoUrl={videoPlayerModal.videoUrl}
        videoTitle={videoPlayerModal.videoTitle}
        isYouTubeLink={videoPlayerModal.isYouTubeLink}
        onClose={() =>
          setVideoPlayerModal(prev => ({ ...prev, isOpen: false }))
        }
      />
    </div>
  );
}
