# VidChemy 🎬⚗️

> **From Video to Amazon Best-Seller - in Minutes.**

VidChemy is an AI-powered pipeline that transforms short-form influencer promotional videos (Instagram Reels) into fully optimized, marketplace-ready e-commerce product listings - automatically.

No manual photo shoots. No hours of copywriting. No fragmented tools. Just paste a Reel URL, pick a product category, and let the AI do the rest.

---

## Demo

- 🎬 [Watch Demo Video](https://youtu.be/KcAcJ8viZvM)

---

## 📌 Table of Contents

- [The Problem](#the-problem)
- [The Solution](#the-solution)
- [Key Features](#key-features)
- [How It Works](#how-it-works)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Clone the Repository](#clone-the-repository)
  - [Frontend Setup](#frontend-setup)
  - [Backend Setup](#backend-setup)
  - [AI Prompts Configuration](#ai-prompts-configuration)
  - [Running with Docker](#running-with-docker)
- [Project Structure](#project-structure)
- [Performance Benchmarks](#performance-benchmarks)
- [Cost Overview](#cost-overview)
- [Roadmap](#roadmap)

---

## The Problem

The global influencer marketing space is projected to hit **$40 billion USD** by 2026 (30%+ CAGR), yet only 7–10% of creators effectively monetize their content through merchandise.

**Why?** Because turning a great promo video into a live product listing is painfully slow:

- **3–5 hours** per product photo (shooting + editing)
- **2–3 hours** writing descriptions manually
- **90% of sellers fail** on Amazon/Flipkart without proper SEO
- **4–6 fragmented tools** needed to complete one listing
- Delays cost creators their viral momentum - and their revenue

---

## The Solution

VidChemy collapses the entire listing creation workflow into a **single AI-powered pipeline**:

```
Instagram Reel URL  ──►  AI Pipeline  ──►  Marketplace-Ready Listing
     (seconds)                                  (titles, images, SEO)
```

What used to take **5+ hours** now takes **under 5 minutes**.

---

## Key Features

| Feature | Description |
|---|---|
| **Video Analysis Pipeline** | Detects products, extracts optimal frames, transcribes narration via speech-to-text |
| **Automated Image Enhancement** | AI background removal produces clean, studio-quality 1:1 product images |
| **NLP Listing Generation** | SEO-optimized titles, bullet points, descriptions, and A+ content tuned for the Amazon A9 algorithm |
| **Competitor & Sentiment Analysis** | Scrapes top Amazon/Flipkart listings and analyzes review sentiment to inform your copy |
| **Multi-Language Support** | Handles Hindi and English audio natively |
| **Marketplace Export** | Structured listing data ready for instant publishing to Amazon or Flipkart Seller Central |

---

## How It Works

```
1. Upload Reel      → User pastes Instagram Reel URL + selects product category
2. Ingest & Validate → AWS S3 upload + Bedrock Video Analysis filters for relevance/safety
3. Parallel Processing:
      ├─ FFmpeg extracts best product frames (Bedrock-identified timestamps)
      ├─ AWS Transcribe converts audio narration to text
      ├─ Scraper fetches top Amazon competitor listings
      └─ Perplexity gathers additional product context
4. AI Enhancement   → AWS Bedrock Titan removes background → clean product image → S3
5. Listing Generation → AWS Bedrock Nova Pro synthesizes all context → SEO-optimized listing
6. Save & Deliver   → Final listing stored in MongoDB, served to dashboard instantly
```

---

## Tech Stack

### Frontend
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-38B2AC?style=flat&logo=tailwind-css)
![Redux](https://img.shields.io/badge/Redux-593D88?style=flat&logo=redux)

### Backend
![NodeJS](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat&logo=redis)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker)
![FFmpeg](https://img.shields.io/badge/FFmpeg-007808?style=flat&logo=ffmpeg)

### AWS Services
![Bedrock](https://img.shields.io/badge/AWS_Bedrock-FF9900?style=flat&logo=amazon-aws)
![S3](https://img.shields.io/badge/AWS_S3-569A31?style=flat&logo=amazon-s3)
![EC2](https://img.shields.io/badge/AWS_EC2-FF9900?style=flat&logo=amazon-ec2)
![Transcribe](https://img.shields.io/badge/AWS_Transcribe-FF9900?style=flat&logo=amazon-aws)
![CloudFront](https://img.shields.io/badge/AWS_CloudFront-FF9900?style=flat&logo=amazon-aws)

### External APIs
- **Perplexity AI** - Product research & context gathering
- **RapidAPI (Instagram)** - Reel metadata scraping
- **HasData API** - Amazon listing scraping
- **BullMQ** - Distributed worker queue management

---

## Architecture

VidChemy runs on a **distributed worker architecture** fully hosted on AWS:

![VidChemy System Architecture Diagram](https://res.cloudinary.com/dvk80x6fi/image/upload/v1773211806/hi_jxashr.jpg)  

---

## Getting Started

### Prerequisites

- Node.js `v18+`
- Docker & Docker Compose
- AWS account with access to: S3, EC2, Bedrock (Nova Pro + Titan), Transcribe, CloudFront
- API keys for: RapidAPI (Instagram), HasData, Perplexity

### Clone the Repository

```bash
git clone -b new-ui https://github.com/aayushsingh7/vidchemy.git
cd vidchemy
```

---

### Frontend Setup

```bash
cd frontend
```

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:4000
VITE_SOCKET_URL=http://localhost:4000
```

Install dependencies and run:

```bash
npm install

# Development
npm run dev

# Production preview
npm run build
npm run preview
```

---

### Backend Setup

```bash
cd backend
```

Create a `.env` file in the `backend/` directory:

```env
NODE_ENV="development"

PORT=4000
MONGO_URI=your_mongodb_connection_string

# Use redis://localhost:6379 for local, redis://redis:6379 for Docker
REDIS_URI=redis://redis:6379

# AWS Credentials
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_S3_BUCKET_NAME=your_s3_bucket_name
AWS_REGION=your_aws_region

# External APIs
RAPID_API_KEY=your_rapidapi_key
RAPID_API_INSTAGRAM_HOST=instagram-reels-downloader-api.p.rapidapi.com

HAS_DATA_API_KEY=your_hasdata_key
HAS_DATA_API_URL=https://api.hasdata.com/scrape/amazon

PERPLEXITY_API_KEY=your_perplexity_key

CLOUD_FRONT_URL=your_cloudfront_distribution_url
```

---

### AI Prompts Configuration

Create an `ai-prompts.private.js` file in the `backend/` root directory. This is the **brain of the AI pipeline** — it defines the system/user prompts and response schemas for each AI stage.

```javascript
// backend/ai-prompts.private.js

export const BEDROCK_VIDEO_ANALYSIS = {
  system: "System Prompt Here",
  user: ({ productType, title, description }) => {
    return "User Prompt Here";
  },
  responseSchema: {},
};

export const PERPLEXITY_PRODUCT_RESEARCH = {
  system: "System Prompt Here",
  user: ({ website, productName, additionalContext }) => {
    return "User Prompt Here";
  },
  responseSchema: {},
};

export const BEDROCK_LISTING_GENERATION = {
  system: "System Prompt Here",
  user: ({ referenceProducts, originalProduct }) => {
    return "User Prompt Here";
  },
  responseSchema: {},
};
```

> **Tip:** The quality of your prompts directly determines listing quality. Tune the system prompts to be specific about the marketplace format (Amazon A9 vs Flipkart), SEO keyword density, and desired tone for your target audience.

---

### Running with Docker

From the `backend/` directory, start all services (API server, ingestion worker, process worker, Redis) with a single command:

```bash
docker compose up --build
```

This spins up:
- `api` — Express REST + WebSocket server
- `ingestion-worker` — Handles video upload queue
- `process-worker` — Handles AI processing pipeline
- `redis` — Message queue broker

---

## Project Structure

```
vidchemy/
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/        # Reusable UI components
│       ├── layouts/           # Page layout wrappers
│       ├── pages/             # Route-level page components
│       ├── context/           # React context providers
│       └── hooks/             # Custom React hooks
│   ├── .env
│   └── package.json
│
└── backend/
    ├── src/
    │   ├── api/               # Express server (controllers, services, routes)
    │   ├── worker/            # BullMQ workers + worker-internal services
    │   └── shared/            # Models, shared utils, configs, shared services
    ├── Dockerfile.api
    ├── Dockerfile.ingestion.worker
    ├── Dockerfile.process.worker
    ├── docker-compose.yaml
    ├── ai-prompts.private.js  # ⚠️ You must create this (not committed to git)
    ├── .env                   # ⚠️ You must create this (not committed to git)
    └── package.json
```

---

## Performance Benchmarks

### Processing Speed

Tested on a single **AWS EC2 t3.medium** (2 vCPU, 4GB RAM) with 10–20 simulated concurrent uploads:

| Processing Stage | Handled By | Avg. Duration |
|---|---|---|
| Raw S3 Upload | Ingestion Worker | ~3s |
| Context Scraping | Scraper Service | ~15s |
| Frame Extraction | FFmpeg Service | ~20s |
| AI Processing | External AI APIs | ~70s |
| **Total Job Time** | **Worker Process** | **~108s** |

> Note: AI/Scraper APIs were throttled to 1 concurrent request (p-limit: 1) to prevent rate-limiting on free-tier accounts. Production throughput scales linearly with worker nodes.


### Output Quality

![Output Quality](https://res.cloudinary.com/dvk80x6fi/image/upload/v1773687362/WhatsApp_Image_2026-03-17_at_12.11.41_AM_uaag5a.jpg)  

> Vidchemy's AI-generated listings score 92/100 on SEO and 85/100 on Total Listing Score — with full marks on title optimization, keyword optimization, and bullet points, validating the effectiveness of the end-to-end pipeline.


---

## Cost Overview

| Component | MVP (Monthly) | Production (10k videos/mo) |
|---|---|---|
| Compute: AWS EC2 | $0.00 (Free Tier) | ~$120.00 |
| Message Queue: Redis | $0.00 (Local) | ~$35.00 |
| Database: MongoDB | $0.00 (Atlas M0) | ~$60.00 |
| Storage: AWS S3 | $0.00 (<5GB) | ~$15.00 |
| CDN: AWS CloudFront | $0.00 (<1TB) | ~$45.00 |
| RapidAPI Instagram | $0.00 (100 req/mo) | $20.00 |
| HasData Amazon | $0.00 (1k credits) | $49.00 |
| AWS Bedrock & Titan | $0.00 (Credits) | ~$120.00 |
| **Total** | **$0.00 / month** | **~$464.00 / month** |

**~$0.04 per processed video** at production scale.

---

## Roadmap

- [ ] **TikTok & YouTube Shorts** support
- [ ] **One-click publishing** directly to Amazon, Flipkart, and Shopify Seller Central
- [ ] **Expanded product categories** beyond apparel
- [ ] **Multilingual SEO** — regional language to global marketplace listings

---

## License

This project was built for a hackathon powered by AWS.

---

<p align="center">Built with ❤️ by aayushsingh7</p>