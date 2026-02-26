# VidChemy
Transforms a single influencer promo video into complete, Amazon-ready product listings - in minutes, not hours.

## Key Features
- **Video Analysis Pipeline**: Automatically processes uploaded influencer promo videos to detect products, extract key frames as listing images, and transcribe narration via speech-to-text
- **NLP Content Generation**: Creates SEO-optimized product titles, bullet points, descriptions, and A+ content from video dialogue and visual cues-tailored for high search rankings
- **Multi-Language Support**: Handles Hindi and English audio natively, perfect for India's diverse creator base.
- **7x Time Savings**: Reduces 5+ hours of manual listing creation to under 5 minutes per product.

## How It Works
- **Video Upload**: Simply drop in your short-form promotional video (Reels/Shorts) to start the pipeline.
- **Smart Frame Extraction**: Gemini AI analyzes visual and audio context to pinpoint the single best product moment, driving our custom execution logic to surgically extract a high-resolution frame via FFmpeg.
- **Audio Intelligence**: Integrated Speech-to-Text and NLP pull product names, key features, and sentiment directly from the influencer's narration.
- **Auto-SEO Generation**: Automatically generates Amazon/Flipkart-optimized product titles, bullet points, descriptions, and high-ranking keywords.
- **Marketplace Ready**: Exports a complete, structured datapackage containing the perfect product image and all metadata, ready for instant listing.

## Tech Stack

### Frontend
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Axios](https://img.shields.io/badge/axios-%235A29E4.svg?style=for-the-badge&logo=axios&logoColor=white)

### Backend
![NodeJS](https://img.shields.io/badge/node.js-%2343853D.svg?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/mongodb-%2300f.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/mongoose-52B0E7?style=for-the-badge&logo=mongoose&logoColor=white)
![FFmpeg](https://img.shields.io/badge/FFmpeg-%2300599C.svg?style=for-the-badge&logo=ffmpeg&logoColor=white)

### Cloud & AI
![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)
![AWS Lambda](https://img.shields.io/badge/AWS%20Lambda-FF9900?style=for-the-badge&logo=AWS%20Lambda&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=google%20bard&logoColor=white)

## Architecture Diagram
![Architecture](https://res.cloudinary.com/dvk80x6fi/image/upload/v1772086534/1._tbhg4o.jpg)

> ⚠️ **Note to Judges: Hackathon Prototype vs. Production Architecture**
> 
> The architecture diagram above represents the **ideal, cloud-native production state** of VidChemy using AWS Step Functions, serverless Lambdas, and SQS. 
>
> **Our Current Hackathon Implementation:**
> To optimize for rapid execution and local debugging during the 7-day sprint, we implemented the "Async Workflow Engine" using a robust, decoupled containerized approach that mirrors the exact same event-driven principles:
> * **The API Application (`src/api/`):** A lightweight Express.js container that handles file ingestion to S3, drops a job into a Redis queue, and immediately returns a `PENDING` status to the client so the frontend never blocks.
> * **The Worker Application (`src/worker/`):** An always-on Node.js container (using BullMQ) equipped with local `FFmpeg`. It securely pulls jobs from Redis, executes the heavy video frame extraction, and orchestrates the synchronous API calls to AWS Rekognition, Transcribe, and Gemini RAG. 
> 
> This approach proves the core asynchronous concept and maintains system reliability, while avoiding the time-sink of complex AWS VPC/IAM configurations during the hackathon.
>
> **Future Roadmap to Production:**
> 1. Migrate the local Redis/BullMQ queue to **AWS SQS**.
> 2. Transition the Express API to **AWS API Gateway + Lambda**.
> 3. Refactor the Node.js worker logic into an **AWS Step Functions** state machine, utilizing **AWS ECS (Fargate)** for the heavy FFmpeg frame extraction tasks.

## Folder Structure

```
frontend/ 

backend/
│
├── src/
│   ├── api/                    # APP 1: The Main API Server (Fast, HTTP only)
│   │   ├── controllers/        # Handles upload requests & status checks
│   │   ├── routes/             # Express API routes (e.g., /upload, /status/:id)
│   │   └── server.js           # Express app setup and start script
│   │
│   ├── worker/                 # APP 2: The Always-On Worker (Heavy lifting)
│   │   ├── jobs/               # The BullMQ job processor logic
│   │   ├── services/           # External API logic
│   │   └── worker.js           # Initializes BullMQ and listens to Redis
│   │
│   └── shared/                 # Code used by BOTH the API and the Worker
│       ├── config/             # DB, Redis, Queues and S3 connection setups
│       ├── models/             # Mongodb database schemas/queries
│       └── utils/              # Helper functions (e.g., rate limiters)
│
├── .env                        # Environment variables (DB credentials, API keys)
├── .gitignore                  # Ignore node_modules, local videos, etc.
├── Dockerfile.worker           # Builds the Node + ffmpeg container
├── Dockerfile.api              # Builds the standard Node container
├── docker-compose.yml          # Bootstraps local Redis and MySQL for development
└── package.json                # Dependencies (Express, BullMQ, AWS SDK, etc.)
```
