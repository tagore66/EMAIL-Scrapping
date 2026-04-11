# MailInsights: Intelligent Email Analytics Platform

MailInsights is a full-stack application that transforms your raw Gmail data into meaningful financial and behavioral insights. Using secure OAuth 2.0 and the Gmail API, it automatically fetches, cleans, and categorizes your emails to provide a high-level overview of your digital life.

## 🚀 Key Features

*   **🔒 Secure Google OAuth**: No passwords required. Connect safely using Google's official OAuth 2.0 flow.
*   **📊 Smart Categorization**: Automatically groups emails into Shopping, Food, Travel, Finance, and Work using keyword-based content analysis.
*   **💸 Auto-Amount Extraction**: High-precision regex engine detects transaction amounts (USD, INR, EUR, etc.) directly from email bodies.
*   **📈 Visual Analytics**: Interactive Area Charts for spending trends and Pie Charts for category distribution powered by Recharts.
*   **🛰️ System Telemetry**: Built-in performance tracking for sync operations, processing time, and error monitoring.
*   **✨ Premium UI**: Modern glassmorphism design with dark mode, fluid animations (Framer Motion), and responsive layout.

## 🛠️ Tech Stack

*   **Frontend**: React.js, Recharts, Framer Motion, Lucide Icons.
*   **Backend**: Node.js, Express.js.
*   **Database**: MongoDB (Mongoose).
*   **Authentication**: Google OAuth 2.0 via `googleapis`.
*   **Processing**: Cheerio for HTML cleaning, custom regex for data extraction.

## ⚙️ Setup Instructions

### 1. Google Cloud Configuration
To use the Gmail API, you must create a project in the [Google Cloud Console](https://console.cloud.google.com/):
1.  Enable the **Gmail API**.
2.  Configure the **OAuth Consent Screen**.
3.  Create **OAuth 2.0 Client IDs** (Web application).
4.  Add `http://localhost:5000/api/auth/google/callback` to the **Authorized redirect URIs**.
5.  Add `http://localhost:5173` to the **Authorized JavaScript origins**.

### 2. Backend Configuration
Update `backend/.env` with your credentials:
```env
GOOGLE_CLIENT_ID=your_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_secret
JWT_SECRET=any_random_string
```

### 3. Installation
Open two terminals:

**Terminal 1 (Backend):**
```bash
cd backend
npm install
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm install
npm run dev
```

## 🏗️ Project Structure

```text
EMAIL SCRAPPING/
├── backend/
│   ├── config/          # DB and Google API configs
│   ├── controllers/     # Auth, Email, and Analytics logic
│   ├── models/          # Mongoose Schemas (User, Email, Telemetry)
│   ├── routes/          # Express API endpoints
│   ├── services/        # Processing and Gmail API wrappers
│   └── index.js         # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components & Charts
│   │   ├── pages/       # Dashboard, Login, Telemetry views
│   │   ├── services/    # API abstraction
│   │   └── App.jsx      # Routing
└── ...
```

## ⚠️ Edge Case Handling
*   **Duplicates**: Uses `messageId` as a unique index in MongoDB to prevent duplicate processing.
*   **Missing Data**: Gracefully handles emails with missing bodies or subjects.
*   **API Limits**: Implements error catching and telemetry logging to monitor API performance.
