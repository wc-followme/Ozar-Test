import MediaPreviewModal from '@/components/shared/cards/MediaPreviewModal';
import LoadingComponent from '@/components/shared/common/LoadingComponent';
import NoDataFound from '@/components/shared/common/NoDataFound';
import { PortfolioBox } from '@/components/shared/common/PortfolioBox';
import SideSheet from '@/components/shared/common/SideSheet';
import { DocumentUploadForm } from '@/components/shared/forms/DocumentUploadForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import {
  APP_CONFIG,
  CommonStatus,
  PAGINATION,
  UPLOAD_PURPOSES,
} from '@/constants/common';
import { ORGANIZATION_MESSAGES } from '@/constants/messages';
import { STATUS_CODES } from '@/constants/status-codes';
import { useDebounce } from '@/hooks/use-debounce';
import { apiService } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { Search } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getPresignedUrl,
  PresignedUrlResponse,
  uploadFileToPresignedUrl,
} from '../../../lib/upload';

// Destructure constants for better readability
const { CDN_URL } = APP_CONFIG;
const { DEFAULT_LIMIT } = PAGINATION;
const { ACTIVE } = CommonStatus;
const { USER_DOCUMENT } = UPLOAD_PURPOSES;
const { OK, CREATED } = STATUS_CODES;

// Additional constants for better maintainability
const WINDOW_TARGET = '_blank';
const MEDIA_TYPE_IMAGE = 'image';
const DEFAULT_DOCUMENT_NAME = 'Document';
const PRESIGNED_URL_ERROR = 'Failed to get presigned URL';

// Performance and UI constants
const DEBOUNCE_DELAY = 300;
const INTERSECTION_ROOT_MARGIN = '100px';
const INTERSECTION_THRESHOLD = 0.1;
const INTERSECTION_TIMEOUT = 100;
const {
  SEARCH_PLACEHOLDER,
  UPLOAD_BUTTON,
  UPLOAD_TITLE,
  SUCCESS: { DELETE: DELETE_SUCCESS, UPLOAD: UPLOAD_SUCCESS },
  ERROR: { FETCH: FETCH_ERROR, DELETE: DELETE_ERROR, UPLOAD: UPLOAD_ERROR },
} = ORGANIZATION_MESSAGES.DOCUMENT;

interface DocumentTabProps {
  userId?: number;
}

interface UserDocument {
  id: number;
  uuid: string;
  user_id: number;
  name: string;
  url: string;
  status: string;
  created_at: string;
  updated_at: string;
  created_by: number;
  updated_by: number;
}

