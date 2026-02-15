# Requirements Document

## Introduction

The Video-to-Listing Pipeline is an AI-powered platform that transforms influencer promotional videos into complete, marketplace-ready product listings. The system addresses the inefficiency in India's influencer marketing space where creators spend 3-5 hours per product photo and 2-3 hours on descriptions, with 90% failing at SEO optimization. By processing a single video (max 60 seconds), the platform automatically extracts optimal product frames, generates SEO-optimized metadata, and produces Amazon/Flipkart-ready listings in minutes.

## Glossary

- **Video_Upload_Service**: Frontend component that handles video file selection and upload initiation
- **Validation_Service**: Component that validates video format, duration, and size constraints
- **S3_Storage**: AWS S3 buckets for storing input videos and output product images
- **Job_Manager**: Backend service that creates and manages job records in the database
- **Processing_Pipeline**: Lambda-based async workflow orchestrating AI services
- **Rekognition_Service**: AWS Rekognition for object/label detection with timestamps
- **Transcribe_Service**: AWS Transcribe for speech-to-text conversion
- **Smart_Filter**: Gemini AI component that identifies optimal product visibility timestamp
- **Frame_Extractor**: FFmpeg-based service that extracts frames at specific timestamps
- **Content_Engine**: Gemini AI component that generates SEO-optimized product metadata
- **Status_API**: Backend endpoint for client polling of job status
- **Database**: MySQL database storing jobs, products, and product images
- **User_Hint**: Text input from user describing the target product (e.g., "Red Sneakers")
- **Debug_Stage**: Internal tracking field indicating which processing stage a job is in
- **Product_Metadata**: Generated content including title, description, keywords, and bullet points

## Requirements

### Requirement 1: Video Upload and Validation

**User Story:** As an influencer, I want to upload my promotional video with a product hint, so that the system can process it and generate product listings.

#### Acceptance Criteria

1. WHEN a user selects a video file, THE Validation_Service SHALL verify the file format is MP4 or MOV
2. WHEN a user selects a video file, THE Validation_Service SHALL verify the video duration does not exceed 60 seconds
3. WHEN a user selects a video file, THE Validation_Service SHALL verify the file size does not exceed 50MB
4. WHEN validation fails, THE Video_Upload_Service SHALL display a descriptive error message and prevent upload
5. WHEN a user provides a User_Hint, THE Validation_Service SHALL verify it is a non-empty string
6. WHEN all validations pass, THE Video_Upload_Service SHALL upload the video to the S3_Storage input bucket
7. WHEN upload completes, THE Job_Manager SHALL create a job record with status PROCESSING

### Requirement 2: Job Record Management

**User Story:** As a system administrator, I want job records to track processing state and errors, so that I can monitor system health and debug failures.

#### Acceptance Criteria

1. WHEN a job is created, THE Job_Manager SHALL store the video S3 URL, User_Hint, status, and timestamps
2. WHEN a job is created, THE Job_Manager SHALL initialize status to PROCESSING
3. WHEN a job is created, THE Job_Manager SHALL initialize debug_stage to null
4. WHEN processing begins, THE Job_Manager SHALL update debug_stage to reflect the current processing stage
5. WHEN a job completes successfully, THE Job_Manager SHALL update status to SUCCESS
6. WHEN a job fails, THE Job_Manager SHALL update status to FAILED and store the error_message
7. THE Job_Manager SHALL maintain created_at and updated_at timestamps for all job records

### Requirement 3: Object and Label Detection

**User Story:** As a system, I want to detect all objects and labels in the video with timestamps, so that I can identify when the target product is most visible.

#### Acceptance Criteria

1. WHEN a video is uploaded to S3_Storage, THE Processing_Pipeline SHALL trigger the Rekognition_Service
2. WHEN processing starts, THE Job_Manager SHALL update debug_stage to STAGE_REKOGNITION
3. THE Rekognition_Service SHALL analyze the entire video and detect all objects and labels
4. THE Rekognition_Service SHALL associate each detected object with a timestamp
5. THE Rekognition_Service SHALL return detection results with confidence scores
6. IF Rekognition_Service fails, THEN THE Job_Manager SHALL update status to FAILED with error_message

### Requirement 4: Speech-to-Text Transcription

**User Story:** As a system, I want to transcribe all speech in the video, so that I can use verbal product descriptions to improve product identification and metadata generation.

#### Acceptance Criteria

1. WHEN Rekognition_Service completes, THE Processing_Pipeline SHALL trigger the Transcribe_Service
2. WHEN transcription starts, THE Job_Manager SHALL update debug_stage to STAGE_TRANSCRIBE
3. THE Transcribe_Service SHALL convert all speech in the video to text
4. THE Transcribe_Service SHALL associate transcribed text with timestamps
5. THE Transcribe_Service SHALL return the complete transcript
6. IF Transcribe_Service fails, THEN THE Job_Manager SHALL update status to FAILED with error_message

### Requirement 5: Smart Product Identification

**User Story:** As a system, I want to identify the optimal timestamp where the target product is most visible, so that I can extract the best frame for product listing.

#### Acceptance Criteria

