# Banking Frontend

Angular application providing user interface for banking operations including customer management, account administration, transaction processing, and financial reporting.

## 🎯 Overview

Modern single-page application built with Angular 20 standalone components, featuring reactive state management, type-safe API integration, and comprehensive test coverage.

**Current Implementation:**
- Core services and HTTP interceptors
- Health check functionality
- API integration layer
- Testing infrastructure with Jest
- Docker containerization with Nginx

## 🚀 Technology Stack

- **Angular 20.3.0** - Standalone components architecture
- **TypeScript 5.9.2** - Type-safe development
- **RxJS 7.8.0** - Reactive programming
- **Jest 30.2.0** - Unit testing
- **Nginx Alpine** - Production web server

## 📋 Prerequisites

**Docker Deployment:**
- Docker Engine 20.10+

**Local Development:**
- Node.js 20+ (LTS recommended)
- npm 10+

## ⚡ Quick Start

### Using Docker

```bash
# Build and run
docker build -t banking-frontend .
docker run -p 4200:80 banking-frontend

# Or use Docker Compose (from project root)
docker compose up frontend -d
```

Access at: http://localhost:4200

### Local Development

```bash
# Install dependencies
npm install

# Start development server with API proxy
npm start
```

Development server runs at http://localhost:4200 with hot reload.

**API Proxy:** The dev server automatically proxies API requests to backend services:
- `/api/v1/customers/*` → http://localhost:8081
- `/api/v1/accounts/*` → http://localhost:8082
- `/api/v1/transactions/*` → http://localhost:8082
- `/api/v1/reports/*` → http://localhost:8082

## 🗂️ Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── core/                       # Singleton services
│   │   │   ├── interceptors/
│   │   │   │   └── service-url.interceptor.ts
│   │   │   ├── models/
│   │   │   │   └── api-config.interface.ts
│   │   │   └── services/
│   │   │       └── health-check.service.ts
│   │   │
│   │   ├── features/                   # Feature modules (to be implemented)
│   │   │   ├── customers/
│   │   │   └── accounts/
│   │   │
│   │   ├── shared/                     # Shared components (to be implemented)
│   │   │   └── components/
│   │   │       ├── layout/
│   │   │       └── ui/
│   │   │
│   │   ├── app.config.ts               # Application configuration
│   │   ├── app.routes.ts               # Route definitions
│   │   ├── app.ts                      # Root component
│   │   └── app.spec.ts                 # Root component tests
│   │
│   ├── environments/
│   │   ├── environment.ts              # Production config
│   │   └── environment.development.ts  # Development config
│   │
│   ├── index.html
│   ├── main.ts
│   └── styles.css
│
├── coverage/                           # Test coverage reports
├── Dockerfile                          # Multi-stage build
├── nginx.conf                          # Nginx configuration
├── proxy.conf.json                     # Dev proxy config
├── angular.json
├── tsconfig.json
├── jest.config.ts
└── package.json
```

## 🔧 Development

### Available Scripts

```bash
# Development server with hot reload
npm start

# Production build
npm run build

# Build in watch mode
npm run watch

# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Code Generation

```bash
# Generate component
ng generate component features/customers/customer-list

# Generate service
ng generate service core/services/customer

# Generate interface
ng generate interface core/models/customer
```

### Environment Configuration

**Development (`environment.development.ts`):**
```typescript
export const environment = {
  production: false,
  apiBaseUrl: '/api/v1',  // Proxied to backend
  enableDebugTools: true
};
```

**Production (`environment.ts`):**
```typescript
export const environment = {
  production: true,
  apiBaseUrl: '/api/v1',  // Nginx reverse proxy
  enableDebugTools: false
};
```

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode (TDD)
npm run test:watch

# Run specific test
npm test -- health-check.service.spec.ts
```

**Coverage Reports:** `coverage/index.html`

## 🔌 API Integration

### HTTP Client Configuration

```typescript
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([serviceUrlInterceptor])
    ),
  ]
};
```

## 🚨 Troubleshooting

### Port 4200 Already in Use

```bash
# Find and kill process
lsof -i :4200
kill -9 <PID>

# Or use different port
ng serve --port 4201
```

### API Connection Refused

```bash
# Verify backend services are running
curl http://localhost:8081/actuator/health
curl http://localhost:8082/actuator/health

# Check proxy configuration
cat proxy.conf.json
```

### Build Errors

```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Clear Angular cache
rm -rf .angular
```

---

**Built with 🅰️ Angular 20 | 📘 TypeScript 5.9 | 🃏 Jest 30**
