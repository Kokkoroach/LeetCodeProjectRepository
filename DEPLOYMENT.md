# Deployment Guide for NYC Transit Hub

This guide covers deployment of both the frontend and backend components of the NYC Transit Hub application.

## Prerequisites

Before deploying, ensure you have:
- Git repository set up
- MTA API key from https://api.mta.info
- Firebase project created at https://console.firebase.google.com
- Accounts on deployment platforms (Netlify/Vercel for frontend, Heroku/Railway for backend)

## Quick Start Commands

### Local Development

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Frontend Deployment

### Option 1: Deploy to Netlify

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build the frontend:**
   ```bash
   cd frontend
   npm run build
   ```

3. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

4. **Configure Environment Variables in Netlify Dashboard:**
   - Go to Site settings → Build & deploy → Environment
   - Add these variables:
     ```
     VITE_API_URL=https://your-backend-url.com/api
     VITE_FIREBASE_API_KEY=your_firebase_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
     VITE_FIREBASE_PROJECT_ID=your-project-id
     VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
     VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
     VITE_FIREBASE_APP_ID=your-app-id
     ```

5. **Configure Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 18 or higher

### Option 2: Deploy to Vercel

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   cd frontend
   vercel
   ```

3. **Add Environment Variables:**
   ```bash
   vercel env add VITE_API_URL
   vercel env add VITE_FIREBASE_API_KEY
   # ... add all other environment variables
   ```

4. **Deploy to Production:**
   ```bash
   vercel --prod
   ```

### Manual Netlify Deployment (UI)

1. Log in to [Netlify](https://www.netlify.com/)
2. Click "Add new site" → "Import an existing project"
3. Connect your Git repository
4. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Add environment variables in Site settings
6. Deploy!

## Backend Deployment

### Option 1: Deploy to Heroku

1. **Install Heroku CLI:**
   ```bash
   # macOS
   brew tap heroku/brew && brew install heroku
   
   # Windows
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Create a Procfile in the backend directory:**
   ```
   web: python app.py
   ```

3. **Update app.py for Heroku:**
   ```python
   # Change the last line from:
   app.run(debug=True, port=5000)
   
   # To:
   port = int(os.environ.get('PORT', 5000))
   app.run(host='0.0.0.0', port=port)
   ```

4. **Create a runtime.txt file:**
   ```
   python-3.11.0
   ```

5. **Initialize Git and Deploy:**
   ```bash
   cd backend
   git init
   heroku create your-app-name
   heroku config:set MTA_API_KEY=your_mta_api_key
   git add .
   git commit -m "Initial commit"
   git push heroku main
   ```

6. **Set Additional Environment Variables:**
   ```bash
   heroku config:set FLASK_ENV=production
   ```

7. **Check Logs:**
   ```bash
   heroku logs --tail
   ```

### Option 2: Deploy to Railway

