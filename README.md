# Art Visualizer

A mobile-first web application that helps users visualize how artwork would look in their home. Upload a photo of a room, select the type of art you'd like to see, and let AI generate a realistic preview of your space with art.

## Features

- Mobile-optimized photo upload with camera integration
- Multiple art types: paintings, photographs, sculptures, gallery walls, and more
- AI-powered realistic art placement using Google Gemini
- Clean, modern UI built with Next.js and Tailwind CSS

## Tech Stack

- **Framework:** Next.js 15 with TypeScript
- **Styling:** Tailwind CSS
- **AI:** Google Gemini (Gemini 2.0 Flash + Imagen 3.0)
- **Deployment:** Railway

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. Clone the repository

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Add your Gemini API key to `.env.local`:
```
GEMINI_API_KEY=your_actual_api_key_here
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Use

1. Open the app on your mobile device or browser
2. Click "Choose Photo" to upload a picture of a wall or room
3. Select the type of art you'd like to visualize
4. Click "Visualize Art" and wait for the AI to generate your preview
5. View the result and try different art types or upload a new photo

## Deployment to Railway

### Option 1: Deploy via Railway Dashboard

1. Create a [Railway](https://railway.app) account
2. Click "New Project" → "Deploy from GitHub repo"
3. Select this repository
4. Add environment variable:
   - Key: `GEMINI_API_KEY`
   - Value: Your Gemini API key
5. Railway will automatically deploy your app

### Option 2: Deploy via Railway CLI

1. Install Railway CLI:
```bash
npm install -g @railway/cli
```

2. Login to Railway:
```bash
railway login
```

3. Initialize and deploy:
```bash
railway init
railway up
```

4. Add environment variable:
```bash
railway variables set GEMINI_API_KEY=your_api_key_here
```

Your app will be live at the provided Railway URL!

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Your Google Gemini API key | Yes |

## Architecture

The app uses a three-step process:

1. **Image Analysis:** Gemini 2.0 Flash analyzes the uploaded room photo
2. **Prompt Generation:** Creates a detailed description of the room with art added
3. **Image Generation:** Imagen 3.0 generates a photorealistic image based on the description

## License

MIT
