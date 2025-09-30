# Frontend Service

[![Version](https://img.shields.io/badge/version-1.0.0-blue)](https://github.com/ALMGHAS/bookmyseat-frontend-service/releases)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Angular](https://img.shields.io/badge/Angular-20-red)](https://angular.io/)
[![Spartan UI](https://img.shields.io/badge/Spartan%20UI-latest-green)](https://www.spartan.ng/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4+-blue)](https://tailwindcss.com/)

**Frontend Service** is a modern Angular 20 application for the BookMySeat movie booking platform. Built with standalone components, Spartan UI, and TailwindCSS for a fast, accessible, and beautiful user experience.

## 📚 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Technology Stack](#-technology-stack)
- [Quick Start](#-quick-start)
- [Development](#-development)
- [Project Structure](#-project-structure)
- [API Integration](#-api-integration)
- [Configuration](#-configuration)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

## ✨ Features

- **Modern Angular 20**: Standalone components, signals, and functional interceptors
- **Spartan UI Components**: Accessible UI primitives inspired by shadcn/ui
- **TailwindCSS Styling**: Utility-first CSS for rapid UI development
- **Responsive Design**: Mobile-first responsive layouts
- **Movie Browsing**: Search and filter movies by genre and language
- **Showtime Display**: View available showtimes for movies
- **Review System**: Read and submit movie reviews with ratings
- **Distributed Tracing**: B3 trace headers for end-to-end observability
- **Docker Ready**: Multi-stage Dockerfile with Nginx for production

## 🏗 Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Browser       │───▶│   Nginx         │───▶│  Movie Service  │
│   (Angular)     │    │   (Port 80)     │    │  (Port 8081)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │  Review Service │
                       │  (Port 8082)    │
                       └─────────────────┘
```

### Application Layer Architecture

```
Presentation Layer (Components)
     ↓
Service Layer (Business Logic)
     ↓
HTTP Interceptors (Tracing, Error)
     ↓
Backend APIs (Movie & Review Services)
```

## 🛠 Technology Stack

- **Framework**: Angular 20 with standalone components
- **UI Library**: Spartan UI (spartan/ui/brain + spartan/ui/helm)
- **Styling**: TailwindCSS 3.4+ with utility classes
- **Language**: TypeScript 5.9+
- **State Management**: Angular signals
- **HTTP Client**: Angular HttpClient with RxJS
- **Routing**: Angular Router with lazy loading
- **Build Tool**: Angular CLI 20
- **Server**: Nginx (production)
- **Containerization**: Docker multi-stage build

## 🚀 Quick Start

### Prerequisites

- **Node.js 20+** (LTS recommended)
- **npm 10+**
- **Docker** (for containerized deployment)

### Installation

```bash
# Navigate to frontend-service directory
cd frontend-service

# Install dependencies
npm install

# Start development server
npm start
```

The application will be available at http://localhost:4200

### Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
# MOVIE_SERVICE_URL=http://localhost:8081/api/v1
# REVIEW_SERVICE_URL=http://localhost:8082/api/v1
```

## 💻 Development

### Development Server

```bash
# Start dev server (http://localhost:4200)
npm start

# Start with specific port
ng serve --port 4201

# Start with open browser
ng serve --open
```

### Build

```bash
# Development build
npm run build

# Production build
npm run build -- --configuration=production

# Build with source maps
npm run build -- --configuration=production --source-map
```

### Code Scaffolding

```bash
# Generate component
ng generate component features/movies/movie-list

# Generate service
ng generate service core/services/auth

# Generate pipe
ng generate pipe shared/pipes/duration
```

## 📁 Project Structure

```
frontend-service/
├── src/
│   ├── app/
│   │   ├── core/                    # Core application modules
│   │   │   ├── models/              # Data models
│   │   │   │   ├── movie.model.ts
│   │   │   │   └── review.model.ts
│   │   │   ├── services/            # Business services
│   │   │   │   ├── movie.service.ts
│   │   │   │   ├── review.service.ts
│   │   │   │   └── error-handler.service.ts
│   │   │   └── interceptors/        # HTTP interceptors
│   │   │       ├── tracing.interceptor.ts
│   │   │       └── error.interceptor.ts
│   │   ├── features/                # Feature modules
│   │   │   ├── movies/              # Movie feature
│   │   │   └── reviews/             # Review feature
│   │   ├── shared/                  # Shared resources
│   │   │   ├── components/          # Reusable components
│   │   │   │   ├── header/
│   │   │   │   ├── footer/
│   │   │   │   └── star-rating/
│   │   │   ├── pipes/               # Custom pipes
│   │   │   │   └── duration.pipe.ts
│   │   │   └── ui/                  # Spartan UI components
│   │   ├── app.ts                   # Root component
│   │   ├── app.routes.ts            # Routing configuration
│   │   └── app.config.ts            # App configuration
│   ├── environments/                 # Environment configs
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   ├── styles.css                   # Global styles
│   └── index.html                   # HTML entry point
├── public/                          # Static assets
├── nginx.conf                       # Nginx configuration
├── Dockerfile                       # Multi-stage Docker build
├── docker-compose.yml               # Docker Compose config
├── tailwind.config.js               # TailwindCSS config
├── tsconfig.json                    # TypeScript config
└── package.json                     # Dependencies
```

## 🔌 API Integration

### Movie Service Integration

```typescript
// Movie Service (Port 8081)
GET    /api/v1/movies                 # List all movies
GET    /api/v1/movies?genre=Sci-Fi    # Filter by genre
GET    /api/v1/movies/{id}            # Get movie details
GET    /api/v1/showtimes               # List all showtimes
GET    /api/v1/showtimes?movieId=1    # Showtimes for movie
```

### Review Service Integration

```typescript
// Review Service (Port 8082)
GET    /api/v1/reviews/movie/{id}     # Get reviews for movie
GET    /api/v1/reviews/rating/{id}    # Get rating summary
POST   /api/v1/reviews                 # Submit review
```

### Environment Configuration

Development (localhost):
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  movieServiceUrl: 'http://localhost:8081/api/v1',
  reviewServiceUrl: 'http://localhost:8082/api/v1',
  enableTracing: true
};
```

Production (Docker):
```typescript
// src/environments/environment.prod.ts
export const environment = {
  production: true,
  movieServiceUrl: '/api/movies',      # Proxied by Nginx
  reviewServiceUrl: '/api/reviews',    # Proxied by Nginx
  enableTracing: true
};
```

### HTTP Interceptors

**Tracing Interceptor**: Adds B3 distributed tracing headers
```typescript
X-B3-TraceId: {generated-trace-id}
X-B3-SpanId: {generated-span-id}
```

**Error Interceptor**: Global error handling for HTTP requests

## ⚙️ Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `MOVIE_SERVICE_URL` | `http://localhost:8081/api/v1` | Movie service endpoint |
| `REVIEW_SERVICE_URL` | `http://localhost:8082/api/v1` | Review service endpoint |
| `ENABLE_TRACING` | `true` | Enable distributed tracing |

### TailwindCSS Configuration

```javascript
// tailwind.config.js
module.exports = {
  presets: [require('@spartan-ng/brain/hlm-tailwind-preset')],
  content: [
    './src/**/*.{html,ts}',
    './src/app/shared/ui/**/*.{html,ts}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

## 🧪 Testing

### Running Tests

```bash
# Run unit tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run e2e tests
npm run e2e
```

### Test Coverage Goals

| Component | Target | Description |
|-----------|--------|-------------|
| **Services** | 90% | Business logic coverage |
| **Components** | 85% | Component testing |
| **Pipes** | 100% | Pure functions |
| **Interceptors** | 90% | HTTP logic |

## 🚢 Deployment

### Docker Build

```bash
# Build Docker image
docker build -t bookmyseat/frontend-service:1.0.0 .

# Run container
docker run -p 4200:80 bookmyseat/frontend-service:1.0.0
```

### Docker Compose

```bash
# Start full stack
docker-compose up --build

# Access application
# http://localhost:4200
```

### Production Deployment

The production build uses Nginx to:
- Serve static files
- Handle SPA routing
- Proxy API requests to backend services
- Add security headers
- Enable gzip compression

```nginx
# API Proxying
location /api/movies/ {
  proxy_pass http://movie-service:8081/api/v1/;
}

location /api/reviews/ {
  proxy_pass http://review-service:8082/api/v1/;
}
```

## 🛠️ Troubleshooting

### Common Issues

<details>
<summary>🔴 Port 4200 Already in Use</summary>

**Problem**: `Port 4200 is already in use`

**Solutions**:
```bash
# Find process using port
lsof -i :4200

# Kill process
kill -9 <PID>

# OR use different port
ng serve --port 4201
```
</details>

<details>
<summary>🔴 Backend Connection Errors</summary>

**Problem**: Cannot connect to movie-service or review-service

**Solutions**:
```bash
# Check if backend services are running
curl http://localhost:8081/actuator/health
curl http://localhost:8082/actuator/health

# Verify environment configuration
cat src/environments/environment.ts

# Check browser console for CORS errors
# Open DevTools → Console
```
</details>

<details>
<summary>🔴 TailwindCSS Not Working</summary>

**Problem**: Tailwind classes not applying

**Solutions**:
```bash
# Verify TailwindCSS installation
npm list tailwindcss

# Check tailwind.config.js exists
cat tailwind.config.js

# Verify styles.css imports
cat src/styles.css

# Restart dev server
npm start
```
</details>

<details>
<summary>🔴 Build Failures</summary>

**Problem**: Build fails or deployment issues

**Solutions**:
```bash
# Clean build
rm -rf dist .angular node_modules
npm install
npm run build

# Check TypeScript errors
npx tsc --noEmit

# Build with verbose logging
ng build --verbose
```
</details>

## 🤝 Contributing

### Development Setup

```bash
# Fork and clone repository
git clone https://github.com/ALMGHAS/bookmyseat-frontend-service.git
cd bookmyseat-frontend-service

# Install dependencies
npm install

# Create feature branch
git checkout -b feature/your-feature-name

# Start dev server
npm start
```

### Code Standards

- **Angular Style Guide**: Follow official Angular style guide
- **Component Structure**: Use standalone components
- **TypeScript**: Strict mode enabled
- **Testing**: Write tests for new features
- **Documentation**: Update README for changes

### Pull Request Process

1. **Create Feature Branch**: `git checkout -b feature/add-movie-filter`
2. **Write Tests**: Ensure new code is tested
3. **Update Documentation**: Keep README current
4. **Run Tests**: `npm test`
5. **Build Check**: `npm run build`
6. **Submit PR**: Include description and test results

---

**Maintained by**: BookMySeat Development Team  
**License**: MIT  
**Support**: [Create an issue](https://github.com/ALMGHAS/bookmyseat-frontend-service/issues)

---

<div align="center">

**⭐ Star this repo if it helped you!**

[Report Bug](https://github.com/ALMGHAS/bookmyseat-frontend-service/issues) · [Request Feature](https://github.com/ALMGHAS/bookmyseat-frontend-service/issues)

</div>
