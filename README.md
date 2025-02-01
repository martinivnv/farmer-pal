# FarmerPal

## Overview

**FarmerPal** is an AI-powered crop health management system designed to help farmers detect diseases, pests, and other threats to their crops early. By leveraging AI, satellite mapping, and community-driven insights, **FarmerPal** provides farmers with real-time, actionable data to optimize their yield and reduce losses.

## Features

### 🌍 **Map View**

- Provides an aerial farm overview with color-coded health indicators.
- Highlights pest-infected areas using AI-based analysis.
- Allows farmers to zoom in on problem areas and view detailed statistics.

### 🌱 **Plant Analysis**

- AI-powered disease detection from plant images.
- Farmers can upload images for instant disease diagnosis.
- Provides treatment recommendations and risk assessment.
- Historic plant disease records with diagnosis and treatment insights.

### 🐞 **Pest Analysis**

- Identifies pest infestations via image upload.
- AI provides confidence scores for pest detection.
- Lists mitigation strategies for specific pest types.
- Historic pest detection data with threat levels and locations.

### 📍 **Crop Plantation Planner**

- Helps farmers plan optimal crop placement based on data.
- Select crop type and search radius for best planting locations.
- Uses geolocation and AI recommendations for site selection.
- Provides suitability scores and historic planning data.

### 🚨 **Alerts and Notifications**

- Real-time pest outbreak warnings.
- Disease risk alerts based on weather conditions.
- Crop health warnings for nutrient deficiencies.
- Categorizes alerts by severity (High, Medium, Low).

### 📊 **Community & Data Insights**

- Farmers can share disease and pest trends with others in their region.
- Localized data helps predict disease outbreaks.
- Allows collaborative problem-solving through community engagement.

## Technical Implementation

### 🎨 **Frontend**

- Built using **Next.js 14** for an intuitive user experience.
- Data visualizations powered by **Google Maps API**.
- Responsive design and modern UI components powdered by ShadCn

### 🖥 **Backend & API**

- **Next.js 14 App Router and Pages Routing** used for API development.

### 📡 **Crop Location Planner Endpoints**

- `/api/crop-location-planner/get-crop-data`
- `/api/crop-location-planner/index`

### 🖼 **Image Detection Endpoints**

- `/api/image-detection/data/get-pest`
- `/api/image-detection/data/get-plant`
- `/api/image-detection/data/pest-analyze`
- `/api/image-detection/data/plant-analyze`

### 🧠 **AI & Image Processing**

- **Google Gemini API** for image processing and suggestions recommendations

### 📡 **Data Storage & Management**

- **Firestore (NoSQL DB)** for storing prediction results and user interactions.
- **Google Maps API** for tracking and visualizing outbreaks.

### 🔄 **Automations & Cloud Functions**

- Cloud Function triggers AI inference upon image upload.
- Background tasks for periodic risk assessment updates.
- Automatic notification dispatch based on threat levels.

## How It Works

1. **Upload Image:** Farmers upload a crop image via the web or mobile app.
2. **AI Analysis:** The system detects plant diseases, pests, or nutrient deficiencies.
3. **Diagnosis & Recommendations:** AI suggests treatments based on analysis results.
4. **Mapping & Alerts:** Farmers receive updates on potential outbreaks in their area.
5. **Community Engagement:** Farmers can share insights and discuss findings.

## Key Benefits

- **Early Disease Detection**: Reduces crop loss and increases yield.
- **Data-Driven Insights**: Helps optimize farming decisions.
- **Community Awareness**: Farmers stay informed on regional threats.
- **Scalable Solution**: Works for small farms to large agricultural enterprises.
- **Cost-Effective**: Provides an affordable alternative to manual inspections.

## Google Cloud Technologies Used

- **Google AI Studio**: Gemini API for AI-based insights and building core features
- **Google Maps API**: for visualization & outbreak tracking
- **Firebase & Firestore**: for authentication & real-time data storage
- **Google Cloud Functions**: to trigger AI inference on uploads
- **Google Gemini API**: Core AI engine used for processing images, diagnosing crop diseases, and identifying pests. Additionally, it provides tailored treatment recommendations based on AI analysis. This ensures real-time decision-making for farmers, helping them optimize their crop management strategies efficiently.
- **ImageFX** Google AI image generator tool that creates photo-realistic and life-like images with simple steps, used to generate the logo for founder pal

## Future Enhancements

- **Multi-Language Support**: Localized disease descriptions & recommendations.
- **Crop Growth Stage Analysis**: AI predictions based on different crop growth phases.
- **Marketplace Integration**: Connect farmers with suppliers for recommended treatments.
- **IoT Sensor Support**: Integrate with farm sensors for real-time environmental monitoring.

## Conclusion

**FarmerPal** is a game-changing AI-powered tool designed to bring affordable and accessible crop disease management to farmers worldwide. By leveraging AI, cloud computing, and real-time mapping, FarmerPal helps farmers make informed decisions, reduce losses, and ensure sustainable agricultural practices. 🌾🚜

## Application Details

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

Here are the steps you can include in your **README** file, with sensitive keys blanked out for security:

---

## Environment Variables Setup

To run this project locally, you need to set up environment variables. Create a `.env.local` file in the root directory and add the following variables:

```env
# Google Maps API Key
GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY

# Gemini AI API Key
GEMINI_API_KEY=YOUR_GEMINI_API_KEY

# Public Google Maps API Key (for frontend use)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_PUBLIC_GOOGLE_MAPS_API_KEY

# API Base URL (Update this based on your environment)
NEXT_PUBLIC_API_URL=http://localhost:3000

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_FIREBASE_APP_ID
```

### Steps to Configure:

1. **Create a `.env.local` file** in the root directory.
2. **Copy and paste** the above environment variables.
3. **Replace `YOUR_XXXX` values** with your actual credentials.
4. **Restart the development server** after adding the variables.
