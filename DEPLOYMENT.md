# Deployment Guide

## Deploying to Railway

### Step 1: Prepare Your Repository

Your code is already on GitHub at: https://github.com/suttley13/art-visualizer

### Step 2: Get a Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the API key (you'll need it in Step 4)

### Step 3: Create a Railway Account

1. Go to [Railway.app](https://railway.app)
2. Click "Start a New Project"
3. Sign up using GitHub (recommended)

### Step 4: Deploy from GitHub

1. In Railway dashboard, click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose the `art-visualizer` repository
4. Railway will automatically detect it's a Next.js app and start building

### Step 5: Configure Environment Variables

1. In your Railway project, click on the service
2. Go to the "Variables" tab
3. Click "Add Variable"
4. Add:
   - **Variable Name:** `GEMINI_API_KEY`
   - **Value:** Your Gemini API key from Step 2
5. Click "Add"

### Step 6: Deploy

1. Railway will automatically redeploy with the new environment variable
2. Wait for the deployment to complete (usually 2-3 minutes)
3. Click on the generated URL to view your live app

### Step 7: Test Your Deployment

1. Open the Railway-provided URL in your mobile browser
2. Upload a photo of a room
3. Select an art type
4. Click "Visualize Art"
5. Wait for the AI to generate the result

## Troubleshooting

### Build Failures

If the build fails:
- Check that `GEMINI_API_KEY` is set correctly
- Review build logs in Railway dashboard
- Ensure all dependencies are in package.json

### API Errors

If you get API errors:
- Verify your Gemini API key is valid
- Check that you haven't exceeded API quota
- Review error messages in browser console

### Performance Issues

- Railway free tier may have slower performance
- Consider upgrading to a paid plan for production use
- Optimize images before upload (compress to <2MB)

## Custom Domain (Optional)

1. In Railway project settings, go to "Domains"
2. Click "Add Domain"
3. Follow instructions to connect your domain
4. Update DNS settings as instructed

## Monitoring

Railway provides:
- Real-time logs
- Metrics (CPU, Memory, Network)
- Deployment history

Access these in your Railway dashboard.

## Updating Your App

To deploy updates:
1. Make changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your update message"
   git push
   ```
3. Railway will automatically detect and deploy changes

## Cost Estimates

- **Free Tier:** $5 credit/month, good for testing
- **Pro Plan:** $20/month for production apps
- Gemini API usage charged separately by Google

## Support

- Railway Docs: https://docs.railway.app
- Gemini API Docs: https://ai.google.dev/docs
- GitHub Issues: https://github.com/suttley13/art-visualizer/issues
