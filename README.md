# MailInsights

A full-stack system for syncing, categorizing, and extracting data from Gmail archives. 

## Overview
This project provides a secure workspace to analyze email data. It uses the Gmail API to fetch messages, strips HTML for processing, and applies logic to categorize mail and identify transaction amounts. It is built as a portfolio piece to demonstrate secure OAuth implementation and database aggregation.

## Technical Features
- **OAuth 2.0 Integration**: Secure handshake with Google Cloud APIs using `google-auth-library`.
- **Email Processing Suite**: 
    - HTML sanitization via `cheerio`.
    - Keyword-based classification engine.
    - Transaction/Amount detection using Regular Expressions.
- **Analytics Dashboard**: Real-time stats powered by MongoDB Aggregation pipelines.
- **Telemetry System**: Background tracking for synchronization health and processing times.

## Tech Stack
- **Stack**: Node.js / Express / MongoDB
- **UI**: React 18 / Vite / Lucide
- **Style**: Custom CSS (Minimalist Slate theme)
- **Data**: Mongoose / Axios

## Setup
1. Configure a Project in Google Cloud Console.
2. Enable Gmail API and set up the OAuth Consent Screen.
3. Add your `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `MONGODB_URI` to a `.env` file in the backend folder.

### Installation
```bash
# Backend setup
cd backend
npm install
npm run dev

# Frontend setup
cd frontend
npm install
npm run dev
```

## How It Works
1. **Auth**: The system requests a `readonly` scope from Gmail.
2. **Sync**: Raw mail is fetched, cleaned of HTML noise, and analyzed for keywords like "shipped" (Shopping), "bank" (Finance), etc.
3. **Storage**: Processed data is stored in MongoDB with a reference to the Google User ID.
4. **View**: The Dashboard fetches these records and displays them in a filtered table with high-level stats.

---
*Created as a technical demonstration of full-stack data processing.*
