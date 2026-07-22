# 🚗 GoGig Media Processor

An intelligent, production-grade media processing pipeline that analyzes field-uploaded vehicle photos, extracts license plate numbers via Optical Character Recognition (OCR), detects registration patterns, and reports inspection results—all accessible through a clean, unified web dashboard.

---

## 📋 Table of Contents

1. [Overview](#-overview)
2. [Key Features](#-key-features)
3. [Project Structure](#-project-structure)
4. [Technologies Used](#-technologies-used)
5. [Getting Started](#-getting-started)
6. [Environment Variables](#-environment-variables)
7. [API Reference](#-api-reference)
8. [Docker Deployment](#-docker-deployment)

---

## 🔍 Overview

The **GoGig Media Processor** is built to process vehicle photos uploaded by field agents or users. It passes incoming images through an automated processing pipeline that detects vehicle registration numbers (OCR), validates plate formats, and stores structured metadata in MongoDB.

The application features a **unified single-server architecture** where the Express backend serves both the REST API and the interactive frontend dashboard from the `public/` folder.

---

## 🛠 Key Features

* **License Plate Recognition (OCR)**: Uses `Tesseract.js` combined with `Sharp` and `OpenCV.js` image pre-processing for license plate extraction.
* **Unified Web Dashboard**: Interactive UI hosted directly from `public/index.html` for uploading images and monitoring real-time processing status.
* **Asynchronous Queue Engine**: Utilizes `BullMQ` and `Redis` for background job processing, with automatic standalone fallback if Redis is offline.
* **Single Command Execution**: Run both frontend and backend seamlessly using `npm start`.

---

## 📁 Project Structure

```
gogig-media-processor/
│
├── package.json                         # Node.js dependencies & scripts
├── Dockerfile                           # Docker container build script
├── docker-compose.yml                   # Docker Compose multi-container setup
├── .env                                 # Environment configuration file
│
├── public/                              # Unified Frontend (Web Dashboard)
│   └── index.html                       # Upload UI & real-time result dashboard
│
├── src/                                 # Backend Source Code
│   ├── config/                          # Database (MongoDB) & Redis config
│   │   ├── db.js
│   │   └── redis.js
│   ├── controllers/                     # Endpoint handler logic
│   │   └── imageController.js
│   ├── models/                          # Mongoose data schemas
│   │   └── Image.js
│   ├── routes/                          # Express API routes
│   │   └── imageRoutes.js
│   ├── services/                        # Core OCR & image processing logic
│   │   ├── ocrService.js
│   │   └── opencvService.js
│   ├── workers/                         # BullMQ background job processing workers
│   │   └── imageWorker.js
│   ├── app.js                           # Express application & static server config
│   └── server.js                        # Server entry point
│
└── uploads/                             # Local image storage directory
```

---

## 💻 Technologies Used

### Backend & Processing
* **Node.js** (v18+) & **Express.js** v5 — Web server framework
* **MongoDB Atlas** + **Mongoose** — Data persistence
* **Tesseract.js** — OCR engine for reading plate characters
* **Sharp** & **OpenCV.js** (`@techstark/opencv-js`) — Image enhancement & cropping
* **BullMQ** & **Redis** — Asynchronous job queue processing
* **Multer** — Multipart file upload handling

### Frontend
* **HTML5 / Vanilla JavaScript** — Lightweight, responsive web dashboard served directly via Express (`public/index.html`).

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** (v18 or higher installed)
* **MongoDB** (Local instance or MongoDB Atlas URI)
* *(Optional)* **Redis** server for queue support (App automatically runs in direct execution mode if Redis is offline)

### Installation & Run Steps

1. **Navigate to the project directory**:
   ```bash
   cd gogig-media-processor/gogig-media-processor
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory (see section below).

4. **Start the application**:
   ```bash
   npm start
   ```

5. **Access the Dashboard**:
   Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

---

## ⚙️ Environment Variables

Create a `.env` file in `gogig-media-processor/gogig-media-processor/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/gogig_media_processor
REDIS_URL=redis://localhost:6379
NODE_ENV=development
```

---

## 📡 API Reference

### 1. Upload Image for Processing
* **Endpoint**: `POST /api/images/upload`
* **Content-Type**: `multipart/form-data`
* **Body**: `image` (File)
* **Response**:
  ```json
  {
    "success": true,
    "imageId": "64f1a2b3c4d5e6f7a8b9c0d1",
    "message": "Image uploaded and queued for processing"
  }
  ```

### 2. Check Processing Status & Results
* **Endpoint**: `GET /api/images/status/:imageId`
* **Response**:
  ```json
  {
    "success": true,
    "status": "completed",
    "extractedText": "MH12AB1234",
    "plateNumber": "MH12AB1234",
    "plateDetectionReason": "Valid Registration Format"
  }
  ```

### 3. Server Health Check
* **Endpoint**: `GET /api/health`
* **Response**:
  ```json
  {
    "success": true,
    "message": "GoGig Media Processor API Running"
  }
  ```

---

## 🐳 Docker Deployment

To build and run the application using Docker:

```bash
docker-compose up --build
```

The application will be accessible at `http://localhost:5000`.
