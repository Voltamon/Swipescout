# Video Edit and Archive Implementation

## Summary

This document describes the implementation of proper video processing flow and video archiving/versioning feature in the VideoEditPage.

## Issues Fixed

### 1. **Premature Preview Dialog Opening**
**Problem:** The preview dialog was opening immediately when "Process Locally" button was clicked, even before video processing completed, showing "Unprocessed Edits" warning.

**Solution:** 
- Removed the premature dialog opening when FFmpeg isn't loaded
- Instead of opening a "live preview", now shows an error toast asking user to use "Process on Server" or wait for FFmpeg to load
- Preview dialog now only opens after actual processing completes successfully
- Changed timeout from 200ms to 300ms with proper async/await to ensure state updates before dialog opens

### 2. **Video Replacement Flow**
**Problem:** Complex flow that involved uploading a new video, updating the old video's data, then deleting the temporary video. No versioning or archive of old content.

**Solution:** Implemented a new backend API endpoint and simplified frontend flow.

## Backend Changes

### New API Endpoint: `POST /api/videos/:id/archive-and-replace`

**Location:** `src/routes/video.routes.ts`

**Purpose:** Archives the old video content and replaces it with new content in a single atomic operation.

**Request Body:**
```json
{
  "videoUrl": "https://cloudinary.com/new-video-url",
  "videoTitle": "Updated Video Title",
  "hashtags": ["tag1", "tag2"],
  "videoDuration": 120,
  "cloudinaryPublicId": "video_abc123",
  "fileSize": 5242880,
  "thumbnail": "https://cloudinary.com/thumbnail-url"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Video archived and replaced successfully",
  "video": {
    "id": "original-video-id",
    "videoUrl": "new-video-url",
    "videoTitle": "Updated Video Title",
    ...
  },
  "archivedVideo": {
    "id": "new-archived-video-id",
    "videoTitle": "[ARCHIVED] Original Video Title",
    "status": "old",
    ...
  }
}
```

### Service Method: `VideoProcessingService.archiveAndReplaceVideo()`

**Location:** `src/services/video-processing.service.ts`

**What it does:**
1. Finds the original video by ID and verifies user ownership
2. Creates a complete copy of the original video record
3. Marks the copy as "ARCHIVED" (prefixes title with "[ARCHIVED]")
4. Sets status to "old" or "archived" 
5. Updates the original video record with new data
6. All operations happen in a database transaction (atomic)
7. Awards points for video update

### Controller Method: `VideoController.archiveAndReplaceVideo()`

**Location:** `src/controllers/video.controller.ts`

**Responsibilities:**
- Authentication check
- Validates required fields (videoUrl is mandatory)
- Calls service method
- Returns success response with both original and archived video data

## Frontend Changes

### 1. **VideoEditPage.jsx - Process Video Logic**

**Changes in `handleProcessVideo()`:**
- Removed the premature dialog opening when FFmpeg isn't loaded
- Now shows error toast instead: "FFmpeg is not loaded. Please use 'Process on Server' or wait for FFmpeg to load."
- Increased state update delay from 200ms to 300ms with proper async/await
- Better success toast with title and duration

### 2. **VideoEditPage.jsx - Upload/Replace Flow**

**Changes in `handleUploadProcessedVideo()`:**

**Old Flow (Complex):**
1. Upload new video → Get new video ID
2. Poll for upload completion
3. Update old video with new video's URL
4. Delete the temporary new video entry
5. Risk of orphaned videos if steps fail

**New Flow (Simplified):**
1. Upload new video → Get new video ID
2. Poll for upload completion
3. Call `archiveAndReplaceVideo(oldVideoId, newVideoData)` → Backend handles archiving and updating atomically
4. Delete the temporary new video entry
5. Much cleaner, safer, and provides version history

### 3. **API Service**

**New export in `src/services/api.js`:**
```javascript
export const archiveAndReplaceVideo = (id, newVideoData) => 
  api.post(`/videos/${id}/archive-and-replace`, newVideoData);
```

## Benefits

### 1. **Better User Experience**
- No confusing "Unprocessed Edits" dialog appearing before processing
- Clear error messages when processing isn't available
- Proper loading states and progress indicators

### 2. **Version Control**
- Every video replacement creates an archived copy
- Old versions are marked with "[ARCHIVED]" prefix
- Status set to "old" or "archived" for easy filtering
- Complete history of video changes

### 3. **Data Safety**
- Atomic operations - either everything succeeds or everything rolls back
- No risk of losing video data during updates
- Archived videos can be retrieved if needed

### 4. **Simplified Code**
- Reduced complexity in frontend upload flow
- Backend handles all archiving logic
- Single API call instead of multiple update/delete operations

### 5. **Extensibility**
- Easy to add features like:
  - "View archived versions" page
  - "Restore from archive" functionality
  - Archive cleanup policies (delete archives older than X days)
  - Version comparison

## Usage

### For Users:
1. Select a video from library in Video Edit Page
2. Apply edits (trim, filters, etc.)
3. Click "Process Locally" - wait for processing to complete
4. Preview dialog opens after processing completes
5. Click "Replace" button
6. Old version is automatically archived
7. New version takes the original video's ID and position

### For Developers:
```javascript
// Simple API call to archive and replace
const result = await archiveAndReplaceVideo(videoId, {
  videoUrl: newVideoUrl,
  videoTitle: newTitle,
  hashtags: ['updated', 'tags'],
  videoDuration: 150,
  cloudinaryPublicId: 'new_public_id',
  fileSize: 6291456,
  thumbnail: thumbnailUrl
});

console.log('Updated video:', result.data.video);
console.log('Archived old version:', result.data.archivedVideo);
```

## Future Enhancements

1. **Archive Management Page**
   - View all archived versions of a video
   - Compare versions side-by-side
   - Restore a previous version

2. **Archive Policies**
   - Auto-delete archives older than 30/60/90 days
   - Limit number of archived versions per video
   - Archive compression for storage optimization

3. **Enhanced Metadata**
   - Track who made each update
   - Record reason for update
   - Changelog/notes for each version

4. **Notifications**
   - Notify video owner when their video is replaced
   - Weekly summary of archived videos

## Testing Checklist

- [x] Preview dialog opens only after processing completes
- [x] FFmpeg not loaded shows error instead of opening dialog
- [x] Archive API creates archived copy successfully
- [x] Archived video has "[ARCHIVED]" prefix
- [x] Original video ID remains unchanged after replacement
- [x] Old video URL is preserved in archived record
- [x] New video URL updates in original record
- [x] Temporary uploaded video is deleted after archiving
- [x] Database transaction rolls back on error
- [x] Points are awarded for video update
- [ ] Archived videos appear in filtered views (requires UI update)
- [ ] Unauthorized users cannot archive others' videos

## Notes

- Archived videos remain in the database but can be filtered by status
- The `videoTitle` field gets "[ARCHIVED]" prefix to distinguish old versions
- All metadata from the original video is preserved in the archived copy
- The original video keeps its ID, URL references, likes, comments, etc.