1. **Sign up at [Railway](https://railway.app/)**

2. **Create a New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your repository

3. **Configure Environment Variables:**
   - Go to Variables tab
   - Add:
     ```
     MTA_API_KEY=your_mta_api_key
     FLASK_ENV=production
     ```

4. **Configure Build Settings:**
   - Railway auto-detects Python apps
   - Ensure `requirements.txt` is in root

5. **Deploy:**
   - Railway automatically deploys on push

### Option 3: Deploy to PythonAnywhere

1. **Sign up at [PythonAnywhere](https://www.pythonanywhere.com/)**

2. **Upload your code:**
   ```bash
   git clone your-repository-url
   cd your-repository/backend
   ```

3. **Create a virtual environment:**
   ```bash
   mkvirtualenv --python=/usr/bin/python3.10 myenv
   pip install -r requirements.txt
   ```

4. **Configure WSGI file:**
   Create `/var/www/yourusername_pythonanywhere_com_wsgi.py`:
   ```python
   import sys
   import os
   
   path = '/home/yourusername/your-repository/backend'
   if path not in sys.path:
       sys.path.append(path)
   
   os.environ['MTA_API_KEY'] = 'your_mta_api_key'
   
   from app import app as application
   ```

5. **Reload the web app in PythonAnywhere dashboard**

## Database Setup for Production

### SQLite (Simple, for small scale)
- SQLite database file will be created automatically
- Good for development and small deployments
- **Note:** Some platforms (like Heroku) have ephemeral filesystems, so SQLite won't persist

### PostgreSQL (Recommended for production)

1. **Install PostgreSQL adapter:**
   ```bash
   pip install psycopg2-binary
   ```

2. **Update requirements.txt:**
   Add `psycopg2-binary==2.9.9`

3. **Modify app.py to use PostgreSQL:**
   ```python
   import os
   from urllib.parse import urlparse
   
   # Get database URL from environment
   database_url = os.environ.get('DATABASE_URL')
   
   if database_url:
       # Parse the URL
       url = urlparse(database_url)
       
       # Create connection string
       conn_str = f"postgresql://{url.username}:{url.password}@{url.hostname}:{url.port}{url.path}"
   else:
       # Fallback to SQLite for local development
       conn_str = 'sqlite:///transit_hub.db'
   ```

4. **Add PostgreSQL to Heroku:**
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

## Firebase Setup

1. **Create a Firebase Project:**
   - Go to https://console.firebase.google.com
   - Create new project
   - Enable Authentication → Email/Password

2. **Get Firebase Config:**
   - Go to Project Settings → General
   - Scroll to "Your apps" → Web app
   - Copy the config values

3. **Add Firebase Config to Frontend:**
   - Update `src/firebase-config.js` with your values
   - Or set environment variables in deployment platform

## Post-Deployment Checklist

- [ ] Frontend deployed and accessible
- [ ] Backend deployed and accessible
- [ ] Environment variables set correctly
- [ ] Firebase authentication working
- [ ] API endpoints responding correctly
- [ ] Database initialized
- [ ] CORS configured properly
- [ ] SSL/HTTPS enabled
- [ ] Custom domain configured (optional)
- [ ] Error monitoring set up
- [ ] Backups configured

## Testing Production Deployment

1. **Test Backend Health:**
   ```bash
   curl https://your-backend-url.com/api/health
   ```

2. **Test Service Status:**
   ```bash
   curl https://your-backend-url.com/api/service-status
   ```

3. **Test Frontend:**
   - Visit your frontend URL
   - Try signing up/signing in
   - Add favorites
   - Check all tabs work

## Monitoring and Maintenance

### Set Up Error Logging

**Backend (Sentry):**
```python
import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration

sentry_sdk.init(
    dsn="your-sentry-dsn",
    integrations=[FlaskIntegration()],
)
```

**Frontend (Sentry):**
```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  integrations: [new Sentry.BrowserTracing()],
});
```

### Set Up Uptime Monitoring

Use services like:
- UptimeRobot (free)
- Pingdom
- StatusCake

### Regular Maintenance

1. **Update Dependencies:**
   ```bash
   # Frontend
   npm update
   
   # Backend
   pip list --outdated
   pip install --upgrade package-name
   ```

2. **Monitor Logs:**
   ```bash
   # Heroku
   heroku logs --tail
   
   # Netlify
   # Check dashboard → Deploys → Deploy log
   ```

3. **Database Backups:**
   - Set up automated backups on your hosting platform
   - Test restore process regularly

## Troubleshooting

### Frontend Issues

**Build fails:**
- Check Node version (should be 18+)
- Clear node_modules: `rm -rf node_modules && npm install`
- Check environment variables are set

**API calls failing:**
- Verify VITE_API_URL is correct
- Check CORS settings on backend
- Verify backend is running

### Backend Issues

**Database errors:**
- Check database connection string
- Verify database is initialized
- Check file permissions (SQLite)

**Import errors:**
- Verify all dependencies in requirements.txt
- Check Python version matches runtime.txt

**Port issues:**
- Ensure app listens on PORT environment variable
- Use `0.0.0.0` as host for production

## Scaling Considerations

As your app grows:

1. **Add caching:**
   - Implement Redis for session storage
   - Cache API responses

2. **Use CDN:**
   - Serve static assets via CDN
   - Reduce server load

3. **Add load balancing:**
   - Deploy multiple backend instances
   - Use load balancer

4. **Optimize database:**
   - Add indexes
   - Implement connection pooling
   - Consider read replicas

## Support

For issues:
- Check logs first
- Review this guide
- Check platform-specific documentation
- Open an issue on GitHub

## Security Notes

- Always use HTTPS in production
- Keep dependencies updated
- Never commit API keys or secrets
- Use environment variables for sensitive data
- Implement rate limiting
- Regular security audits