1. WHEN Transcribe_Service completes, THE Processing_Pipeline SHALL trigger the Smart_Filter
2. WHEN smart filtering starts, THE Job_Manager SHALL update debug_stage to STAGE_GEMINI_FILTER
3. THE Smart_Filter SHALL analyze Rekognition_Service results, Transcribe_Service transcript, and User_Hint
4. THE Smart_Filter SHALL identify the single best timestamp where the target product is most visible
5. THE Smart_Filter SHALL return the optimal timestamp in seconds
6. IF Smart_Filter fails, THEN THE Job_Manager SHALL update status to FAILED with error_message

### Requirement 6: Frame Extraction

**User Story:** As a system, I want to extract the video frame at the optimal timestamp, so that I can use it as the product image for the listing.

#### Acceptance Criteria

1. WHEN Smart_Filter returns a timestamp, THE Processing_Pipeline SHALL trigger the Frame_Extractor
2. WHEN frame extraction starts, THE Job_Manager SHALL update debug_stage to STAGE_FFMPEG
3. THE Frame_Extractor SHALL extract the frame at the exact timestamp provided by Smart_Filter
4. THE Frame_Extractor SHALL save the extracted frame as a high-quality image to S3_Storage output bucket
5. THE Frame_Extractor SHALL return the S3 URL of the extracted image
6. IF Frame_Extractor fails, THEN THE Job_Manager SHALL update status to FAILED with error_message

### Requirement 7: SEO-Optimized Metadata Generation

**User Story:** As an influencer, I want SEO-optimized product metadata generated automatically, so that my listings rank well on Amazon and Flipkart without manual optimization.

#### Acceptance Criteria

1. WHEN Frame_Extractor completes, THE Processing_Pipeline SHALL trigger the Content_Engine
2. WHEN content generation starts, THE Job_Manager SHALL update debug_stage to STAGE_GEMINI_CONTENT
3. THE Content_Engine SHALL analyze the extracted frame, transcript, and User_Hint
4. THE Content_Engine SHALL generate a product title optimized for marketplace search
5. THE Content_Engine SHALL generate a detailed product description
6. THE Content_Engine SHALL generate relevant keywords for SEO
7. THE Content_Engine SHALL generate bullet points highlighting product features
8. IF Content_Engine fails, THEN THE Job_Manager SHALL update status to FAILED with error_message

### Requirement 8: Product Data Persistence

**User Story:** As a system, I want to store generated product data and images in the database, so that users can retrieve their listings later.

#### Acceptance Criteria

1. WHEN Content_Engine completes, THE Job_Manager SHALL create a product record linked to the job
2. THE Database SHALL store product title, description, keywords, and bullet_points in the products table
3. THE Database SHALL create a product_images record with the S3 URL and frame_timestamp
4. THE Database SHALL link product_images to the product via product_id foreign key
5. WHEN all data is persisted, THE Job_Manager SHALL update job status to SUCCESS
6. IF database operations fail, THEN THE Job_Manager SHALL update status to FAILED with error_message

### Requirement 9: Status Polling and Response

**User Story:** As an influencer, I want to check the processing status of my video, so that I know when my product listing is ready.

#### Acceptance Criteria

1. THE Status_API SHALL accept job status requests with a job identifier
2. WHEN a status request is received, THE Status_API SHALL query the Database for the job record
3. WHEN status is PROCESSING, THE Status_API SHALL return status PROCESSING
4. WHEN status is SUCCESS, THE Status_API SHALL return status SUCCESS with product metadata and image URLs
5. WHEN status is FAILED, THE Status_API SHALL return status FAILED with error_message
6. THE Status_API SHALL respond within 500ms for any status query
7. WHEN a job does not exist, THE Status_API SHALL return an error indicating invalid job identifier

### Requirement 10: Error Handling and Recovery

**User Story:** As a system administrator, I want comprehensive error tracking, so that I can identify and resolve processing failures quickly.

#### Acceptance Criteria

1. WHEN any service in the Processing_Pipeline fails, THE Job_Manager SHALL immediately update status to FAILED
2. WHEN a failure occurs, THE Job_Manager SHALL record the debug_stage indicating which service failed
3. WHEN a failure occurs, THE Job_Manager SHALL store a descriptive error_message
4. THE error_message SHALL include sufficient detail to diagnose the failure without exposing sensitive data
5. WHEN a job fails, THE Processing_Pipeline SHALL halt all subsequent processing stages
6. THE Job_Manager SHALL ensure database transactions are atomic to prevent partial data corruption

### Requirement 11: Single Product Constraint

**User Story:** As a system, I want to process exactly one product per video, so that the MVP remains focused and manageable.

#### Acceptance Criteria

1. THE Smart_Filter SHALL use the User_Hint to prioritize the target product when multiple products are detected
2. THE Smart_Filter SHALL return exactly one optimal timestamp per video
3. THE Frame_Extractor SHALL extract exactly one frame per video
4. THE Content_Engine SHALL generate metadata for exactly one product per video
5. THE Database SHALL store exactly one product record per successful job

### Requirement 12: Asynchronous Processing Architecture

**User Story:** As a system architect, I want video processing to be asynchronous, so that the system can handle multiple concurrent uploads without blocking.

#### Acceptance Criteria

1. WHEN a video is uploaded to S3_Storage, THE Processing_Pipeline SHALL be triggered via Lambda
2. THE Processing_Pipeline SHALL use SQS for message queuing between processing stages
3. THE Video_Upload_Service SHALL return immediately after creating the job record without waiting for processing
4. THE Processing_Pipeline SHALL process jobs independently without blocking other jobs
5. WHEN processing completes, THE Job_Manager SHALL update the job status atomically
