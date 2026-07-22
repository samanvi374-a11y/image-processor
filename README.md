#  GoGig Vehicle Image Processing System

An intelligent vehicle image inspection system that analyzes uploaded vehicle images, performs multiple quality checks, extracts vehicle registration numbers using OCR, validates Indian number plate formats, and displays a detailed inspection report through an interactive dashboard.

---

# Features

The application performs the following inspections:

- Duplicate Image Detection
- Brightness Analysis
- Blur Detection
- Image Dimension Validation
- Metadata Analysis
- Vehicle Plate Detection
- OCR using Tesseract.js
- Indian Number Plate Validation
- Interactive Dashboard
- Background Processing using BullMQ
- MongoDB Result Storage

---

# Architecture

The project follows a modular architecture.

```
                    User
                      │
                      ▼
            HTML/CSS/JavaScript UI
                      │
                      ▼
              Express REST API
                      │
             Image Upload (Multer)
                      │
                      ▼
                 MongoDB Record
                      │
                      ▼
              BullMQ + Redis Queue
                      │
                      ▼
             Background Worker
                      │
   ┌───────────┬────────────┬────────────┐
   │           │            │            │
Duplicate   Brightness     Blur     Metadata
Detection   Analysis     Detection  Analysis
   │
   ▼
Plate Crop
   │
   ▼
OCR
   │
   ▼
Plate Validation
   │
   ▼
MongoDB Update
   │
   ▼
Frontend Dashboard
```

---

# Service Flow

1. User uploads an image through the web interface.
2. Express receives the request.
3. Multer stores the uploaded image.
4. Image information is saved in MongoDB.
5. BullMQ creates a background processing job.
6. Worker starts processing the image.
7. All inspection modules execute sequentially.
8. OCR extracts vehicle registration number.
9. Results are stored in MongoDB.
10. Frontend continuously polls the API.
11. Inspection report is displayed.

---

# Processing Flow

Every uploaded image passes through the following stages.

## 1. Duplicate Detection

- Generate perceptual hash
- Compare hash with previous images
- Detect duplicate uploads

---

## 2. Brightness Detection

Calculates brightness score.

Classification:

- Too Dark
- Well-lit
- Too Bright

---

## 3. Blur Detection

Uses Laplacian Variance.

Classification:

- Sharp
- Slightly Blurry
- Blurry

---

## 4. Dimension Validation

Reads

- Width
- Height
- Aspect Ratio

---

## 5. Metadata Analysis

Reads EXIF metadata including

- Camera
- Model
- Software
- Capture Date

Determines whether image appears edited.

---

## 6. Plate Crop

Detects probable vehicle plate region.

---

## 7. OCR

Uses Tesseract.js to extract text.

---

## 8. Plate Validation

Validates Indian vehicle registration format.

Extracts

- State Code
- District Code
- Series
- Vehicle Number

---

## 9. Database Update

Stores

- Inspection Result
- OCR Output
- Metadata
- Processing Time
- Status

 # Queue Strategy

The application uses **BullMQ** with **Redis** to process uploaded images asynchronously.

Workflow:

```
Upload Image
      │
      ▼
 Express API
      │
      ▼
 BullMQ Queue
      │
      ▼
 Background Worker
      │
      ▼
 Image Processing
      │
      ▼
 MongoDB Update
      │
      ▼
 Dashboard Result
```

# Major Design Decisions

## Modular Design

Each inspection module is separated into its own utility.

Examples:

- Duplicate Detection
- Blur Detection
- Brightness Detection
- OCR
- Metadata Analysis
- Plate Validation

This improves maintainability and testing.

---

## Background Processing

Image processing runs inside BullMQ workers rather than inside API requests.

Advantages:

- Faster uploads
- Better user experience
- Non-blocking API
- Easier scalability

---

## MongoDB Storage

MongoDB stores

- Image information
- Inspection results
- OCR text
- Metadata
- Processing status
- Processing time

---

## Frontend

The frontend is a lightweight HTML/CSS/JavaScript dashboard served directly from Express.

No frontend framework is required.

---

# Project Structure

```
gogig-media-processor/
│
├── package.json
├── Dockerfile
├── docker-compose.yml
├── .env
│
├── public/
│   ├── index.html
│   ├── css/
│   └── js/
│
├── uploads/
│
├── src/
│
├── config/
│   ├── db.js
│   └── redis.js
│
├── controllers/
│
├── middleware/
│
├── models/
│
├── queue/
│
├── routes/
│
├── utils/
│   ├── brightness.js
│   ├── blur.js
│   ├── dimension.js
│   ├── hash.js
│   ├── metadata.js
│   ├── ocr.js
│   ├── plateCrop.js
│   └── plateValidator.js
│
├── workers/
│   └── imageWorker.js
│
├── app.js
└── server.js
```

---

# Technologies Used

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- BullMQ
- Redis
- Multer

## Image Processing

- Sharp
- Tesseract.js

## Frontend

- HTML5
- CSS3
- JavaScript

---

# Installation

Clone repository

```bash
git clone <repository-url>
```

Install packages

```bash
npm install
```

Create `.env`

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
REDIS_URL=redis://localhost:6379
```

Start project

```bash
npm start
```

Open

```
http://localhost:5000
```

---

# API Endpoints

## Upload Image

```
POST /api/upload
```

Request

```
multipart/form-data

image
```

Response

```json
{
    "success": true,
    "imageId": "...",
    "status": "pending"
}
```

---

## Get Inspection Result

```
GET /api/images/:imageId
```

Returns

- Processing Status
- Inspection Report
- OCR Result
- Plate Details
- Metadata
- Processing Time

---

## Health Check

```
GET /health
```

Returns server status.

# AI Usage Disclosure

Artificial Intelligence was used as a development assistant during this project. Specifically, it was used to:

- Generate and improve project documentation (README).
- Refine frontend UI text and styling suggestions.
- Explain technical concepts and provide implementation guidance.
- Assist with debugging by suggesting possible fixes and improvements.
- Help refactor code for better readability and maintainability.

Every AI-generated suggestion was reviewed, modified where necessary, and validated before being incorporated into the final application.
