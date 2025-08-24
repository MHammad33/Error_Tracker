# Deployment Guide

This guide covers various deployment options for the Issue Tracker application.

## 🚀 Quick Deploy to Vercel (Recommended)

### Prerequisites
- GitHub repository with your code
- MongoDB database (MongoDB Atlas recommended)
- Google OAuth credentials

### Steps

1. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Environment Variables**
   Add these in Vercel's dashboard under "Settings > Environment Variables":
   ```
   DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/issue-tracker
   NEXTAUTH_URL=https://your-app.vercel.app
   NEXTAUTH_SECRET=your-secret-key
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   SENTRY_DSN=your-sentry-dsn (optional)
   ```

3. **Update Google OAuth**
   - Add your Vercel URL to authorized redirect URIs
   - `https://your-app.vercel.app/api/auth/callback/google`

4. **Deploy**
   - Vercel automatically deploys on Git push
   - Check deployment logs for any issues

## 🐳 Docker Deployment

### Create Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build application
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set correct permissions
USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
      - GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
    depends_on:
      - mongodb

  mongodb:
    image: mongo:7
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

### Build and Run

```bash
# Build image
docker build -t issue-tracker .

# Run with environment file
docker run --env-file .env.local -p 3000:3000 issue-tracker

# Or use docker-compose
docker-compose up -d
```

## ☁️ Cloud Platform Deployments

### AWS (Elastic Beanstalk)

1. **Install AWS CLI and EB CLI**
   ```bash
   pip install awsebcli
   ```

2. **Initialize EB Application**
   ```bash
   eb init
   eb create production
   ```

3. **Configure Environment Variables**
   ```bash
   eb setenv DATABASE_URL=your-db-url NEXTAUTH_SECRET=your-secret
   ```

4. **Deploy**
   ```bash
   eb deploy
   ```

### Google Cloud Platform (Cloud Run)

1. **Build and Push to Container Registry**
   ```bash
   gcloud builds submit --tag gcr.io/PROJECT_ID/issue-tracker
   ```

2. **Deploy to Cloud Run**
   ```bash
   gcloud run deploy --image gcr.io/PROJECT_ID/issue-tracker --platform managed
   ```

### DigitalOcean App Platform

1. **Create app.yaml**
   ```yaml
   name: issue-tracker
   services:
   - name: web
     source_dir: /
     github:
       repo: your-username/issue-tracker
       branch: main
     run_command: npm start
     environment_slug: node-js
     instance_count: 1
     instance_size_slug: basic-xxs
     envs:
     - key: DATABASE_URL
       value: ${DATABASE_URL}
     - key: NEXTAUTH_SECRET
       value: ${NEXTAUTH_SECRET}
   ```

2. **Deploy via CLI or Dashboard**
   ```bash
   doctl apps create app.yaml
   ```

### Railway

1. **Connect GitHub Repository**
   - Go to [railway.app](https://railway.app)
   - Connect your GitHub repo

2. **Add Environment Variables**
   - Add all required environment variables in Railway dashboard

3. **Deploy**
   - Railway automatically deploys on push

## 🗄️ Database Setup

### MongoDB Atlas (Recommended)

1. **Create Cluster**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create free cluster
   - Create database user
   - Add IP address to whitelist

2. **Get Connection String**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/issue-tracker
   ```

3. **Set up Database**
   ```bash
   npx prisma db push
   npm run seed
   ```

### Self-hosted MongoDB

1. **Install MongoDB**
   ```bash
   # Ubuntu/Debian
   sudo apt-get install mongodb

   # macOS
   brew install mongodb-community
   ```

2. **Start MongoDB**
   ```bash
   sudo systemctl start mongod
   ```

3. **Connection String**
   ```
   mongodb://localhost:27017/issue-tracker
   ```

## 🔧 Production Configuration

### Environment Variables

Required for production:
```bash
# Database
DATABASE_URL="mongodb+srv://..."

# Authentication
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-production-secret"

# OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Optional
SENTRY_DSN="your-sentry-dsn"
NODE_ENV="production"
```

### Security Headers

Add to your hosting platform or reverse proxy:

```nginx
# Nginx configuration
server {
    listen 443 ssl;
    server_name yourdomain.com;

    # SSL configuration
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header Referrer-Policy strict-origin-when-cross-origin always;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Performance Optimization

1. **Enable Compression**
   ```javascript
   // next.config.ts
   const nextConfig = {
     compress: true,
     images: {
       domains: ['your-image-domain.com'],
     },
   };
   ```

2. **Database Indexing**
   ```javascript
   // Add indexes for better query performance
   await prisma.$runCommandRaw({
     createIndexes: 'Issue',
     indexes: [
       { key: { status: 1 }, name: 'status_index' },
       { key: { createdAt: -1 }, name: 'created_date_index' },
       { key: { title: 'text', description: 'text' }, name: 'search_index' }
     ]
   });
   ```

3. **CDN Configuration**
   - Use Vercel's Edge Network or CloudFlare
   - Cache static assets
   - Optimize images

## 📊 Monitoring and Logging

### Application Monitoring

1. **Sentry Error Tracking**
   ```bash
   # Already configured in next.config.ts
   SENTRY_DSN=your-sentry-dsn
   ```

2. **Uptime Monitoring**
   - Use services like Pingdom, UptimeRobot
   - Monitor `/api/health` endpoint

3. **Performance Monitoring**
   - Vercel Analytics (for Vercel deployments)
   - Google Analytics
   - Sentry Performance

### Database Monitoring

1. **MongoDB Atlas Monitoring**
   - Built-in monitoring dashboard
   - Performance alerts
   - Query profiler

2. **Custom Health Checks**
   ```javascript
   // pages/api/health.ts
   export default async function handler(req, res) {
     try {
       await prisma.user.count();
       res.status(200).json({ status: 'healthy' });
     } catch (error) {
       res.status(500).json({ status: 'unhealthy', error: error.message });
     }
   }
   ```

## 🔒 Security Considerations

### SSL/TLS
- Always use HTTPS in production
- Use strong SSL certificates
- Enable HSTS headers

### Environment Variables
- Never commit secrets to version control
- Use platform-specific secret management
- Rotate secrets regularly

### Database Security
- Use strong database passwords
- Enable MongoDB authentication
- Restrict database access by IP
- Regular security updates

### Application Security
- Keep dependencies updated
- Monitor for vulnerabilities with `npm audit`
- Implement rate limiting
- Use security headers

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear caches
   rm -rf .next
   rm -rf node_modules
   npm install
   npm run build
   ```

2. **Database Connection Issues**
   ```bash
   # Test connection
   npx prisma db pull
   ```

3. **Authentication Issues**
   - Verify OAuth redirect URIs
   - Check NEXTAUTH_URL matches domain
   - Ensure NEXTAUTH_SECRET is set

4. **Performance Issues**
   - Monitor database query performance
   - Check for memory leaks
   - Optimize large data rendering

### Deployment Checklist

- [ ] Environment variables configured
- [ ] Database accessible and seeded
- [ ] OAuth redirect URIs updated
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Error monitoring setup
- [ ] Performance monitoring setup
- [ ] Backup strategy implemented
- [ ] Health checks configured
- [ ] Documentation updated

## 📞 Support

For deployment issues:
- Check platform-specific documentation
- Review application logs
- Test locally with production environment variables
- Contact platform support if needed

---

Happy deploying! 🚀