export const DocumentTab = ({ userId }: DocumentTabProps) => {
  // State declarations
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadSheetOpen, setIsUploadSheetOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [documents, setDocuments] = useState<UserDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [_total, setTotal] = useState(0);

  // Refs for intersection observer
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Media preview modal state
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<UserDocument | null>(
    null
  );

  // Helper function to construct document URL using common constants
  const getDocumentUrl = (url: string) => {
    // If URL is already a full URL, return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    // If CDN_URL is configured, use it; otherwise use the URL as is
    return CDN_URL ? `${CDN_URL}${url}` : url;
  };

  // Utility function to detect if a file URL is a PDF
  const isPDFFile = (fileUrl: string): boolean => {
    const lowerUrl = fileUrl.toLowerCase();
    return lowerUrl.includes('.pdf') || lowerUrl.includes('application/pdf');
  };

  // Utility function to detect if a file URL is an image
  const isImageFile = (fileUrl: string): boolean => {
    const imageExtensions = [
      '.jpg',
      '.jpeg',
      '.png',
      '.gif',
      '.webp',
      '.bmp',
      '.svg',
    ];
    const lowerUrl = fileUrl.toLowerCase();
    return (
      imageExtensions.some(ext => lowerUrl.includes(ext)) ||
      lowerUrl.includes('image/')
    );
  };

  // Hook destructuring
  const { showSuccessToast, showErrorToast } = useToast();
  const { handleAuthError } = useAuth();

  // Debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery, DEBOUNCE_DELAY);

  const fetchDocuments = useCallback(
    async (targetPage = 1, append = false) => {
      if (!userId) return;

      try {
        if (targetPage === 1) {
          if (debouncedSearchQuery) {
            setIsSearching(true);
          } else {
            setIsLoading(true);
          }
        } else {
          setIsLoadingMore(true);
        }

        const response = await apiService.getUserDocuments({
          user_id: userId,
          status: ACTIVE,
          ...(debouncedSearchQuery && { search: debouncedSearchQuery }),
          page: targetPage,
          limit: DEFAULT_LIMIT,
        });

        const { data } = response;
        if (data?.documents) {
          if (append) {
            setDocuments(prev => [...prev, ...data.documents]);
          } else {
            setDocuments(data.documents);
          }
          setTotal(data.total || 0);
          setHasMore(
            data.documents.length === DEFAULT_LIMIT &&
              (data.total || 0) > documents.length + data.documents.length
          );
          setPage(targetPage);
        }
      } catch (error) {
        if (handleAuthError(error)) return;
        showErrorToast(FETCH_ERROR);
      } finally {
        setIsLoading(false);
        setIsSearching(false);
        setIsLoadingMore(false);
      }
    },
    [
      userId,
      debouncedSearchQuery,
      handleAuthError,
      showErrorToast,
      documents.length,
    ]
  );

  // Fetch documents on component mount and when search query changes
  useEffect(() => {
    if (userId) {
      fetchDocuments(1, false);
    }
  }, [userId, debouncedSearchQuery, fetchDocuments]);

  // Load more documents
  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      fetchDocuments(page + 1, true);
    }
  }, [fetchDocuments, page, hasMore, isLoadingMore]);

  // Set up intersection observer for infinite scrolling
  useEffect(() => {
    if (!hasMore || isLoadingMore) return;

    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        if (entry && entry.isIntersecting && hasMore && !isLoadingMore) {
          loadMore();
        }
      },
      {
        root: null,
        rootMargin: INTERSECTION_ROOT_MARGIN,
        threshold: INTERSECTION_THRESHOLD,
      }
    );

    observerRef.current = observer;

    // Add a small delay to ensure the DOM element is rendered
    const timeoutId = setTimeout(() => {
      if (loadMoreRef.current) {
        observer.observe(loadMoreRef.current);
      }
    }, INTERSECTION_TIMEOUT);

    return () => {
      clearTimeout(timeoutId);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoadingMore, loadMore, documents.length]);

  const handleView = (id: string) => {
    const document = documents.find(doc => doc.id.toString() === id);
    if (!document) return;

    const documentUrl = getDocumentUrl(document.url);

    if (isPDFFile(documentUrl)) {
      // For PDF files, open in new tab with iframe
      window.open(documentUrl, WINDOW_TARGET);
    } else if (isImageFile(documentUrl)) {
      // For image files, open in modal like PortfolioTab
      setSelectedDocument(document);
      setIsMediaModalOpen(true);
    } else {
      // For other file types, try to open in new tab
      window.open(documentUrl, WINDOW_TARGET);
    }
  };

  const handleDelete = async (id: string) => {
    if (!userId) return;

    try {
      const response = await apiService.deleteUserDocument(id);
      const { statusCode, message } = response;

      if (statusCode === OK) {
        showSuccessToast(message || DELETE_SUCCESS);
        // Update documents list locally instead of refetching
        setDocuments(prevDocs =>
          prevDocs.filter(doc => doc.id.toString() !== id)
        );
      }
    } catch (error) {
      if (handleAuthError(error)) return;
      const { response } = error as {
        response?: { data?: { message?: string } };
      };
      const errorMessage = response?.data?.message || DELETE_ERROR;
      showErrorToast(errorMessage);
    }
  };

  const handleUploadDocument = async (data: {
    name: string;
    file: File | null;
  }) => {
    if (!data.file || !userId) return;

    setIsUploading(true);
    try {
      // Step 1: Get presigned URL from backend
      let presignedResponse: PresignedUrlResponse;
      try {
        presignedResponse = await getPresignedUrl({
          fileName: data.file.name,
          fileType: data.file.type,
          fileSize: data.file.size,
          purpose: USER_DOCUMENT,
          customPath: '',
        });
      } catch (presignedError) {
        if (handleAuthError(presignedError)) return;
        throw presignedError;
      }

      const { data: presignedData } = presignedResponse;
      if (!presignedData?.['uploadUrl']) {
        throw new Error(PRESIGNED_URL_ERROR);
      }

      // Step 2: Upload file directly to cloud storage using presigned URL
      await uploadFileToPresignedUrl(presignedData['uploadUrl'], data.file);

      // Step 3: Create document record with backend
      const createResponse = await apiService.createUserDocument({
        user_id: userId,
        name: data.name,
        url: presignedData['fileKey'],
      });

      const { statusCode, message } = createResponse;
      if (statusCode === CREATED) {
        showSuccessToast(message || UPLOAD_SUCCESS);
        // Close sheet after successful upload
        setIsUploadSheetOpen(false);
        // Add new document to list locally instead of refetching
        const { data: createdDocument } = createResponse;
        if (createdDocument) {
          setDocuments(prevDocs => [createdDocument, ...prevDocs]);
        }
      }
    } catch (error) {
      if (handleAuthError(error)) return;
      const { response, message } = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const errorMessage = response?.data?.message || message || UPLOAD_ERROR;
      showErrorToast(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancelUpload = () => {
    setIsUploadSheetOpen(false);
  };

  // Prepare media items for the modal (for images)
  const getMediaItems = (document: UserDocument) => {
    const documentUrl = getDocumentUrl(document.url);
    return [
      {
        id: document.id.toString(),
        type: MEDIA_TYPE_IMAGE,
        src: documentUrl,
        thumbnail: documentUrl,
      },
    ];
  };

  return (
    <div className='space-y-6'>
      <div className='flex md:flex-row flex-col items-center gap-4'>
        <div className='relative w-full sm:max-w-[360px]'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)]' />
          <Input
            placeholder={SEARCH_PLACEHOLDER}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className='pl-10 pr-4 w-full h-[42px] border-2 border-[var(--border-dark)] rounded-[30px]'
          />
        </div>
        <Button
          className='btn-primary ml-auto'
          onClick={() => setIsUploadSheetOpen(true)}
        >
          {UPLOAD_BUTTON}
        </Button>
      </div>

      <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl gap-3 xl:gap-6'>
        {isLoading || isSearching ? (
          <div className='col-span-full flex justify-center items-center py-8'>
            <div className='text-center'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2'></div>
              <p className='text-sm text-gray-500'>
                {isSearching ? 'Searching...' : 'Loading documents...'}
              </p>
            </div>
          </div>
        ) : documents.length > 0 ? (
          <>
            {documents.map(doc => {
              const { id, name, url } = doc;
              // Determine if the document is a PDF based on URL or name
              const isPDFFile =
                url.toLowerCase().includes('.pdf') ||
                name.toLowerCase().endsWith('.pdf');

              return (
                <PortfolioBox
                  key={id}
                  id={doc.id.toString()}
                  image={getDocumentUrl(url)}
                  title={doc.name}
                  isPDF={isPDFFile}
                  onView={() => handleView(id.toString())}
                  onEdit={() => {}}
                  onDelete={handleDelete}
                  showEditMenu={true}
                  showDeleteOnly={true}
                />
              );
            })}

            {/* Infinite scroll trigger element */}
            {hasMore && (
              <div
                ref={loadMoreRef}
                className='col-span-full flex justify-center pt-4'
              >
                {isLoadingMore && (
                  <div className='text-center py-4'>
                    <LoadingComponent variant='inline' size='md' text='' />
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className='col-span-full'>
            <NoDataFound
              title='No documents found'
              description={
                searchQuery
                  ? `No documents match "${searchQuery}"`
                  : "You haven't uploaded any documents yet"
              }
            />
          </div>
        )}
      </div>

      {/* Document Upload Side Sheet */}
      <SideSheet
        open={isUploadSheetOpen}
        onOpenChange={setIsUploadSheetOpen}
        title={UPLOAD_TITLE}
        size='600px'
      >
        <DocumentUploadForm
          onSubmit={handleUploadDocument}
          onCancel={handleCancelUpload}
          isSubmitting={isUploading}
        />
      </SideSheet>

      {/* Media Preview Modal for Images */}
      <MediaPreviewModal
        open={isMediaModalOpen}
        onOpenChange={setIsMediaModalOpen}
        projectName={selectedDocument?.name || DEFAULT_DOCUMENT_NAME}
        mediaItems={selectedDocument ? getMediaItems(selectedDocument) : []}
      />
    </div>
  );
};
