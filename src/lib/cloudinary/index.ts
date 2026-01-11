// =============================================================================
// CLOUDINARY MODULE - SUASANA
// =============================================================================
// Central export for Cloudinary utilities

// Server-side utilities (only import in server code!)
export {
  cloudinary,
  generateUploadSignature,
  deleteFromCloudinary,
  deleteMultipleFromCloudinary,
  extractPublicIdFromUrl,
  getOptimizedUrl,
} from './cloudinary-config'

// Server actions
export {
  generateCloudinarySignature,
  deleteCloudinaryFile,
  deleteCloudinaryFiles,
  deleteCloudinaryFileByUrl,
  deleteCloudinaryFilesByUrls,
} from './cloudinary-actions'

// Types
export type {
  GenerateSignatureInput,
  DeleteFileInput,
  DeleteFilesInput,
  DeleteByUrlInput,
  DeleteByUrlsInput,
} from './cloudinary-actions'
